import React, { useState, useEffect } from 'react';

function SESControlPanel({ stok = 100, buffer = 20, alpha = 0.5, onUpdate }) {
  const [localStok, setLocalStok] = useState(stok);
  const [localBuffer, setLocalBuffer] = useState(buffer);
  const [localAlpha, setLocalAlpha] = useState(alpha);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    setLocalStok(stok);
  }, [stok]);

  useEffect(() => {
    setLocalBuffer(buffer);
  }, [buffer]);

  useEffect(() => {
    setLocalAlpha(alpha);
  }, [alpha]);

  const handleUpdate = () => {
    if (onUpdate) {
      onUpdate({ stok: localStok, buffer: localBuffer, alpha: localAlpha });
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2500);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200/90 shadow-xs p-6 mb-6">
      {/* Header Panel */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-stone-100 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-[#C23E00]">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-bold text-stone-900">Panel Kontrol Parameter SES</h2>
            <p className="text-xs text-stone-500">Konfigurasi stok gudang, buffer cadangan, dan koefisien peramalan alpha (α)</p>
          </div>
        </div>
        {justSaved && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 animate-fadeIn">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Parameter Terperbarui
          </span>
        )}
      </div>

      {/* Grid Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
            Stok Gudang (Aktual)
          </label>
          <div className="relative">
            <input
              type="number"
              value={localStok}
              onChange={(e) => setLocalStok(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-[#FFFCF4]/60 border border-stone-300 rounded-lg text-stone-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6115]/25 focus:border-[#FF6115] transition-all"
              placeholder="100"
            />
            <span className="absolute right-3 top-2.5 text-xs text-stone-400 font-medium">
              Botol
            </span>
          </div>
          <p className="text-[11px] text-stone-400 mt-1.5">Jumlah persediaan fisik yang tersedia</p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
            Buffer Stock (Pengaman)
          </label>
          <div className="relative">
            <input
              type="number"
              value={localBuffer}
              onChange={(e) => setLocalBuffer(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-[#FFFCF4]/60 border border-stone-300 rounded-lg text-stone-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6115]/25 focus:border-[#FF6115] transition-all"
              placeholder="20"
            />
            <span className="absolute right-3 top-2.5 text-xs text-stone-400 font-medium">
              Cadangan
            </span>
          </div>
          <p className="text-[11px] text-stone-400 mt-1.5">Stok pengaman fluktuasi permintaan</p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Koefisien Alpha (α)</span>
            <span className="text-[10px] lowercase text-[#C23E00] bg-orange-100/80 px-1.5 py-0.5 rounded font-mono font-bold border border-orange-200">
              0.01 - 0.99
            </span>
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              min="0.01"
              max="1.0"
              value={localAlpha}
              onChange={(e) => setLocalAlpha(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-[#FFFCF4]/60 border border-stone-300 rounded-lg text-stone-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6115]/25 focus:border-[#FF6115] transition-all"
              placeholder="0.5"
            />
            <span className="absolute right-3 top-2.5 text-xs text-stone-400 font-medium">
              α
            </span>
          </div>
          <p className="text-[11px] text-stone-400 mt-1.5">Bobot pemulusan (makin besar makin responsif)</p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-end">
        <button
          onClick={handleUpdate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF6115] hover:bg-[#EA4E00] active:bg-[#C23E00] text-stone-950 text-sm font-bold rounded-lg shadow-xs hover:shadow transition-all duration-150 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.25}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          Terapkan Parameter
        </button>
      </div>
    </div>
  );
}

export default SESControlPanel;
