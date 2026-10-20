import sqlite3 from 'sqlite3';
import path from 'path';

const paths = [
  path.resolve('./backend/tgm99.db'),
  path.resolve('./backend/src/config/tgm99.db')
];

for (const p of paths) {
  console.log('--- Inspecting:', p);
  const db = new sqlite3.Database(p);
  await new Promise((resolve) => {
    db.all("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'", (err, tables) => {
      if (err) {
        console.error('Error:', err.message);
        return resolve();
      }
      console.log('Tables:', tables.map(t => t.name));
      let done = 0;
      if (tables.length === 0) return resolve();
      tables.forEach(t => {
        db.get(`SELECT COUNT(*) as count FROM "${t.name}"`, (e, r) => {
          if (!e) console.log(`  ${t.name}: ${r.count} rows`);
          done++;
          if (done === tables.length) resolve();
        });
      });
    });
  });
  db.close();
}
