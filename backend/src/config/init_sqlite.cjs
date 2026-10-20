const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const sqlFilePath = path.resolve(__dirname, '../../../tgm99.sql');
const dbFilePath = path.resolve(__dirname, '../../tgm99.db');

console.log('Reading SQL file from:', sqlFilePath);
if (fs.existsSync(dbFilePath)) {
  fs.unlinkSync(dbFilePath);
  console.log('Removed old database file:', dbFilePath);
}

const db = new sqlite3.Database(dbFilePath);

const schema = `
CREATE TABLE IF NOT EXISTS \`products\` (
  \`id\` INTEGER PRIMARY KEY AUTOINCREMENT,
  \`sku\` TEXT NOT NULL UNIQUE,
  \`name\` TEXT NOT NULL,
  \`size_ml\` INTEGER NOT NULL,
  \`unit\` TEXT NOT NULL DEFAULT 'bottle',
  \`is_active\` INTEGER NOT NULL DEFAULT 1,
  \`created_at\` TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS \`users\` (
  \`id\` INTEGER PRIMARY KEY AUTOINCREMENT,
  \`email\` TEXT NOT NULL UNIQUE,
  \`name\` TEXT DEFAULT NULL,
  \`password_hash\` TEXT DEFAULT NULL,
  \`created_at\` TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS \`sales_import_batches\` (
  \`id\` INTEGER PRIMARY KEY AUTOINCREMENT,
  \`uploaded_by\` INTEGER DEFAULT NULL,
  \`source_filename\` TEXT NOT NULL,
  \`source_type\` TEXT NOT NULL,
  \`status\` TEXT NOT NULL DEFAULT 'processed',
  \`row_count\` INTEGER NOT NULL DEFAULT 0,
  \`notes\` TEXT DEFAULT NULL,
  \`uploaded_at\` TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS \`sales_daily\` (
  \`id\` INTEGER PRIMARY KEY AUTOINCREMENT,
  \`product_id\` INTEGER NOT NULL,
  \`sales_date\` TEXT NOT NULL,
  \`qty_units\` INTEGER NOT NULL DEFAULT 0,
  \`import_batch_id\` INTEGER DEFAULT NULL,
  \`created_at\` TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS \`sales_period_agg\` (
  \`id\` INTEGER PRIMARY KEY AUTOINCREMENT,
  \`product_id\` INTEGER NOT NULL,
  \`period\` TEXT NOT NULL,
  \`period_start_date\` TEXT NOT NULL,
  \`period_end_date\` TEXT NOT NULL,
  \`qty_units\` INTEGER NOT NULL DEFAULT 0,
  \`computed_at\` TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`computed_from_min\` TEXT DEFAULT NULL,
  \`computed_from_max\` TEXT DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS \`forecast_runs\` (
  \`id\` INTEGER PRIMARY KEY AUTOINCREMENT,
  \`product_id\` INTEGER NOT NULL,
  \`period\` TEXT NOT NULL,
  \`method\` TEXT NOT NULL DEFAULT 'SES',
  \`alpha\` REAL NOT NULL,
  \`horizon_periods\` INTEGER NOT NULL DEFAULT 1,
  \`train_start_date\` TEXT DEFAULT NULL,
  \`train_end_date\` TEXT DEFAULT NULL,
  \`mse\` REAL DEFAULT NULL,
  \`mape\` REAL DEFAULT NULL,
  \`mae\` REAL DEFAULT NULL,
  \`created_by\` INTEGER DEFAULT NULL,
  \`created_at\` TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS \`forecast_points\` (
  \`id\` INTEGER PRIMARY KEY AUTOINCREMENT,
  \`run_id\` INTEGER NOT NULL,
  \`period_start\` TEXT NOT NULL,
  \`actual_y\` REAL DEFAULT NULL,
  \`forecast_f\` REAL DEFAULT NULL,
  \`error\` REAL DEFAULT NULL,
  \`abs_error\` REAL DEFAULT NULL,
  \`sq_error\` REAL DEFAULT NULL,
  \`created_at\` TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS \`buffer_settings\` (
  \`id\` INTEGER PRIMARY KEY AUTOINCREMENT,
  \`product_id\` INTEGER NOT NULL,
  \`effective_from\` TEXT NOT NULL,
  \`buffer_units\` INTEGER NOT NULL DEFAULT 0,
  \`created_by\` INTEGER DEFAULT NULL,
  \`created_at\` TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS \`inventory_snapshots\` (
  \`id\` INTEGER PRIMARY KEY AUTOINCREMENT,
  \`product_id\` INTEGER NOT NULL,
  \`snapshot_date\` TEXT NOT NULL,
  \`stock_units\` INTEGER NOT NULL DEFAULT 0,
  \`created_by\` INTEGER DEFAULT NULL,
  \`notes\` TEXT DEFAULT NULL,
  \`created_at\` TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS \`production_recommendations\` (
  \`id\` INTEGER PRIMARY KEY AUTOINCREMENT,
  \`run_id\` INTEGER NOT NULL,
  \`target_period_start\` TEXT NOT NULL,
  \`forecast_qty\` REAL NOT NULL,
  \`buffer_qty\` INTEGER NOT NULL DEFAULT 0,
  \`stock_qty_used\` INTEGER NOT NULL DEFAULT 0,
  \`recommended_qty\` INTEGER NOT NULL DEFAULT 0,
  \`formula_version\` TEXT NOT NULL DEFAULT 'forecast+buffer-stock',
  \`created_at\` TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS \`penjualan\` (
  \`id\` INTEGER PRIMARY KEY AUTOINCREMENT,
  \`tanggal\` TEXT NOT NULL,
  \`ukuran\` TEXT DEFAULT NULL,
  \`jumlah\` INTEGER NOT NULL,
  \`created_at\` TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`;

