import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded;

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({
        status: 'fail',
        message: 'Sesi habis atau token tidak valid, silakan login ulang',
      });
    }
  }

  if (!token) {
    res.status(401).json({
      status: 'fail',
      message: 'Akses ditolak, Anda belum login',
    });
  }
};
