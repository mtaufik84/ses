const RekapService = require('../services/recommendationService');
const SESService = require('../services/sesService');

class PenjualanController {
    // Ambil semua data penjualan
    static async ambilDataPenjualan(req, res) {
        try {
            const data = await RekapService.ambilSemuaPenjualan();
            res.json({ status: 'sukses', data: data || [] });
        } catch (err) {
            console.error('Error ambilDataPenjualan:', err.message);
            res.status(500).json({ status: 'error', pesan: err.message, data: [] });
        }
    }

    // Input data penjualan baru
    static async inputDataPenjualan(req, res) {
        try {
            const { tanggal, ukuran, jumlah } = req.body;
            const result = await RekapService.tambahPenjualan({ tanggal, ukuran, jumlah });
            res.json({ status: 'sukses', data: result });
        } catch (err) {
            res.status(500).json({ status: 'error', pesan: err.message });
        }
    }
}

module.exports = PenjualanController;
