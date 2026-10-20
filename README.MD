# SES System - Struktur Folder & Penjelasan

## 📁 Struktur Proyek

```
ses_system/
├── backend/                          # Backend API Server
│   ├── package.json                  # Dependency management
│   └── src/
│       ├── server.js                 # Entry point server
│       ├── config/
│       │   └── db.js                 # Konfigurasi database
│       ├── controllers/
│       │   ├── forecastController.js # Logic untuk forecast
│       │   └── penjualanController.js# Logic untuk penjualan
│       ├── routes/
│       │   ├── forecastRoutes.js     # Route endpoint forecast
│       │   └── penjualanRoutes.js    # Route endpoint penjualan
│       ├── services/
│       │   ├── errorService.js       # Error handling
│       │   └── sesService.js         # SES algorithm logic
│       └── utils/
│           └── aggregator.js         # Utility untuk agregasi data
│
├── frontend/                         # Frontend React + Vite
│   ├── package.json                  # Dependency management
│   ├── vite.config.js                # Konfigurasi Vite
│   ├── tailwind.config.js            # Konfigurasi Tailwind CSS
│   ├── postcss.config.js             # Konfigurasi PostCSS
│   ├── eslint.config.js              # Konfigurasi ESLint
│   ├── index.html                    # File HTML utama
│   ├── public/                       # Asset publik statis
│   └── src/
│       ├── main.jsx                  # Entry point React
│       ├── App.jsx                   # Root component
│       ├── index.css                 # Global styles
│       ├── app.css                   # App styles
│       ├── assets/                   # Aset (gambar, icon)
│       ├── components/               # Reusable components
│       │   ├── Dashboard.jsx         # Dashboard component
│       │   ├── ForecastChart.jsx     # Chart untuk forecast
│       │   ├── RecentTable.jsx       # Tabel data terbaru
│       │   ├── SESControlPanel.jsx   # Control panel SES
│       │   ├── Sidebar.jsx           # Sidebar navigation
│       │   └── StatCard.jsx          # Card statistik
│       ├── pages/
│       │   └── Dashboard.jsx         # Halaman Dashboard
│       └── services/
│           └── api.js                # API client requests
│
└── README.MD                         # Dokumentasi proyek
```

---

## 📝 Penjelasan Detail Setiap Folder

### **Backend** (`backend/`)

Bagian server yang menangani logika bisnis dan API endpoints.

#### `src/config/`
- **db.js** - Konfigurasi koneksi database (MySQL, MongoDB, dll)

#### `src/controllers/`
- **forecastController.js** - Menangani request untuk forecast penjualan
- **penjualanController.js** - Menangani request untuk data penjualan

#### `src/routes/`
- **forecastRoutes.js** - Mendefinisikan endpoint API untuk forecast (GET, POST, etc)
- **penjualanRoutes.js** - Mendefinisikan endpoint API untuk penjualan

#### `src/services/`
- **sesService.js** - Implementasi algoritma Seasonal Exponential Smoothing (SES)
- **errorService.js** - Utility untuk menangani dan format error response

#### `src/utils/`
- **aggregator.js** - Helper untuk aggregasi data dari database

#### `server.js`
- Entry point aplikasi backend, setup Express server dan middleware

---

### **Frontend** (`frontend/`)

Bagian client yang menampilkan UI kepada user.

#### `src/components/`
- **SESControlPanel.jsx** - Panel kontrol untuk mengatur parameter SES
- **ForecastChart.jsx** - Visualisasi chart forecast menggunakan library chart
- **RecentTable.jsx** - Tabel menampilkan data penjualan/forecast terbaru
- **StatCard.jsx** - Card untuk menampilkan statistik (total, rata-rata, dll)
- **Sidebar.jsx** - Navigation sidebar (menu)
- **Dashboard.jsx** - Halaman utama dashboard

#### `src/pages/`
- **Dashboard.jsx** - Layout halaman dashboard utama

#### `src/services/`
- **api.js** - Client untuk hit API backend (axios/fetch)

#### `src/assets/`
- Menyimpan gambar, icon, dan file statis lainnya

#### `src/` (Root)
- **main.jsx** - Entry point React
- **App.jsx** - Root component
- **index.css** - Global styles
- **app.css** - App-specific styles

#### Config Files
- **vite.config.js** - Konfigurasi build tool Vite
- **tailwind.config.js** - Konfigurasi framework Tailwind CSS
- **postcss.config.js** - Konfigurasi PostCSS
- **eslint.config.js** - Konfigurasi linter untuk code quality

---

## 🔄 Alur Data

```
User (Frontend) 
    ↓
API Request (api.js)
    ↓
Backend Routes (forecastRoutes.js / penjualanRoutes.js)
    ↓
Controllers (forecastController.js / penjualanController.js)
    ↓
Services (sesService.js / errorService.js)
    ↓
Database (config/db.js)
    ↓
Response kembali ke Frontend
    ↓
Components render data (ForecastChart, RecentTable, StatCard)
```

---

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express.js
- Database (configurabel di config/db.js)

**Frontend:**
- React 18+
- Vite (build tool)
- Tailwind CSS (styling)
- ESLint (code quality)

**Algorithm:**
- Seasonal Exponential Smoothing (SES) untuk forecasting

