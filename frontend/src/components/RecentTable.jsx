import React from 'react';

function RecentTable({ data = [], judul = "Tabel Data" }) {
  const tableData = Array.isArray(data) ? data : [];

  // Helper to format raw object keys into user-friendly headers
  const formatHeader = (key) => {
    const dictionary = {
      tanggal: 'Tanggal',
      minggu: 'Minggu / Periode',
      ukuran: 'Kemasan',
      kemasan: 'Kemasan',
      kemasan220: 'Kemasan 220 ml',
      kemasan330: 'Kemasan 330 ml',
      kemasan600: 'Kemasan 600 ml',
      jumlah: 'Jumlah Aktual',
      aktual_botol: 'Aktual (Botol)',
      penjualan: 'Penjualan (Botol)',
      ramalan: 'Ramalan SES',
      ramalan_ses: 'Ramalan SES',
      alpha: 'Alpha (α)',
      mad: 'MAD (Error)',
      mse: 'MSE',
      mape: 'MAPE (%)',
      stok: 'Stok Gudang',
      buffer: 'Buffer Stock',
      rekomendasi_produksi: 'Rekomendasi Produksi',
    };
    return dictionary[key] || key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const columns = tableData.length > 0 ? Object.keys(tableData[0]) : [];

  return (
    <div className="bg-white rounded-xl border border-stone-200/90 shadow-xs overflow-hidden mt-6">
      {/* Table Header / Toolbar */}
      <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF6115]"></div>
          <h2 className="text-base font-bold text-stone-900">{judul}</h2>
        </div>
        <span className="text-xs font-semibold text-stone-600 bg-[#FFFCF4] px-3 py-1 rounded-full border border-stone-200">
          {tableData.length} baris data
        </span>
      </div>

      {/* Table Content */}
      {tableData.length === 0 ? (
        <div className="p-8 text-center text-stone-400">
          <svg className="w-8 h-8 mx-auto mb-2 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
          </svg>
          <p className="text-sm font-medium text-stone-600">Tidak ada data untuk ditampilkan</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FFFCF4]/90 border-b border-stone-200">
                {columns.map((key) => (
                  <th
                    key={key}
                    className="px-5 py-3 text-xs font-bold text-stone-600 uppercase tracking-wider"
                  >
                    {formatHeader(key)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm">
              {tableData.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-[#FFFCF4]/80 transition-colors duration-150"
                >
                  {columns.map((colKey, j) => {
                    const val = row[colKey];
                    const isNumeric = typeof val === 'number' || (!isNaN(val) && val !== '' && !isNaN(parseFloat(val)));
                    const isForecastOrActual = colKey.includes('ramalan') || colKey.includes('aktual') || colKey.includes('jumlah') || colKey.includes('penjualan');

                    return (
                      <td key={j} className="px-5 py-3.5 text-stone-700">
                        {isForecastOrActual ? (
                          <span className="font-semibold text-stone-900">
                            {typeof val === 'number' ? Number(val).toLocaleString('id-ID', { maximumFractionDigits: 2 }) : val}
                          </span>
                        ) : typeof val === 'number' ? (
                          val.toLocaleString('id-ID', { maximumFractionDigits: 2 })
                        ) : (
                          val !== null && val !== undefined ? String(val) : '-'
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default RecentTable;
