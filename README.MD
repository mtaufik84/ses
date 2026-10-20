# SES System

Aplikasi web untuk mencatat penjualan, melihat ringkasan, menghitung peramalan dengan metode **Single Exponential Smoothing (SES)**, dan mendukung alur perencanaan produksi berdasarkan data penjualan, stok, serta buffer.

## Fitur

- Dashboard ringkasan penjualan dan hasil peramalan.
- Input penjualan manual dan unggah data CSV.
- Rekap penjualan dan grafik aktual dibandingkan hasil ramalan.
- Perhitungan SES dengan parameter `alpha`.
- Halaman pengelolaan stok dan buffer serta simulasi produksi.
- Backend REST API berbasis Express dan penyimpanan SQLite.

Halaman antarmuka tersedia di `frontend/src/pages`. Ketersediaan data di setiap halaman bergantung pada tabel dan isi database yang diberikan saat menjalankan aplikasi.

## Teknologi

- **Frontend:** React, React Router, Vite, Tailwind CSS, Chart.js, Axios.
- **Backend:** Node.js, Express, SQLite (`sqlite3`), `csv-parser`.
- **Peramalan:** Single Exponential Smoothing.

## Struktur proyek

```text
.
├── backend/
│   ├── package.json
│   └── src/
│       ├── config/       # Koneksi dan inisialisasi SQLite
│       ├── controllers/  # Handler unggah CSV dan controller aplikasi
│       ├── routes/       # Route penjualan dan peramalan
│       ├── services/     # Perhitungan SES dan layanan aplikasi
│       ├── utils/        # Agregasi penjualan
│       └── server.js     # Server Express
├── frontend/
│   ├── package.json
│   └── src/
│       ├── components/   # Komponen antarmuka
│       ├── pages/        # Dashboard dan halaman fitur
│       └── services/     # Pemanggilan API
├── package.json
└── README.MD
```

## Persyaratan

- Node.js dan npm.
- File database SQLite yang berisi skema yang diperlukan aplikasi.
- Browser modern.

## Menjalankan aplikasi

Jalankan backend dan frontend di dua terminal terpisah.

### 1. Siapkan database

File database dan dump SQL tidak disimpan di repository. Dapatkan database SQLite yang sesuai dari pemilik proyek atau backup yang berwenang, lalu tempatkan, misalnya, di `backend/tgm99.db`.

Backend juga menerima lokasi database melalui `DB_PATH`. Contoh PowerShell:

```powershell
$env:DB_PATH = "C:\data\ses-system.db"
```

Jalankan perintah itu di terminal backend sebelum `npm start`. Variabel tersebut hanya berlaku untuk sesi terminal saat ini. Tanpa file database yang sesuai, SQLite dapat membuat file kosong, tetapi tabel yang dibutuhkan aplikasi tidak otomatis tersedia.

> **Perhatian:** `npm run init-db` menjalankan `backend/src/config/init_sqlite.cjs`. Skrip ini menghapus `backend/tgm99.db` yang sudah ada dan membaca dump `tgm99.sql` dari root proyek. Dump tersebut memang tidak disertakan di repository. Jangan jalankan skrip pada database yang berisi data penting sebelum membuat backup dan memastikan dump lokal tersedia.

### 2. Instal dan jalankan backend

```powershell
cd backend
npm install
npm start
```

Secara default server berjalan di `http://localhost:5000`. Port dapat diubah dengan variabel `PORT`.

Endpoint pemeriksaan server:

```text
GET http://localhost:5000/api/health
```

### 3. Instal dan jalankan frontend

Buka terminal kedua dari folder proyek:

```powershell
cd frontend
npm install
npm run dev
```

Buka alamat lokal yang dicetak Vite, biasanya `http://localhost:5173`.

Frontend saat ini mengirim permintaan API ke `http://localhost:5000/api`. Jika backend dijalankan di host atau port lain, perbarui URL dasar di `frontend/src/api/axios.js` dan `frontend/src/services/api.js`.

## Perintah yang tersedia

### Backend (`backend/`)

| Perintah | Fungsi |
| --- | --- |
| `npm start` | Menjalankan API server. |
| `npm run dev` | Menjalankan server dengan Nodemon. |
| `npm run init-db` | Menghapus dan membangun ulang database lokal menggunakan dump `tgm99.sql`. Lihat peringatan pada bagian database. |

### Frontend (`frontend/`)

| Perintah | Fungsi |
| --- | --- |
| `npm run dev` | Menjalankan server pengembangan Vite. |
| `npm run build` | Membuat hasil build produksi di `frontend/dist/`. |
| `npm run preview` | Menyajikan hasil build untuk pratinjau lokal. |
| `npm run lint` | Menjalankan ESLint. |

## API yang tersedia

