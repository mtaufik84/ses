import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lokasi file database SQLite (mendukung konfigurasi .env DB_FILE atau DB_PATH)
const dbFileName = process.env.DB_FILE || (process.env.DB_NAME ? `${process.env.DB_NAME}.db` : "tgm99.db");

const candidatePaths = [
  process.env.DB_PATH ? path.resolve(process.env.DB_PATH) : null,
  path.resolve(__dirname, `../../${dbFileName}`),
  path.resolve(__dirname, `./${dbFileName}`),
  path.resolve(process.cwd(), dbFileName),
  path.resolve(process.cwd(), `backend/${dbFileName}`),
].filter(Boolean);

// Pilih path yang ada filenya, atau fallback ke path utama
const dbPath = candidatePaths.find((p) => fs.existsSync(p)) || candidatePaths[0];

const sqlite = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Gagal membuka file SQLite:", err.message);
  } else {
    console.log("Database SQLite terhubung:", dbPath);
  }
});

// Helper untuk adaptasi fungsi tanggal/waktu MySQL ke SQLite
function adaptSql(sql) {
  return sql
    .replace(/\bNOW\(\)/gi, "CURRENT_TIMESTAMP")
    .replace(/\bLAST_DAY\(([^)]+)\)/gi, "date($1, 'start of month', '+1 month', '-1 day')")
    .replace(/\bDATE_FORMAT\(([^,]+),\s*['"]%Y-%m-01['"]\)/gi, "strftime('%Y-%m-01', $1)")
    .replace(/\bYEAR\(([^)]+)\)/gi, "strftime('%Y', $1)")
    .replace(/\bMONTH\(([^)]+)\)/gi, "strftime('%m', $1)");
}

// Pool adapter yang kompatibel 100% dengan antarmuka mysql2/promise
const pool = {
  query(sql, params = []) {
    return new Promise((resolve, reject) => {
      const cleanSql = adaptSql(sql.trim());
      const firstWord = cleanSql.trim().toUpperCase().split(/\s+/)[0];
      const isRead = ["SELECT", "PRAGMA", "WITH", "EXPLAIN"].includes(firstWord);

      if (isRead) {
        sqlite.all(cleanSql, params, (err, rows) => {
          if (err) return reject(err);
          resolve([rows || [], []]);
        });
      } else {
        sqlite.run(cleanSql, params, function (err) {
          if (err) return reject(err);
          resolve([{ insertId: this.lastID, affectedRows: this.changes }, []]);
        });
      }
    });
  },

  execute(sql, params = []) {
    return this.query(sql, params);
  },

  getConnection() {
    return Promise.resolve({
      query: (sql, params) => pool.query(sql, params),
      execute: (sql, params) => pool.query(sql, params),
      beginTransaction: () => pool.query("BEGIN TRANSACTION"),
      commit: () => pool.query("COMMIT"),
      rollback: () => pool.query("ROLLBACK"),
      release: () => {},
    });
  },

  db: sqlite,
  dbPath: dbPath,
};

export default pool;
