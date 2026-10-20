import React from "react";

const StatCard = ({ title, value, color }) => {
  const colorThemes = {
    green: {
      bgIcon: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
      accentBorder: "border-l-emerald-600",
      subtext: "Realisasi penjualan historis",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>
      )
    },
    blue: {
      bgIcon: "bg-orange-50 text-[#C23E00] border-orange-200",
      accentBorder: "border-l-[#FF6115]",
      subtext: "Proyeksi kalkulasi SES",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
        </svg>
      )
    },
    orange: {
      bgIcon: "bg-amber-50 text-amber-800 border-amber-200/80",
      accentBorder: "border-l-amber-500",
      subtext: "Baris entri database",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 5.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
        </svg>
      )
    },
    purple: {
      bgIcon: "bg-stone-100 text-stone-700 border-stone-200",
      accentBorder: "border-l-stone-600",
      subtext: "Periode waktu berjalan",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      )
    },
  };

  const theme = colorThemes[color] || colorThemes.blue;

  return (
    <div className={`bg-white rounded-xl border border-stone-200/90 border-l-4 ${theme.accentBorder} p-5 shadow-xs hover:shadow-md transition-shadow duration-150`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
            {title}
          </p>
          <p className="text-2xl lg:text-3xl font-bold text-stone-900 tracking-tight">
            {value !== undefined && value !== null ? value : '-'}
          </p>
        </div>
        <div className={`p-2.5 rounded-lg border ${theme.bgIcon}`}>
          {theme.icon}
        </div>
      </div>
      <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
        <span>{theme.subtext}</span>
      </div>
    </div>
  );
};

export default StatCard;
