import React, { useState } from 'react';
import SESControlPanel from '../components/SESControlPanel';

function SimulasiProduksiPage() {
  const [params, setParams] = useState({ stok: 100, buffer: 20, alpha: 0.5 });
  const [produksi, setProduksi] = useState(200 + 20 - 100); // 120 initial recommendation

  const handleUpdate = (data) => {
    setParams(data);
    const hasilProduksi = 200 + data.buffer - data.stok; // rumus Ft+1 + Buffer - Stok
    setProduksi(hasilProduksi);
  };

  const ramalanForecast = 200; // Ft+1 estimasi

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
          Simulasi Kebutuhan Produksi
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          Kalkulasi kuantitas target produksi pabrik berdasarkan ramalan periode mendatang, persediaan gudang, dan stok penyangga.
        </p>
      </div>

      {/* Control Panel */}
      <SESControlPanel {...params} onUpdate={handleUpdate} />

      {/* Simulation Result & Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Recommendation KPI Card */}
        <div className="md:col-span-1 bg-gradient-to-br from-[#241A15] via-[#1A1411] to-[#120E0C] border border-[#3A2D25] text-white rounded-xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF8749]">
                Target Produksi
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF6115] animate-ping"></span>
            </div>
            <p className="text-xs text-stone-300">Rekomendasi Batch Pabrik:</p>
            <div className="my-3">
              <span className="text-4xl font-extrabold tracking-tight text-[#FFFCF4] font-mono">
                {produksi > 0 ? produksi.toLocaleString('id-ID') : 0}
              </span>
              <span className="text-sm font-medium text-stone-300 ml-2">Botol</span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#3A2D25]">
            {produksi > 0 ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FF6115]/20 text-[#FF8749] border border-[#FF6115]/40">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6115]"></span>
                Jadwalkan Lini Produksi
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-stone-800 text-stone-300 border border-stone-700">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-400"></span>
                Stok Fisik Masih Mencukupi
              </div>
            )}
          </div>
        </div>

        {/* Calculation Step Breakdown Card */}
        <div className="md:col-span-2 bg-white rounded-xl border border-stone-200/90 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
              <h2 className="text-sm font-bold text-stone-900">
                Rincian Rumus Perhitungan Produksi
              </h2>
              <span className="text-xs font-mono font-semibold text-stone-600 bg-[#FFFCF4] border border-stone-200 px-2.5 py-0.5 rounded">
                Produksi = (Ft+1 + Buffer) - Stok
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 my-4">
              <div className="p-3.5 rounded-lg bg-[#FFFCF4] border border-stone-200/80">
                <p className="text-[11px] font-semibold text-stone-500 uppercase">Ramalan (Ft+1)</p>
                <p className="text-lg font-bold text-stone-900 mt-1">{ramalanForecast} <span className="text-xs font-normal text-stone-500">unit</span></p>
                <p className="text-[10px] text-stone-400 mt-1">Ekspektasi permintaan</p>
              </div>

              <div className="p-3.5 rounded-lg bg-orange-50/70 border border-orange-200/80">
                <p className="text-[11px] font-bold text-[#C23E00] uppercase">(+) Buffer Stock</p>
                <p className="text-lg font-bold text-orange-950 mt-1">+{params.buffer} <span className="text-xs font-normal text-[#C23E00]">unit</span></p>
                <p className="text-[10px] text-[#C23E00]/80 mt-1">Cadangan fluktuasi</p>
              </div>

              <div className="p-3.5 rounded-lg bg-amber-50/60 border border-amber-200/80">
                <p className="text-[11px] font-bold text-amber-800 uppercase">(-) Stok Gudang</p>
                <p className="text-lg font-bold text-amber-950 mt-1">-{params.stok} <span className="text-xs font-normal text-amber-700">unit</span></p>
                <p className="text-[10px] text-amber-700/80 mt-1">Persediaan tersedia</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-stone-500 pt-3 border-t border-stone-100">
            Perhitungan ini memastikan pabrik memproduksi jumlah optimum tanpa menyebabkan penumpukan barang berlebih (*overstock*) atau kekurangan barang (*stockout*).
          </p>
        </div>
      </div>
    </div>
  );
}

export default SimulasiProduksiPage;
