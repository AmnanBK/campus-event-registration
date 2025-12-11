import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    // 1. Coba ambil dari key 'user_data' (Nama yang umum dipakai)
    // GANTI 'user_data' DENGAN NAMA KEY YANG KAMU LIHAT DI LANGKAH 1 TADI!
    const storedUser = localStorage.getItem('user_data'); 
    
    console.log("--- DEBUG AXIOS ---");
    console.log("1. Raw LocalStorage:", storedUser);

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        
        // 2. Ambil token (Pastikan propertinya bernama 'token')
        const token = parsedUser.token;
        console.log("2. Token Extracted:", token ? "Ada (Panjang: " + token.length + ")" : "KOSONG");

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log("3. Header Auth Terpasang ✅");
        } else {
          console.warn("3. Token tidak ditemukan di dalam object user ⚠️");
        }
      } catch (error) {
        console.error("Gagal parsing data user:", error);
      }
    } else {
      console.warn("LocalStorage kosong! User dianggap belum login ❌");
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;