Semua endpoint memakai awalan `http://localhost:5000/api`. Route penjualan tersedia melalui `/sales` dan `/penjualan`; route peramalan tersedia melalui `/forecast` dan `/peramalan`.

| Metode | Endpoint | Keterangan |
| --- | --- | --- |
| `GET` | `/health` | Status server dan lokasi database aktif. |
| `GET` | `/penjualan` | Mengambil catatan penjualan. Alias: `/sales`. |
| `POST` | `/penjualan/tambah` | Menambahkan catatan penjualan. Alias: `/sales/tambah`. |
| `POST` | `/penjualan/upload` | Mengunggah satu file CSV pada field multipart `file`. Alias: `/sales/upload`. |
| `POST` | `/penjualan/aggregate` | Mengagregasi `sales_daily` menjadi data bulanan. Alias: `/sales/aggregate`. |
| `POST` | `/peramalan/hitung` | Menghitung SES dari catatan di tabel `penjualan`. Alias: `/forecast/hitung`. |
| `GET` | `/peramalan/rekap` | Mengambil rekap hasil peramalan. Alias: `/forecast/rekap`. |
| `POST` | `/peramalan/run` | Menjalankan SES dari data agregasi. Alias: `/forecast/run`. |

### Contoh input penjualan

```json
{
  "tanggal": "2026-10-20",
  "ukuran": "AMDK 220 ml",
  "jumlah": 100
}
```

Kirim JSON tersebut ke `POST /api/penjualan/tambah`. Untuk input beberapa varian kemasan, route juga menerima `tanggal`, `kemasan220`, `kemasan330`, dan `kemasan600`.

### Format CSV

Unggah CSV ke `POST /api/penjualan/upload` sebagai `multipart/form-data`, dengan nama field file `file`. Kolom yang dibaca oleh proses impor:

```csv
product_id,sales_date,qty_units
1,2026-10-20,100
```

Proses unggah mencatat baris ke `sales_daily`. Pastikan `product_id` merujuk ke produk yang tersedia di database.

### Contoh menjalankan peramalan

`POST /api/peramalan/hitung` menerima parameter `alpha`:

```json
{
  "alpha": 0.5
}
```

`POST /api/peramalan/run` membaca data dari `sales_period_agg` dan menerima `product_id`, `period`, `alpha`, serta `created_by`. Contoh:

```json
{
  "product_id": 1,
  "period": "MONTH",
  "alpha": 0.3,
  "created_by": 1
}
```

Nilai periode agregasi yang disiapkan oleh endpoint agregasi adalah `MONTH`. Perhitungan membutuhkan data penjualan yang cukup dan tabel yang sesuai.

## Catatan database

- Koneksi menggunakan SQLite. `DB_PATH` dapat menunjuk ke file SQLite tertentu.
- Jika `DB_PATH` tidak diisi, backend mencari `tgm99.db` pada beberapa lokasi proyek; lokasi yang sudah ada dipakai lebih dulu.
- Skema yang digunakan mencakup tabel seperti `products`, `penjualan`, `sales_daily`, `sales_period_agg`, `forecast_runs`, dan `forecast_points`.
- Endpoint `/aggregate` menambahkan hasil agregasi dari seluruh data harian. Kode saat ini tidak menghapus hasil lama sebelum menambahkan hasil baru, jadi hindari menjalankannya berulang kali tanpa membersihkan atau membuat ulang data agregasi.
- Database lokal, dump, dan file environment dikecualikan oleh `.gitignore`. Jangan masukkan data penjualan atau kredensial ke commit.

## Pemecahan masalah

- **Frontend tidak dapat menghubungi backend:** pastikan backend berjalan pada port `5000` atau sesuaikan URL API di kedua file frontend yang disebutkan di atas.
- **Error `no such table`:** periksa `DB_PATH` dan pastikan file SQLite memiliki tabel yang dibutuhkan. File kosong tidak cukup untuk menjalankan aplikasi.
- **Impor CSV gagal:** pastikan file memakai kolom `product_id`, `sales_date`, `qty_units`, serta nilai `product_id` yang ada di tabel produk.
- **Hasil peramalan kosong:** tambahkan data penjualan terlebih dahulu. Endpoint `/peramalan/run` membutuhkan baris pada `sales_period_agg`; jalankan agregasi setelah data harian tersedia.
- **Port backend sudah dipakai:** atur `PORT` sebelum menjalankan backend, lalu sesuaikan URL API frontend.

## Batasan yang diketahui

- URL API frontend saat ini ditulis langsung sebagai `http://localhost:5000/api`.
- Skrip inisialisasi membutuhkan dump SQL lokal yang tidak disertakan dan menghapus database target sebelum membangunnya ulang.
- Route autentikasi yang ada di `backend/src/routes/authRoutes.js` belum dipasang pada `backend/src/server.js`, jadi endpoint login dan registrasi belum tersedia melalui server saat ini.
