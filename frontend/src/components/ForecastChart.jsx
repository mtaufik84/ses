import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const ForecastChart = ({ penjualan = [], ramalan = [] }) => {
  const penjualanData = Array.isArray(penjualan) ? penjualan : [];
  const ramalanData = Array.isArray(ramalan) ? ramalan : [];

  // Handle label format
  const labels = penjualanData.length > 0
    ? penjualanData.map((p, idx) => p.tanggal || p.minggu || `Periode ${idx + 1}`)
    : ramalanData.map((r, idx) => r.tanggal || r.minggu || `Periode ${idx + 1}`);

  const penjualanValues = penjualanData.map((p) => Number(p.jumlah || p.aktual_botol || 0));
  const ramalanValues = ramalanData.map((r) => Number(r.ramalan || r.ramalan_ses || 0));

  if (penjualanData.length === 0 && ramalanData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-80 bg-[#FFFCF4]/60 rounded-xl border border-dashed border-stone-300 p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-[#FF6115] mb-3">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A2.25 2.25 0 013 18.75v-5.625zM10.5 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM18 4.125c0-.621.504-1.125 1.125-1.125h2.25C21.996 3 22.5 3.504 22.5 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-stone-700">Belum ada data grafik</p>
        <p className="text-xs text-stone-400 mt-1">Data penjualan atau peramalan akan muncul di sini secara otomatis.</p>
      </div>
    );
  }

  const data = {
    labels: labels.length > 0 ? labels : ['1'],
    datasets: [
      {
        label: "Penjualan Aktual",
        data: penjualanValues,
        borderColor: "#059669", // Emerald 600
        backgroundColor: "rgba(5, 150, 105, 0.08)",
        borderWidth: 2.5,
        tension: 0.35,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "#FFFCF4", // Porcelain dot
        pointBorderColor: "#059669",
        pointBorderWidth: 2,
      },
      {
        label: "Ramalan SES (Single Exp. Smoothing)",
        data: ramalanValues,
        borderColor: "#FF6115", // Neon Orange
        backgroundColor: "rgba(255, 97, 21, 0.08)",
        borderWidth: 2.75,
        borderDash: [6, 4],
        tension: 0.35,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "#FFFCF4", // Porcelain dot
        pointBorderColor: "#FF6115",
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top",
        align: "end",
        labels: {
          color: "#44403C",
          font: { size: 12, weight: '500', family: 'system-ui' },
          padding: 18,
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 8,
          boxHeight: 8,
        }
      },
      tooltip: {
        backgroundColor: "rgba(24, 21, 19, 0.95)", // Deep warm obsidian
        titleColor: "#FFFCF4",
        bodyColor: "#E7E5E4",
        titleFont: { size: 12, weight: '600' },
        bodyFont: { size: 12 },
        padding: 12,
        cornerRadius: 8,
        boxPadding: 4,
        usePointStyle: true,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Volume (Botol / Unit)',
          color: '#78716C',
          font: { size: 11, weight: '500' }
        },
        ticks: {
          color: '#A8A29E',
          font: { size: 11 },
          padding: 8,
        },
        grid: {
          color: 'rgba(231, 229, 228, 0.7)',
        },
        border: {
          dash: [4, 4],
        }
      },
      x: {
        title: {
          display: true,
          text: 'Periode / Tanggal',
          color: '#78716C',
          font: { size: 11, weight: '500' }
        },
        ticks: {
          color: '#A8A29E',
          font: { size: 11 },
          maxRotation: 45,
          minRotation: 0,
        },
        grid: {
          display: false,
        }
      }
    }
  };

  return <Line options={options} data={data} />;
};

export default ForecastChart;
