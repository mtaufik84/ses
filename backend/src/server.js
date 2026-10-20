import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import salesRoutes from "./routes/penjualanRoutes.js";
import forecastRoutes from "./routes/forecastRoutes.js";

import pool from "./config/db.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes penjualan (mendukung /api/sales dan /api/penjualan)
app.use("/api/sales", salesRoutes);
app.use("/api/penjualan", salesRoutes);

// Routes peramalan (mendukung /api/forecast dan /api/peramalan)
app.use("/api/forecast", forecastRoutes);
app.use("/api/peramalan", forecastRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    database: `SQLite (${pool.dbPath ? pool.dbPath.split(/[\\/]/).pop() : "tgm99.db"})`,
    dbPath: pool.dbPath,
    timestamp: new Date(),
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Database connected: SQLite (${pool.dbPath || "tgm99.db"})`);
});
