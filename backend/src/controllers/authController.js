import supabase from '../config/supabase.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { name, email, nim, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        status: 'fail',
        message: 'Name, email, password, dan role wajib diisi',
      });
    }

    const validRoles = ['student', 'organizer', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Role harus student, organizer, atau admin',
      });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          name,
          email,
          password: passwordHash,
          nim: nim || null,
          role,
        },
      ])
      .select();

    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({
          status: 'fail',
          message: 'Email atau NIM sudah terdaftar',
        });
      }
      throw error;
    }

    res.status(201).json({
      status: 'success',
      message: 'User berhasil didaftarkan',
      data: {
        id: data[0].id,
        name: data[0].name,
        email: data[0].email,
        role: data[0].role,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Email atau password salah',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'fail',
        message: 'Email atau password salah',
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, nim: user.nim },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      status: 'success',
      data: {
        token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          nim: user.nim,
          role: user.role,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
