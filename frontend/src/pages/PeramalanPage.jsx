import React, { useEffect, useState } from 'react';
import { ambilRekapPeramalan } from '../services/api';
import ForecastChart from '../components/ForecastChart';
import RecentTable from '../components/RecentTable';
import SESControlPanel from '../components/SESControlPanel';

function PeramalanPage() {
  const [rekap, setRekap] = useState([]);
  const [alphaTerbaik, setAlphaTerbaik] = useState(0.5);
  const [params, setParams] = useState({ stok: 100, buffer: 20, alpha: 0.5 });
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    ambilRekapPeramalan()
      .then(res => {
        if (res?.data && res.data.rekap) {
          setRekap(res.data.rekap);
          if (res.data.alphaTerbaik !== undefined) {
            setAlphaTerbaik(res.data.alphaTerbaik);
          }
        } else if (Array.isArray(res?.data)) {
          setRekap(res.data);
        } else if (Array.isArray(res)) {
          setRekap(res);
        }
      })
      .catch(err => {
        console.error('Error fetching peramalan:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleUpdate = (data) => {
    setParams(data);
    setNotification('Parameter SES diperbarui. Nilai alpha aktif disesuaikan.');
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            Peramalan Single Exponential Smoothing (SES)
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Analisis proyeksi kebutuhan stok berdasarkan pemulusan deret waktu historis penjualan.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-stone-200 px-4 py-2 rounded-xl shadow-2xs flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF6115]"></div>
            <div>
              <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Alpha Rekomendasi (Terbaik)</p>
              <p className="text-base font-bold text-[#C23E00] font-mono">α = {alphaTerbaik}</p>
            </div>
          </div>
        </div>
      </div>

      {notification && (
        <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 text-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[#C23E00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-xs font-semibold cursor-pointer">
            Tutup
          </button>
        </div>
      )}

      {/* Control Panel */}
      <SESControlPanel {...params} onUpdate={handleUpdate} />

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-xl border border-stone-200/90 shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100 flex-wrap gap-2">
          <div>
            <h2 className="text-base font-bold text-stone-900">
              Proyeksi Garis Peramalan SES
            </h2>
            <p className="text-xs text-stone-500">
              Perbandingan deret waktu antara data aktual dan garis proyeksi algoritma.
            </p>
          </div>
        </div>
        <div className="h-96 w-full relative">
          <ForecastChart
            penjualan={rekap.map(d => ({ tanggal: d.tanggal || d.minggu, jumlah: d.penjualan || d.aktual_botol || d.jumlah }))}
            ramalan={rekap.map(d => ({ tanggal: d.tanggal || d.minggu, ramalan: d.ramalan || d.ramalan_ses }))}
          />
        </div>
      </div>

      {/* Rekap Table */}
      <RecentTable data={rekap} judul="Tabel Rekapitulasi Peramalan SES & Evaluasi Error" />
    </div>
  );
}

export default PeramalanPage;
