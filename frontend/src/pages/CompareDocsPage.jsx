import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function CompareDocsPage() {
  const [activeTab, setActiveTab] = useState('matrix'); // 'matrix' | 'case-study' | 'summary'

  const comparisonData = [
    {
      aspek: 'Definisi & Konsep',
      prd: 'Product Requirement Document: Dokumen spesifikasi teknis dan fungsional yang mendefinisikan apa yang harus dibangun sebelum dan selama produk dikembangkan.',
      laporan: 'Laporan Proyek / Progress Report: Dokumen pertanggungjawaban berkala yang mencatat apa yang telah dicapai, dievaluasi, dan diselesaikan pada tonggak waktu tertentu.',
      kategori: 'Fundamental'
    },
    {
      aspek: 'Tujuan Pembuatan',
      prd: 'Sebagai panduan tunggal (single source of truth) bagi tim teknis (developer, UI/UX, QA) dalam mengimplementasikan fitur dan menjaga batasan cakupan sistem.',
      laporan: 'Sebagai sarana evaluasi kemajuan proyek bagi pembimbing, pimpinan, penguji, atau klien untuk menilai apakah milestone tercapai sesuai target waktu.',
      kategori: 'Tujuan'
    },
    {
      aspek: 'Orientasi Waktu',
      prd: 'Masa Depan (Forward-looking): Menjabarkan ekspektasi sistem, acceptance criteria, dan roadmap rilis masa mendatang.',
      laporan: 'Masa Lampau & Sekarang (Backward/Snapshot-looking): Mengulas kronologi progres minggu ke-1 sampai minggu ke-15 serta hasil pengujian riil.',
      kategori: 'Dimensi Waktu'
    },
    {
      aspek: 'Target Audiens',
      prd: 'Product Manager, Software Engineer, UI/UX Designer, QA Tester, System Architect.',
      laporan: 'Dosen Pembimbing, Dosen Penguji, Manajer Proyek, Pimpinan Perusahaan, Stakeholder Bisnis.',
      kategori: 'Audiens'
    },
    {
      aspek: 'Fokus Pembahasan',
      prd: 'Spesifikasi fungsional (FR), standar kualitas (NFR), arsitektur teknis lengkap, penanganan keamanan (JWT, Bcrypt), dan kriteria Definition of Done.',
      laporan: 'Latar belakang masalah riil, implementasi metodologi (Single Exponential Smoothing), pembuktian formula, pencapaian fase, dan kendala lapangan.',
      kategori: 'Konten'
    },
    {
      aspek: 'Sifat Dokumen',
      prd: 'Dokumen Hidup (Living Document): Terus diperbarui seiring iterasi produk dan penyesuaian kebutuhan pasar.',
      laporan: 'Dokumen Statis Bersejarah (Milestone Snapshot): Mengabadikan status konkret dan performa sistem pada periode spesifik (Minggu ke-15).',
      kategori: 'Siklus Hidup'
    },
    {
      aspek: 'Tolok Ukur Keberhasilan',
      prd: 'Fitur lulus Acceptance Criteria, performa response time API di bawah batas toleransi, dan seluruh FR terimplementasi.',
      laporan: 'Kesesuaian dengan target roadmap semester/proyek, bukti kerja nyata, pengujian algoritma pada studi kasus, dan akurasi peramalan.',
      kategori: 'Evaluasi'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Top Breadcrumb & Status */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-2 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C23E00] hover:text-[#9A3412] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Kembali ke Dashboard
          </Link>
          <span className="text-stone-300">/</span>
          <span className="text-xs font-medium text-stone-500">Halaman Khusus URL (Hidden Route)</span>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-[#C23E00] border border-orange-200">
          <span className="w-2 h-2 rounded-full bg-[#FF6115]"></span>
          Internal Analysis: /compare
        </span>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#241A15] via-[#1A1411] to-[#120E0C] border border-[#3A2D25] text-white p-6 md:p-8 rounded-2xl shadow-md">
        <div className="max-w-3xl">
          <span className="inline-block px-3 py-1 rounded-lg text-xs font-bold bg-[#FF6115]/20 text-[#FF8749] border border-[#FF6115]/30 mb-3">
            Komparasi Dokumen Perangkat Lunak
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#FFFCF4]">
            Perbandingan Laporan Proyek vs PRD
          </h1>
          <p className="text-sm text-stone-300 mt-2 leading-relaxed">
            Analisis komparatif menyeluruh antara dokumen pertanggungjawaban proyek (Laporan SIP Minggu ke-15) dengan dokumen spesifikasi produk (Product Requirement Document SES System).
          </p>
        </div>
      </div>

      {/* Quick Summary Cards (Side by Side) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card PRD */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#FF6115]"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C23E00] bg-orange-50 border border-orange-200 px-2.5 py-1 rounded">
              Spesifikasi Produk
            </span>
            <span className="text-xs font-mono text-stone-400">PRD.md</span>
          </div>
          <h2 className="text-lg font-bold text-stone-900 mb-2">
            Product Requirement Document (PRD)
          </h2>
          <p className="text-xs text-stone-600 mb-4 leading-relaxed">
            Cetak biru (*blueprint*) dan panduan teknis yang merinci apa yang harus dibangun, mengapa produk tersebut ada, serta standar penerimaan (*acceptance criteria*) bagi tim insinyur dan desainer.
          </p>

          <div className="space-y-2.5 pt-3 border-t border-stone-100 text-xs">
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span className="text-stone-700"><strong>Fokus:</strong> Kebutuhan teknis, modul autentikasi JWT, skema relasional, dan SLA performa API.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span className="text-stone-700"><strong>Audiens:</strong> Software engineer, QA tester, desainer UI/UX, dan product manager.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span className="text-stone-700"><strong>Karakter:</strong> Living document yang terus disempurnakan selama siklus rilis produk berjalan.</span>
            </div>
          </div>
        </div>

        {/* Card Laporan */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-600"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded">
              Pertanggungjawaban Progres
            </span>
            <span className="text-xs font-mono text-stone-400">laporan_sip_minggu_15.md</span>
          </div>
          <h2 className="text-lg font-bold text-stone-900 mb-2">
            Laporan Proyek (Minggu ke-15)
          </h2>
          <p className="text-xs text-stone-600 mb-4 leading-relaxed">
            Laporan pertanggungjawaban formal yang membuktikan bahwa sistem peramalan telah berhasil dibangun, diintegrasikan, dan diuji kinerjanya hingga minggu ke-15.
          </p>

          <div className="space-y-2.5 pt-3 border-t border-stone-100 text-xs">
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span className="text-stone-700"><strong>Fokus:</strong> Capaian milestone mingguan, pembuktian rumus SES, hasil simulasi produksi, dan pelaporan cetak.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span className="text-stone-700"><strong>Audiens:</strong> Dosen pembimbing, dosen penguji, manajer operasional pabrik, dan stakeholder manajerial.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span className="text-stone-700"><strong>Karakter:</strong> Snapshot formal bersejarah yang mencerminkan status konkrit di titik minggu ke-15.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'matrix'
              ? 'bg-[#FF6115] text-stone-950 shadow-xs'
              : 'bg-white text-stone-600 hover:bg-[#FFFCF4] border border-stone-200'
          }`}
        >
          Matriks Perbandingan Lengkap
        </button>
        <button
          onClick={() => setActiveTab('case-study')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'case-study'
              ? 'bg-[#FF6115] text-stone-950 shadow-xs'
              : 'bg-white text-stone-600 hover:bg-[#FFFCF4] border border-stone-200'
          }`}
        >
          Perbedaan Nyata pada Proyek SES System
        </button>
      </div>

      {/* Tab 1: Matriks Perbandingan */}
      {activeTab === 'matrix' && (
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-[#FFFCF4] border-b border-stone-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900">
              Tabel Matriks Perbandingan Parameter Kunci
            </h3>
            <span className="text-xs text-stone-500">7 Dimensi Analisis Komparatif</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FFFCF4]/90 border-b border-stone-200">
                  <th className="px-5 py-3.5 font-bold text-stone-700 uppercase tracking-wider w-1/5">
                    Dimensi / Aspek
                  </th>
                  <th className="px-5 py-3.5 font-bold text-[#C23E00] uppercase tracking-wider w-2/5">
                    Product Requirement Document (PRD)
                  </th>
                  <th className="px-5 py-3.5 font-bold text-emerald-800 uppercase tracking-wider w-2/5">
                    Laporan Proyek (SIP Minggu ke-15)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {comparisonData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#FFFCF4]/80 transition-colors">
                    <td className="px-5 py-4 font-semibold text-stone-900 align-top bg-[#FFFCF4]/50">
                      <div className="flex flex-col">
                        <span>{item.aspek}</span>
                        <span className="text-[10px] text-stone-400 font-normal mt-0.5">{item.kategori}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 align-top leading-relaxed text-stone-700">
                      {item.prd}
                    </td>
                    <td className="px-5 py-4 align-top leading-relaxed text-stone-700 bg-emerald-50/15">
                      {item.laporan}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Kasus Nyata di SES System */}
      {activeTab === 'case-study' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
            <h3 className="text-base font-bold text-stone-900 mb-2">
              Perbedaan Nyata Isi File PRD.md vs Laporan Minggu ke-15 di Repository Ini
            </h3>
            <p className="text-xs text-stone-500 mb-6 leading-relaxed">
              Berikut adalah analisis konkret bagaimana kedua berkas di proyek SES2 ini memiliki fokus, cakupan data, dan fungsi yang saling melengkapi:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hal yang hanya ada di PRD */}
              <div className="p-5 rounded-xl border border-orange-200 bg-orange-50/30">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF6115]"></span>
                  <h4 className="text-sm font-bold text-orange-950">Hanya Ditemukan di PRD.md</h4>
                </div>
                <ul className="space-y-2 text-xs text-stone-700 leading-relaxed list-disc pl-4">
                  <li><strong>Spesifikasi Autentikasi Pengguna:</strong> Rincian teknis tabel <code className="bg-orange-100 px-1 py-0.5 rounded text-orange-950 font-mono">users</code>, hashing password <code className="bg-orange-100 px-1 py-0.5 rounded font-mono">bcryptjs</code>, dan validasi token JWT 7 hari.</li>
                  <li><strong>Fitur Bulk Import CSV:</strong> Penjelasan parser berkas CSV (<code className="font-mono">uploadSalesCSV.js</code>) dan tabel batch impor <code className="font-mono">sales_import_batches</code>.</li>
                  <li><strong>SLA Performa Teknis:</strong> Standar response time API &lt; 1 detik untuk 10.000 baris data, dan rendering frontend &lt; 500 ms.</li>
                  <li><strong>Kriteria Acceptance / DoD:</strong> Definisi kapan suatu fitur dinilai rampung dan siap dideploy.</li>
                </ul>
              </div>

              {/* Hal yang ditekankan di Laporan Minggu 15 */}
              <div className="p-5 rounded-xl border border-emerald-100 bg-emerald-50/30">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  <h4 className="text-sm font-bold text-emerald-950">Fokus Utama di Laporan Minggu ke-15</h4>
                </div>
                <ul className="space-y-2 text-xs text-stone-700 leading-relaxed list-disc pl-4">
                  <li><strong>Spesialisasi Studi Kasus Bisnis:</strong> Penekanan operasional riil produk air minum dalam kemasan botol varian 220ml, 330ml, dan 600ml.</li>
                  <li><strong>Implementasi Formula Matematis:</strong> Pembuktian empiris rumus Single Exponential Smoothing serta peran buffer stock dalam mencegah stockout pabrik.</li>
                  <li><strong>Kronologi Milestone (Minggu 1 s/d 15):</strong> Pelaporan tahapan riil dari analisis, implementasi backend, frontend, hingga redesign antarmuka sistem.</li>
                  <li><strong>Fitur Manajerial Siap Pakai:</strong> Penekanan pada ekspor laporan langsung ke CSV dan fungsi cetak PDF untuk kebutuhan rapat operasional.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sinergi Diagram */}
          <div className="bg-[#181513] border border-[#2C2420] text-white p-6 rounded-xl shadow-xs">
            <h4 className="text-sm font-bold text-[#FF8749] mb-2">Kesimpulan Hubungan Antara Keduanya</h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              <strong>PRD adalah kompas sebelum dan selama kode ditulis</strong>, memastikan developer tidak menyimpang dari arsitektur dan kebutuhan pengguna. Sementara <strong>Laporan adalah bukti pencapaian pertanggungjawaban</strong>, membuktikan kepada evaluator bahwa apa yang direncanakan di PRD telah terwujud menjadi perangkat lunak yang beroperasi dengan baik di minggu ke-15.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompareDocsPage;
