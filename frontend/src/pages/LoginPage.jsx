import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import bgImage from '../assets/images/login-bg.svg'; 

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data.data;

      login({
        token: token,
        role: user.role,
        name: user.name,
        nim: user.nim || null
      });

      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'organizer') navigate('/organizer/dashboard');
      else navigate('/');

    } catch (err) {
      console.error("Login Error:", err);
      setError(err.response?.data?.message || 'Login gagal. Cek email & password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full font-sans">
      
      {/* Kolom Kiri */}
      {/* 'hidden lg:flex' artinya hanya muncul di layar besar (Laptop/PC) */}
      <div className="hidden lg:flex w-1/2 relative bg-primary-main items-center justify-center overflow-hidden">
        
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={bgImage} 
            alt="Campus Atmosphere" 
            className="w-full h-full object-cover opacity-20 mix-blend-overlay"
          />
        </div>
        
        {/* Konten Tengah (Icon & Teks) */}
        <div className="relative z-10 flex flex-col items-center text-center px-16">
          
          {/* Icon*/}
          <div className="mb-6">
            <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>

          {/* Judul Besar */}
          <h1 className="text-[32px] leading-tight text-white mb-4">
            Sistem Pendaftaran<br />Acara Kampus
          </h1>
          
          {/* Deskripsi */}
          <p className="text-[18px] text-blue-100 opacity-90 font-light">
            Platform terpadu untuk mengelola dan mengikuti<br />acara kampus
          </p>
        </div>
      </div>

      {/* Kolom kanan */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-white px-8">
        
        {/* Form Card */}
        <div className="w-full max-w-[480px] bg-white rounded-card p-10 border border-neutral-border shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
          
          {/* Header Form */}
          <div className="mb-8">
            <h2 className="text-[28px] text-primary-main font-bold mb-2">
              Selamat Datang
            </h2>
            <p className="text-[16px] text-neutral-secondary">
              Silakan login untuk melanjutkan
            </p>
          </div>

          {/* Alert Error */}
          {error && (
            <div className="mb-6 rounded-md bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* Form Input */}
          <form className="space-y-6" onSubmit={handleLogin}>
            
            {/* Input Username */}
            <div>
              <label className="block text-[16px] text-neutral-main mb-2">
                Email
              </label>
              <input
                type="email"
                required
                className="w-full h-[50px] px-4 rounded-input border border-neutral-input text-neutral-main placeholder-neutral-secondary/50 focus:outline-none focus:border-primary-main focus:ring-1 focus:ring-primary-main transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Input Password */}
            <div>
              <label className="block text-[16px] text-neutral-main mb-2">
                Password
              </label>
              <input
                type="password"
                required
                className="w-full h-[50px] px-4 rounded-input border border-neutral-input text-neutral-main placeholder-neutral-secondary/50 focus:outline-none focus:border-primary-main focus:ring-1 focus:ring-primary-main transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Tombol Login */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[50px] mt-4 rounded-btn bg-primary-main text-white font-bold text-[16px] hover:bg-primary-hover transition-colors shadow-md disabled:opacity-70 flex items-center justify-center"
            >
              {isLoading ? 'Memproses...' : 'Log in'}
            </button>

            {/* Link Lupa Password */}
            <div className="text-center mt-6">
              <a href="#" className="text-[16px] text-primary-main font-medium hover:underline">
                Lupa Password?
              </a>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;