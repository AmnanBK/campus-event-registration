import supabase from '../config/supabase.js';
import bcrypt from 'bcrypt'; // Tambahkan import ini

async function seed() {
  // Kita enkripsi dulu passwordnya
  const passwordRaw = 'admin123';
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(passwordRaw, saltRounds);

  const { error } = await supabase
    .from('users')
    .insert([
      {
        name: 'Admin Irham',
        // Ganti email jadi 'admin2' supaya tidak bentrok dengan yang lama
        email: 'admin2@example.com', 
        password: passwordHash, // Masukkan password yang SUDAH di-hash
        role: 'admin',
      },
    ]);

  if (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }

  console.log('Sukses! Akun Admin baru berhasil dibuat.');
}

seed();