db.serialize(() => {
  db.exec(schema, (err) => {
    if (err) {
      console.error('Error creating schema:', err);
      process.exit(1);
    }
    console.log('Schema created successfully.');

    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

    // Extract all INSERT INTO statements respecting quotes
    function extractStatements(sql) {
      const statements = [];
      let inQuote = false;
      let quoteChar = '';
      let current = '';

      for (let i = 0; i < sql.length; i++) {
        const char = sql[i];
        const prevChar = i > 0 ? sql[i - 1] : '';

        if (!inQuote && (char === "'" || char === '"')) {
          inQuote = true;
          quoteChar = char;
          current += char;
        } else if (inQuote && char === quoteChar && prevChar !== '\\') {
          inQuote = false;
          current += char;
        } else if (!inQuote && char === ';') {
          const trimmed = current.trim();
          const insertIdx = trimmed.indexOf('INSERT INTO');
          if (insertIdx !== -1) {
            statements.push(trimmed.slice(insertIdx) + ';');
          }
          current = '';
        } else {
          current += char;
        }
      }
      return statements;
    }

    const insertStatements = extractStatements(sqlContent);
    let insertCount = 0;

    db.exec('BEGIN TRANSACTION;', (txErr) => {
      if (txErr) {
        console.error('Error starting transaction:', txErr);
        process.exit(1);
      }

      insertStatements.forEach((stmt) => {
        insertCount++;
        db.run(stmt, (insErr) => {
          if (insErr) {
            console.error('Error executing insert:', insErr.message);
          }
        });
      });

      // Also populate sample data to 'penjualan' table from sales_daily
      db.run(`
        INSERT INTO penjualan (tanggal, ukuran, jumlah, created_at)
        SELECT s.sales_date, p.name, s.qty_units, s.created_at
        FROM sales_daily s
        JOIN products p ON s.product_id = p.id
      `, (err) => {
        if (err) console.log('Notice on penjualan sync:', err.message);

        db.exec('COMMIT;', (commitErr) => {
          if (commitErr) {
            console.error('Error committing:', commitErr);
          } else {
            console.log(`Successfully imported ${insertCount} INSERT statements into SQLite!`);
          }

          // Verify counts
          db.all("SELECT count(*) as cnt FROM sales_daily", (e, r) => {
            console.log('sales_daily count:', r);
            db.all("SELECT count(*) as cnt FROM products", (e, r) => {
              console.log('products count:', r);
              db.all("SELECT count(*) as cnt FROM forecast_runs", (e, r) => {
                console.log('forecast_runs count:', r);
                db.close(() => {
                  try {
                    fs.copyFileSync(dbFilePath, path.resolve(__dirname, './tgm99.db'));
                    console.log('Database synced to src/config/tgm99.db');
                  } catch (syncErr) {
                    // ignore
                  }
                });
              });
            });
          });
        });
      });
    });
  });
});
