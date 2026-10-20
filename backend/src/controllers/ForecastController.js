const SESService = require('../services/sesService');
const RekapService = require('../services/RekapService');

class ForecastController {
    // Hitung ramalan SES berdasarkan data penjualan dan alpha
    static async hitungPeramalan(req, res) {
        try {
            const { alpha } = req.body;
            const dataPenjualan = await RekapService.ambilSemuaPenjualan();
            const hasilRamalan = SESService.hitungRamalan(dataPenjualan.map(d => d.jumlah), alpha);
            res.json({ status: 'sukses', alpha, hasilRamalan });
        } catch (err) {
            res.status(500).json({ status: 'error', pesan: err.message });
        }
    }

    // Ambil rekap tabel peramalan
    static async ambilRekapPeramalan(req, res) {
        try {
            const dataPenjualan = await RekapService.ambilSemuaPenjualan();
            
            if (!dataPenjualan || dataPenjualan.length === 0) {
                return res.json({ status: 'sukses', data: { alphaTerbaik: 0.5, rekap: [] } });
            }
            
            const alphaTerbaik = SESService.pilihAlphaTerbaik(dataPenjualan.map(d => d.jumlah), [0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9]);
            const rekap = await RekapService.buatRekapPeramalan(dataPenjualan, alphaTerbaik);
            res.json({ status: 'sukses', data: { alphaTerbaik, rekap } });
        } catch (err) {
            console.error('Error ambilRekapPeramalan:', err.message);
            res.status(500).json({ status: 'error', pesan: err.message, data: { alphaTerbaik: 0.5, rekap: [] } });
        }
    }
}

module.exports = ForecastController;
