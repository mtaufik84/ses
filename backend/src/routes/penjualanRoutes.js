import express from "express";
import multer from "multer";
import { uploadSalesCSV } from "../controllers/uploadSalesCSV.js";
import { aggregateMonthly } from "../utils/aggregator.js";
import pool from "../config/db.js";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

// Upload CSV sales & agregasi
router.post("/upload", upload.single("file"), uploadSalesCSV);

router.post("/aggregate", async (req, res) => {
  try {
    await aggregateMonthly(pool);
    res.json({ message: "Agregasi penjualan bulanan berhasil" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint data penjualan untuk frontend
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, tanggal, ukuran, jumlah, created_at FROM penjualan ORDER BY tanggal DESC"
    );
    res.json({ status: "sukses", data: rows });
  } catch (err) {
    console.error("Error get penjualan:", err.message);
    res.status(500).json({ status: "error", pesan: err.message, data: [] });
  }
});

router.post("/tambah", async (req, res) => {
  try {
    const { tanggal, ukuran, jumlah, kemasan220, kemasan330, kemasan600 } = req.body;

    if (kemasan220 || kemasan330 || kemasan600) {
      if (kemasan220 > 0) {
        await pool.query("INSERT INTO penjualan (tanggal, ukuran, jumlah) VALUES (?, 'AMDK 220 ml', ?)", [tanggal, Number(kemasan220)]);
        await pool.query("INSERT INTO sales_daily (product_id, sales_date, qty_units) VALUES (1, ?, ?)", [tanggal, Number(kemasan220)]);
      }
      if (kemasan330 > 0) {
        await pool.query("INSERT INTO penjualan (tanggal, ukuran, jumlah) VALUES (?, 'AMDK 330 ml', ?)", [tanggal, Number(kemasan330)]);
        await pool.query("INSERT INTO sales_daily (product_id, sales_date, qty_units) VALUES (2, ?, ?)", [tanggal, Number(kemasan330)]);
      }
      if (kemasan600 > 0) {
        await pool.query("INSERT INTO penjualan (tanggal, ukuran, jumlah) VALUES (?, 'AMDK 600 ml', ?)", [tanggal, Number(kemasan600)]);
        await pool.query("INSERT INTO sales_daily (product_id, sales_date, qty_units) VALUES (3, ?, ?)", [tanggal, Number(kemasan600)]);
      }
      return res.json({ status: "sukses", message: "Data penjualan kemasan berhasil disimpan" });
    }

    const [result] = await pool.query(
      "INSERT INTO penjualan (tanggal, ukuran, jumlah) VALUES (?, ?, ?)",
      [tanggal, ukuran || "Default", Number(jumlah) || 0]
    );

    res.json({ status: "sukses", data: { id: result.insertId, tanggal, ukuran, jumlah } });
  } catch (err) {
    console.error("Error input penjualan:", err.message);
    res.status(500).json({ status: "error", pesan: err.message });
  }
});

export default router;
