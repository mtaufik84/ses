import React, { useEffect, useState } from "react";
import ForecastChart from "../components/ForecastChart"; 
import StatCard from "../components/StatCard"; 
import { ambilPenjualan, ambilRekapPeramalan } from "../services/api";

const Dashboard = () => {
  const [penjualan, setPenjualan] = useState([]);
  const [ramalan, setRamalan] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const dataPenjualan = await ambilPenjualan();
        const dataRamalan = await ambilRekapPeramalan();
        setPenjualan(dataPenjualan?.data || (Array.isArray(dataPenjualan) ? dataPenjualan : []));
        setRamalan(dataRamalan?.data?.rekap || (Array.isArray(dataRamalan?.rekap) ? dataRamalan.rekap : (Array.isArray(dataRamalan) ? dataRamalan : [])));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalPenjualan = Array.isArray(penjualan)
    ? penjualan.reduce((acc, cur) => acc + Number(cur.jumlah || cur.aktual_botol || 0), 0)
    : 0;

  const totalRamalan = Array.isArray(ramalan)
    ? ramalan.reduce((acc, cur) => acc + Number(cur.ramalan || cur.ramalan_ses || 0), 0)
    : 0;

  return (
    <div className="w-full space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            Dashboard Peramalan Penjualan
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Visualisasi tren penjualan historis dan komparasi hasil peramalan Single Exponential Smoothing (SES).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-stone-200 text-stone-700 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#FF6115]"></span>
            Status Sinkronisasi Aktif
          </span>
        </div>
      </div>

      {/* Stat Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-white rounded-xl border border-stone-200 p-5 animate-pulse">
              <div className="h-4 bg-stone-200 rounded w-24 mb-3"></div>
              <div className="h-8 bg-stone-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Penjualan"
            value={totalPenjualan.toLocaleString('id-ID')}
            color="green"
          />
          <StatCard
            title="Total Ramalan"
            value={totalRamalan > 0 ? totalRamalan.toLocaleString('id-ID', { maximumFractionDigits: 2 }) : '-'}
            color="blue"
          />
          <StatCard
            title="Jumlah Data Penjualan"
            value={penjualan.length}
            color="orange"
          />
          <StatCard
            title="Periode Terhitung"
            value={ramalan.length > 0 ? ramalan.length : (penjualan.length > 0 ? penjualan.length : '-')}
            color="purple"
          />
        </div>
      )}

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-xl border border-stone-200/90 shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100 flex-wrap gap-2">
          <div>
            <h2 className="text-base font-bold text-stone-900">
              Grafik Komparasi Penjualan vs Ramalan SES
            </h2>
            <p className="text-xs text-stone-500">
              Menampilkan garis penjualan aktual dibandingkan dengan model pemulusan eksponensial.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-stone-600">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
              Penjualan Aktual
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-1.5 bg-[#FF6115] rounded-sm"></span>
              Ramalan SES
            </span>
          </div>
        </div>
        <div className="h-96 w-full relative">
          <ForecastChart penjualan={penjualan} ramalan={ramalan} />
        </div>
      </div>

      {/* Historis Data Table */}
      <div className="bg-white rounded-xl border border-stone-200/90 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-base font-bold text-stone-900">
              Data Penjualan Historis
            </h2>
            <p className="text-xs text-stone-500">
              Log riwayat transaksi penjualan botol per periode/kemasan.
            </p>
          </div>
          <span className="text-xs font-semibold text-stone-600 bg-[#FFFCF4] px-3 py-1 rounded-full border border-stone-200">
            {penjualan.length} transaksi
          </span>
        </div>

        {penjualan.length === 0 ? (
          <div className="p-8 text-center text-stone-400">
            <p className="text-sm font-medium text-stone-600">Belum ada data penjualan tercatat.</p>
            <p className="text-xs text-stone-400 mt-1">Gunakan menu Input Penjualan untuk menambahkan data.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FFFCF4]/90 border-b border-stone-200">
                  <th className="px-6 py-3.5 text-xs font-bold text-stone-600 uppercase tracking-wider">
                    Minggu / Tanggal
                  </th>
                  <th className="px-6 py-3.5 text-xs font-bold text-stone-600 uppercase tracking-wider">
                    Varian Kemasan
                  </th>
                  <th className="px-6 py-3.5 text-xs font-bold text-stone-600 uppercase tracking-wider text-right">
                    Jumlah Aktual (Botol)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm">
                {penjualan.map((row, idx) => {
                  const varian = row.ukuran || row.kemasan || 'Standar';
                  const jumlah = Number(row.jumlah || row.aktual_botol || 0);

                  return (
                    <tr key={idx} className="hover:bg-[#FFFCF4]/80 transition-colors">
                      <td className="px-6 py-3.5 text-stone-700 font-medium">
                        {row.tanggal || row.minggu || `Periode ${idx + 1}`}
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FFFCF4] text-stone-700 border border-stone-200">
                          {varian}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right font-bold text-stone-900">
                        {jumlah.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;