import supabase from '../config/supabase.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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
