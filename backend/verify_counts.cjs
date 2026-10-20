const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const sql = fs.readFileSync('tgm99.sql', 'utf8');
const tables = [
  'products', 'users', 'sales_import_batches', 'sales_daily',
  'sales_period_agg', 'forecast_runs', 'forecast_points',
  'buffer_settings', 'inventory_snapshots', 'production_recommendations'
];

console.log('--- Counts in tgm99.sql ---');
for (const t of tables) {
  const regex = new RegExp('INSERT INTO [`"]?' + t + '[`"]?\\s*\\([^)]*\\)\\s*VALUES\\s*([\\s\\S]*?);', 'gi');
  let match;
  let rowCount = 0;
  while ((match = regex.exec(sql)) !== null) {
    // Count tuples: rows are separated by ),\n( or ), (
    const valuesPart = match[1];
    const tuples = valuesPart.split(/\),\s*\(/g);
    rowCount += tuples.length;
  }
  console.log(`${t}: ~${rowCount} rows in SQL`);
}

const db = new sqlite3.Database('backend/tgm99.db');
console.log('\n--- Counts in backend/tgm99.db ---');
tables.concat(['penjualan']).forEach(t => {
  db.get(`SELECT COUNT(*) as count FROM "${t}"`, (err, row) => {
    if (err) console.error(t, err.message);
    else console.log(`${t}: ${row.count} rows in SQLite`);
  });
});
