import pool from "../config/db.js";
import csv from "csv-parser";
import fs from "fs";

export const uploadSalesCSV = async (req, res) => {
  const { uploaded_by } = req.body;

  const [batch] = await pool.query(
    `INSERT INTO sales_import_batches 
     (uploaded_by, source_filename, source_type, status, uploaded_at)
     VALUES (?, ?, 'csv', 'processing', NOW())`,
    [uploaded_by, req.file.originalname]
  );

  const batchId = batch.insertId;
  const rows = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (row) => rows.push(row))
    .on("end", async () => {
      for (const r of rows) {
        await pool.query(
          `INSERT INTO sales_daily 
           (product_id, sales_date, qty_units, import_batch_id, created_at)
           VALUES (?, ?, ?, ?, NOW())`,
          [r.product_id, r.sales_date, r.qty_units, batchId]
        );
      }

      await pool.query(
        `UPDATE sales_import_batches 
         SET status='processed', row_count=? WHERE id=?`,
        [rows.length, batchId]
      );

      res.json({ message: "Upload sukses", rows: rows.length });
    });
};
