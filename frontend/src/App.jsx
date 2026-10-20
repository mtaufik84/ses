import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ErrorBoundary from './components/ErrorBoundary';
import Dashboard from './pages/Dashboard';
import InputPenjualan from './pages/InputPenjualan';
import KelolaStokBufferPage from './pages/KelolaStokBufferPage';
import PeramalanPage from './pages/PeramalanPage';
import SimulasiProduksiPage from './pages/SimulasiProduksiPage';
import LaporanPage from './pages/LaporanPage';
import CompareDocsPage from './pages/CompareDocsPage';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="flex h-screen overflow-hidden bg-[#FFFCF4] font-sans text-stone-900">
          <Sidebar />

          <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
            {/* Top Bar Header */}
            <header className="h-16 bg-white/95 backdrop-blur-xs border-b border-stone-200/80 px-6 flex items-center justify-between shrink-0 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-[#C23E00] border border-orange-200/70">
                  <span className="w-2 h-2 rounded-full bg-[#FF6115]"></span>
                  Sistem Informasi Peramalan Penjualan
                </span>
                <span className="text-xs text-stone-400 hidden sm:inline">
                  Metode Single Exponential Smoothing
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden md:block">
                  <p className="text-xs font-semibold text-stone-700">Operasional Pabrik & Distribusi</p>
                  <p className="text-[11px] text-stone-400">Monitoring Buffer & Stok Harian</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#FFFCF4] border border-orange-200/90 flex items-center justify-center text-[#C23E00] text-xs font-bold shadow-2xs">
                  SP
                </div>
              </div>
            </header>

            {/* Scrollable Main Content */}
            <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-[#FFFCF4]/60">
              <div className="max-w-7xl mx-auto">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/input-penjualan" element={<InputPenjualan />} />
                  <Route path="/kelola-stok-buffer" element={<KelolaStokBufferPage />} />
                  <Route path="/peramalan" element={<PeramalanPage />} />
                  <Route path="/simulasi-produksi" element={<SimulasiProduksiPage />} />
                  <Route path="/laporan" element={<LaporanPage />} />
                  <Route path="/compare" element={<CompareDocsPage />} />
                </Routes>
              </div>
            </main>
          </div>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;