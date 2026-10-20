import axios from "axios";

// Base URL backend
const API_BASE_URL = "http://localhost:5000/api";

// ==========================
// PENJUALAN
// ==========================
export const ambilPenjualan = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/penjualan`);
    return response.data;
  } catch (error) {
    console.error("Error fetching penjualan:", error);
    return [];
  }
};

export const tambahPenjualan = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/penjualan/tambah`, data);
    return response.data;
  } catch (error) {
    console.error("Error adding penjualan:", error);
    return null;
  }
};

// ==========================
// PERAMALAN SES
// ==========================
export const ambilRekapPeramalan = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/peramalan/rekap`);
    return response.data;
  } catch (error) {
    console.error("Error fetching peramalan:", error);
    return [];
  }
};

export const hitungPeramalan = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/peramalan/hitung`, data);
    return response.data;
  } catch (error) {
    console.error("Error menghitung peramalan:", error);
    return null;
  }
};
