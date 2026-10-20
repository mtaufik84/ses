import React, { useState } from 'react';
import SESControlPanel from '../components/SESControlPanel';

function KelolaStokBufferPage() {
  const [params, setParams] = useState({ stok: 100, buffer: 20, alpha: 0.5 });
  const [successToast, setSuccessToast] = useState(false);

  const handleUpdate = (data) => {
    setParams(data);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-2">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            Kelola Stok Gudang & Buffer Cadangan
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Penyesuaian parameter persediaan fisik, buffer pengaman, dan koefisien peramalan SES.
          </p>
        </div>
      </div>

      {successToast && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium">Parameter stok dan alpha berhasil diperbarui ke dalam sistem.</span>
          </div>
          <button onClick={() => setSuccessToast(false)} className="text-xs font-semibold cursor-pointer">
            Tutup
          </button>
        </div>
      )}

      {/* Main Control Panel */}
      <SESControlPanel {...params} onUpdate={handleUpdate} />

      {/* Contextual Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Monitoring Persediaan Aktif */}
        <div className="bg-white rounded-xl border border-stone-200/90 shadow-xs p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">Status Persediaan Terkonfigurasi</h3>
              <p className="text-xs text-stone-500">Nilai aktif yang digunakan simulasi produksi</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#FFFCF4] border border-stone-200">
              <span className="text-xs font-semibold text-stone-600">Stok Fisik Gudang</span>
              <span className="text-sm font-bold text-stone-900">{params.stok} Botol</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#FFFCF4] border border-stone-200">
              <span className="text-xs font-semibold text-stone-600">Buffer Stock (Safety)</span>
              <span className="text-sm font-bold text-[#C23E00]">{params.buffer} Botol</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#FFFCF4] border border-stone-200">
              <span className="text-xs font-semibold text-stone-600">Bobot Alpha SES (α)</span>
              <span className="text-sm font-bold text-emerald-700">{params.alpha}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Penjelasan Konsep Algoritma */}
        <div className="bg-white rounded-xl border border-stone-200/90 shadow-xs p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#C23E00] border border-orange-200/80 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">Prinsip Buffer & Nilai Alpha</h3>
              <p className="text-xs text-stone-500">Panduan optimasi peramalan persediaan</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-stone-600 leading-relaxed pt-2">
            <p>
              <strong className="text-stone-900">Buffer Stock</strong> bertindak sebagai cadangan pengaman untuk mengantisipasi lonjakan permintaan tak terduga serta mencegah risiko kehabisan stok (*stockout*).
            </p>
            <p>
              <strong className="text-stone-900">Parameter Alpha (α)</strong> menentukan sensitivitas model:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-stone-600">
              <li><strong className="text-stone-800">Alpha tinggi (mendekati 1.0):</strong> Sangat responsif terhadap perubahan data transaksi terakhir.</li>
              <li><strong className="text-stone-800">Alpha rendah (mendekati 0.1):</strong> Lebih stabil dan memuluskan fluktuasi jangka pendek.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KelolaStokBufferPage;
