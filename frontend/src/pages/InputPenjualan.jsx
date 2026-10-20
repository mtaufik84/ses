import React, { useState } from 'react';
import { tambahPenjualan } from '../services/api';

function InputPenjualanPage() {
  const [form, setForm] = useState({
    tanggal: '',
    kemasan220: '',
    kemasan330: '',
    kemasan600: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        tanggal: form.tanggal,
        kemasan220: Number(form.kemasan220) || 0,
        kemasan330: Number(form.kemasan330) || 0,
        kemasan600: Number(form.kemasan600) || 0,
      };

      await tambahPenjualan(payload);
      setNotification({
        type: 'success',
        message: 'Data penjualan berhasil disimpan dan siap dikalkulasi peramalan.'
      });
      setForm({ tanggal: '', kemasan220: '', kemasan330: '', kemasan600: '' });
      setTimeout(() => setNotification(null), 4000);
    } catch (error) {
      console.error('Error saving penjualan:', error);
      setNotification({
        type: 'error',
        message: 'Gagal menyimpan data penjualan. Periksa koneksi backend Anda.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalUnit = (Number(form.kemasan220) || 0) + (Number(form.kemasan330) || 0) + (Number(form.kemasan600) || 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
          Input Data Penjualan
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          Catat transaksi penjualan harian atau mingguan untuk memperbarui dataset algoritma SES.
        </p>
      </div>

      {/* Notification Toast/Banner */}
      {notification && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {notification.type === 'success' ? (
              <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <p className="text-sm font-medium">{notification.message}</p>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-xs font-semibold hover:opacity-75 cursor-pointer ml-4"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-stone-200/90 shadow-xs p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tanggal Input */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
              Tanggal / Periode Penjualan <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="tanggal"
              value={form.tanggal}
              onChange={handleChange}
              className="w-full md:w-1/2 px-4 py-2.5 bg-[#FFFCF4]/60 border border-stone-300 rounded-lg text-stone-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6115]/25 focus:border-[#FF6115] transition-all"
              required
            />
            <p className="text-xs text-stone-400 mt-1.5">
              Pilih tanggal pencatatan penjualan botol.
            </p>
          </div>

          <div className="pt-2 border-t border-stone-100">
            <h2 className="text-sm font-bold text-stone-900 mb-3">
              Rincian Volume per Varian Kemasan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Kemasan 220 */}
              <div className="p-4 rounded-xl border border-stone-200 bg-[#FFFCF4]/50">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                    Kemasan 220 ml
                  </label>
                  <span className="text-[10px] bg-stone-200 text-stone-700 px-2 py-0.5 rounded-full font-medium">
                    Kecil
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    name="kemasan220"
                    value={form.kemasan220}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#FF6115]/25 focus:border-[#FF6115] transition-all"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-stone-400 font-medium">
                    Botol
                  </span>
                </div>
              </div>

              {/* Kemasan 330 */}
              <div className="p-4 rounded-xl border border-stone-200 bg-[#FFFCF4]/50">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                    Kemasan 330 ml
                  </label>
                  <span className="text-[10px] bg-orange-50 text-[#C23E00] px-2 py-0.5 rounded-full font-semibold border border-orange-200">
                    Sedang
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    name="kemasan330"
                    value={form.kemasan330}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#FF6115]/25 focus:border-[#FF6115] transition-all"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-stone-400 font-medium">
                    Botol
                  </span>
                </div>
              </div>

              {/* Kemasan 600 */}
              <div className="p-4 rounded-xl border border-stone-200 bg-[#FFFCF4]/50">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                    Kemasan 600 ml
                  </label>
                  <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full font-semibold border border-emerald-200">
                    Besar
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    name="kemasan600"
                    value={form.kemasan600}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#FF6115]/25 focus:border-[#FF6115] transition-all"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-stone-400 font-medium">
                    Botol
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-200/80 flex items-center justify-between flex-wrap gap-2">
            <div>
              <p className="text-xs font-semibold text-stone-800">Total Akumulasi Entri Ini:</p>
              <p className="text-xl font-bold text-[#C23E00]">
                {totalUnit.toLocaleString('id-ID')} <span className="text-xs font-normal text-stone-600">Botol</span>
              </p>
            </div>
            <p className="text-xs text-stone-600 max-w-xs">
              Angka ini akan tercatat dalam agregator historis peramalan SES.
            </p>
          </div>

          {/* Action Button */}
          <div className="pt-2 flex items-center justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#FF6115] hover:bg-[#EA4E00] active:bg-[#C23E00] text-stone-950 text-sm font-bold rounded-lg shadow-xs hover:shadow transition-all duration-150 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-stone-950" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Menyimpan...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.25}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Simpan Data Penjualan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InputPenjualanPage;
