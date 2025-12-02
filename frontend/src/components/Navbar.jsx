import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import logoutIcon from '../assets//icons/ic-logout.svg';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Login untuk menentukan nama dan role
  const getUserSubtitle = () => {
    if (!user) return '';
    
    switch (user.role) {
      case 'student':
        return user.nim;          
      case 'organizer':
        return 'Penyelenggara';   
      case 'admin':
        return 'Manajemen';     
      default:
        return user.role;         
    }
  };

  return (
    <nav className="w-full h-[80px] bg-white border-b border-neutral-border px-8 flex items-center justify-between shadow-sm fixed top-0 left-0 z-50">
      
      {/* Logo dan Judul */}
      <div className="flex items-center gap-4">
        {/* Logo Icon */}
        <div className="w-10 h-10 bg-primary-main rounded-lg flex items-center justify-center text-white">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
            <path d="M6 12v5c3 3 9 3 12 0v-5"/>
          </svg>
        </div>

        {/* Judul */}
        <div className="flex flex-col">
          <h1 className="text-h1 text-neutral-main leading-tight">
            Sistem Pendaftaran Acara Kampus
          </h1>
          <p className="text-[16px] text-neutral-secondary">
            UPN "Veteran" Yogyakarta
          </p>
        </div>
      </div>

      {/* User Profile & Logout */}
      <div className="flex items-center gap-6">
        
        {/* Info User */}
        <div className="text-right hidden md:block">
          {/* Nama User */}
          <p className="text-[16px] text-neutral-main">
            {user?.name || 'Guest'}
          </p>
          
          {/* Subtitle: NIM atau Role (Regular Grey) */}
          <p className="text-[14px] text-neutral-secondary">
            {getUserSubtitle()}
          </p>
        </div>

        {/* Tombol Logout */}
        <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 border border-neutral-border rounded-btn hover:bg-neutral-soft transition-colors group"
            >
            {/* Icon Logout dari Asset */}
            <img 
                src={logoutIcon} 
                alt="Logout Icon" 
                className="w-5 h-5 object-contain 
                        brightness-0 group-hover:brightness-0
                        group-hover:invert-[40%] group-hover:sepia-[80%] 
                        group-hover:hue-rotate-[330deg] group-hover:saturate-[400%]"
            />

            <span className="text-[14px] font-medium text-neutral-main group-hover:text-feedback-danger transition-colors">
                Logout
            </span>
            </button>
      </div>
    </nav>
  );
};

export default Navbar;