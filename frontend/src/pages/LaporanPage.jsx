import React, { useEffect, useState } from 'react';
import { ambilRekapPeramalan } from '../services/api';
import RecentTable from '../components/RecentTable';

function LaporanPage() {
  const [rekap, setRekap] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    ambilRekapPeramalan()
      .then(res => {
        if (res?.data && res.data.rekap) {
          setRekap(res.data.rekap);
        } else if (Array.isArray(res?.data)) {
          setRekap(res.data);
        } else if (Array.isArray(res)) {
          setRekap(res);
        }
      })
      .catch(err => {
        console.error('Error fetching laporan:', err);
        setRekap([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    if (rekap.length === 0) return;
    const headers = Object.keys(rekap[0]).join(',');
    const rows = rekap.map(row => Object.values(row).map(val => `"${val}"`).join(','));
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'laporan_peramalan_ses.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalPenjualan = rekap.reduce((acc, cur) => acc + Number(cur.penjualan || cur.aktual_botol || cur.jumlah || 0), 0);
  const totalRamalan = rekap.reduce((acc, cur) => acc + Number(cur.ramalan || cur.ramalan_ses || 0), 0);
  const avgRamalan = rekap.length > 0 ? (totalRamalan / rekap.length).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            Laporan Perencanaan & Rekapitulasi Peramalan
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Rekapitulasi formal data penjualan, model peramalan Single Exponential Smoothing, dan estimasi produksi.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            disabled={rekap.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-[#FFFCF4] border border-stone-300 text-stone-700 hover:text-stone-900 text-xs font-semibold rounded-lg shadow-2xs hover:shadow transition-all disabled:opacity-50 cursor-pointer"
          >
            <svg className="w-4 h-4 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF6115] hover:bg-[#EA4E00] active:bg-[#C23E00] text-stone-950 text-xs font-bold rounded-lg shadow-xs hover:shadow transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.25} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Cetak / Simpan PDF
          </button>
        </div>
      </div>

      {/* Report Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-xs">
          <p className="text-xs font-semibold uppercase text-stone-500">Total Periode Tercatat</p>
          <p className="text-2xl font-bold text-stone-900 mt-1">{rekap.length} <span className="text-xs font-normal text-stone-500">Siklus</span></p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-xs">
          <p className="text-xs font-semibold uppercase text-stone-500">Total Akumulasi Aktual</p>
          <p className="text-2xl font-bold text-emerald-700 mt-1">{totalPenjualan.toLocaleString('id-ID')} <span className="text-xs font-normal text-stone-500">Botol</span></p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-xs">
          <p className="text-xs font-semibold uppercase text-stone-500">Rata-Rata Ramalan / Periode</p>
          <p className="text-2xl font-bold text-[#C23E00] mt-1">{avgRamalan} <span className="text-xs font-normal text-stone-500">Botol</span></p>
        </div>
      </div>

      {/* Table Component */}
      <RecentTable data={rekap} judul="Tabel Rekapitulasi Peramalan & Rencana Produksi" />
    </div>
  );
}

export default LaporanPage;
