import supabase from '../config/supabase.js';
import bcrypt from 'bcrypt';

export const createOrganizer = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        status: 'fail',
        message: 'Nama dan Email wajib diisi.',
      });
    }

    const defaultPassword = 'password123';
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(defaultPassword, saltRounds);

    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          name,
          email,
          password: passwordHash,
          role: 'organizer',
          nim: null,
        },
      ])
      .select('id, name, email, role, created_at');

    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({
          status: 'fail',
          message: 'Email sudah terdaftar digunakan oleh akun lain.',
        });
      }
      throw error;
    }

    res.status(201).json({
      status: 'success',
      message: 'Akun penyelenggara berhasil dibuat.',
      note: `Default password set to: ${defaultPassword}`,
      data: data[0],
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
