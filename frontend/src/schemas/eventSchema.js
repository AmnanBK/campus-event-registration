import { z } from 'zod';

export const eventSchema = z.object({
  title: z.string().min(5, "Nama acara minimal 5 karakter"),
  event_date: z.string().min(1, "Tanggal wajib diisi"),
  poster: z.any().optional(),
  
  start_time: z.string().min(1, "Waktu mulai wajib diisi"),
  end_time: z.string().min(1, "Waktu selesai wajib diisi"),
  
  // Validasi Kuota: coerce mengubah string input menjadi angka
  quota: z.coerce
    .number({ invalid_type_error: "Kuota harus berupa angka" })
    .min(1, "Minimal 1 peserta")
    .max(5000, "Maksimal 5000 peserta"),
    
  location: z.string().min(3, "Lokasi wajib diisi"),
  poster: z.any().optional()
})
// Validasi Cross-Field (Waktu Selesai vs Mulai)
.refine((data) => {
  if (data.start_time && data.end_time) {
    // String compare jam "14:00" > "13:00" itu valid
    return data.end_time > data.start_time;
  }
  return true;
}, {
  message: "Waktu selesai harus lebih akhir dari waktu mulai",
  path: ["end_time"], // Error akan muncul di field end_time
});