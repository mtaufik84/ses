import express from "express";
import pool from "../config/db.js";
import { singleExponentialSmoothing } from "../services/sesService.js";

const router = express.Router();

// Eksekusi SES dari periode agregasi
export const runSES = async (req, res) => {
  try {
    const { product_id, alpha, period, created_by } = req.body;

    const [rows] = await pool.query(
      `SELECT qty_units FROM sales_period_agg
       WHERE product_id=? AND period=?
       ORDER BY period_start_date`,
      [product_id || 1, period || "WEEK"]
    );

    const data = rows.map((r) => Number(r.qty_units));
    if (data.length === 0) {
      return res.status(404).json({ error: "Data penjualan periodik tidak ditemukan" });
    }

    const alphaVal = Number(alpha) || 0.3;
    const results = singleExponentialSmoothing(data, alphaVal);

    let mse = results.reduce((s, r) => s + r.sq_error, 0) / results.length;
    let mape =
      (results.reduce((s, r) => s + Math.abs(r.error / (r.actual || 1)), 0) / results.length) * 100;

    const [run] = await pool.query(
      `INSERT INTO forecast_runs
       (product_id, period, method, alpha, mse, mape, created_by, created_at)
       VALUES (?, ?, 'SES', ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [product_id || 1, period || "WEEK", alphaVal, mse, mape, created_by || 1]
    );

    res.json({ run_id: run.insertId, alpha: alphaVal, mse, mape, results });
  } catch (err) {
    console.error("Error runSES:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Hitung peramalan interaktif (Frontend)
export const hitungPeramalan = async (req, res) => {
  try {
    const { alpha = 0.5 } = req.body;
    const [rows] = await pool.query(
      "SELECT tanggal, jumlah FROM penjualan ORDER BY tanggal ASC"
    );

    const data = rows.map((r) => Number(r.jumlah));
    const hasilRamalan = singleExponentialSmoothing(data, Number(alpha));

    res.json({ status: "sukses", alpha: Number(alpha), hasilRamalan });
  } catch (err) {
    console.error("Error hitungPeramalan:", err.message);
    res.status(500).json({ status: "error", pesan: err.message });
  }
};

// Ambil rekap tabel peramalan untuk Dashboard & Halaman Peramalan
export const ambilRekapPeramalan = async (req, res) => {
  try {
    // Cari run terbaik dari tgm99.db
    const [bestRuns] = await pool.query(
      "SELECT id, alpha, mse, mape FROM forecast_runs ORDER BY mse ASC LIMIT 1"
    );

    const bestRunId = bestRuns && bestRuns.length > 0 ? bestRuns[0].id : 2;
    const alphaTerbaik = bestRuns && bestRuns.length > 0 ? Number(bestRuns[0].alpha) : 0.3;

    // Ambil titik peramalan dari database
    const [points] = await pool.query(
      `SELECT period_start AS tanggal, 
              actual_y AS penjualan, 
              forecast_f AS ramalan, 
              error, abs_error, sq_error 
       FROM forecast_points 
       WHERE run_id = ? 
       ORDER BY period_start ASC`,
      [bestRunId]
    );

    if (points && points.length > 0) {
      return res.json({
        status: "sukses",
        data: {
          alphaTerbaik,
          rekap: points.map((p) => ({
            tanggal: p.tanggal,
            penjualan: p.penjualan != null ? Number(p.penjualan) : null,
            ramalan: p.ramalan != null ? Number(Number(p.ramalan).toFixed(2)) : 0,
            error: p.error != null ? Number(Number(p.error).toFixed(2)) : 0,
            abs_error: p.abs_error != null ? Number(Number(p.abs_error).toFixed(2)) : 0,
            sq_error: p.sq_error != null ? Number(Number(p.sq_error).toFixed(2)) : 0,
          })),
        },
      });
    }

    // Fallback: hitung dari tabel penjualan
    const [penjualanRows] = await pool.query(
      "SELECT tanggal, jumlah FROM penjualan ORDER BY tanggal ASC"
    );
    const data = penjualanRows.map((r) => Number(r.jumlah));
    const results = singleExponentialSmoothing(data, alphaTerbaik);

    const rekap = results.map((r, idx) => ({
      tanggal: penjualanRows[idx + 1]?.tanggal || `Periode ${idx + 2}`,
      penjualan: r.actual,
      ramalan: Number(r.forecast.toFixed(2)),
      error: Number(r.error.toFixed(2)),
      abs_error: Number(r.abs_error.toFixed(2)),
      sq_error: Number(r.sq_error.toFixed(2)),
    }));

    res.json({
      status: "sukses",
      data: {
        alphaTerbaik,
        rekap,
      },
    });
  } catch (err) {
    console.error("Error ambilRekapPeramalan:", err.message);
    res.status(500).json({ status: "error", pesan: err.message, data: { alphaTerbaik: 0.5, rekap: [] } });
  }
};

router.post("/run", runSES);
router.post("/hitung", hitungPeramalan);
router.get("/rekap", ambilRekapPeramalan);

export default router;
