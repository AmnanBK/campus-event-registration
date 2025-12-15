import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
import Swal from 'sweetalert2';

import buildingIcon from '../assets/icons/ic-building.svg';
import peopleIcon from '../assets/icons/ic-people.svg';
import calendarIcon from '../assets/icons/ic-calendar.svg';

const AdminUsersPage = () => {
  const [stats, setStats] = useState({ total_events: 0, total_participants: 0, total_organizers: 0 });
  const [organizers, setOrganizers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [statsRes, orgRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/organizers')
      ]);
      setStats(statsRes.data.data);
      setOrganizers(orgRes.data.data);
    } catch (error) {
      console.error("Error loading users page:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Tambah Mitra',
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="Nama Lengkap Instansi">' +
        '<input id="swal-input2" class="swal2-input" placeholder="Email Resmi">',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Simpan',
      confirmButtonColor: '#059669', // Warna hijau
      cancelButtonText: 'Batal',
      preConfirm: () => [
        document.getElementById('swal-input1').value,
        document.getElementById('swal-input2').value
      ]
    });

    if (formValues) {
      const [name, email] = formValues;
      if (!name || !email) return Swal.fire('Gagal', 'Semua kolom wajib diisi!', 'warning');
      try {
        Swal.showLoading();
        await api.post('/admin/organizers', { name, email });
        Swal.fire('Berhasil!', 'Akun mitra berhasil ditambahkan.', 'success');
        fetchData(); 
      } catch (error) {
        Swal.fire('Error', error.response?.data?.message || 'Gagal membuat akun.', 'error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-neutral-soft font-sans">
      <Navbar />
      
      <main className="pt-[100px] px-4 md:px-8 pb-10 max-w-7xl mx-auto">
        <h1 className="text-h2 text-neutral-main mb-6">Dashboard Admin</h1>

        {/* --- HEADER SECTION: BOX HIJAU & TAB SEJAJAR (KONSISTEN) --- */}
        <div className="flex flex-col xl:flex-row gap-6 mb-8 items-stretch">
          
          {/* 1. KOTAK HIJAU (STATS) */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 shadow-lg text-white flex-1 flex items-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full divide-y md:divide-y-0 md:divide-x divide-white/20">
              {/* Stat 1 */}
              <div className="flex items-center gap-4 px-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <img src={calendarIcon} className="w-8 h-8 brightness-0 invert" alt=""/>
                </div>
                <div>
                  <p className="text-sm font-medium opacity-90">Total Acara</p>
                  <h3 className="text-3xl font-bold">{stats.total_events}</h3>
                </div>
              </div>
              {/* Stat 2 */}
              <div className="flex items-center gap-4 px-4 pt-4 md:pt-0">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <img src={peopleIcon} className="w-8 h-8 brightness-0 invert" alt=""/>
                </div>
                <div>
                  <p className="text-sm font-medium opacity-90">Total Partisipan</p>
                  <h3 className="text-3xl font-bold">{stats.total_participants}</h3>
                </div>
              </div>
              {/* Stat 3 */}
              <div className="flex items-center gap-4 px-4 pt-4 md:pt-0">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <img src={buildingIcon} className="w-8 h-8 brightness-0 invert" alt=""/>
                </div>
                <div>
                  <p className="text-sm font-medium opacity-90">Mitra Penyelenggara</p>
                  <h3 className="text-3xl font-bold">{stats.total_organizers}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* 2. TAB NAVIGASI (SEJAJAR DI KANAN) */}
          <div className="bg-white rounded-2xl p-2 shadow-sm border border-neutral-border flex flex-row xl:flex-col gap-2 min-w-[200px]">
             {/* Tombol Analytics (LINK) */}
             <Link 
               to="/admin/dashboard" 
               className="flex-1 bg-transparent rounded-xl flex items-center justify-center px-6 py-3 text-neutral-secondary hover:bg-neutral-soft font-medium transition-all"
             >
                Analytics
             </Link>

             {/* Tombol Users (AKTIF) */}
             <div className="flex-1 bg-primary-surface/50 rounded-xl flex items-center justify-center px-6 py-3 border-2 border-primary-main text-primary-main font-bold cursor-default transition-all">
                Kelola Penyelenggara
             </div>
          </div>
        </div>

        {/* --- KONTEN (TABEL) --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-border p-6 min-h-[400px]">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h3 className="text-[18px] font-bold text-neutral-main">Daftar Akun Mitra</h3>
            <button 
              onClick={handleCreate} 
              className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 shadow-md flex items-center gap-2 transition-all active:scale-95 font-medium"
            >
              <span className="text-xl font-bold leading-none mb-1">+</span> Tambah Akun
            </button>
          </div>

          {isLoading ? (
             <div className="p-10 text-center text-neutral-secondary">Memuat data...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[700px]">
                <thead className="bg-neutral-soft border-b border-neutral-border">
                  <tr>
                    <th className="p-4 text-sm font-bold text-neutral-secondary uppercase tracking-wider">Nama Instansi</th>
                    <th className="p-4 text-sm font-bold text-neutral-secondary uppercase tracking-wider">Email</th>
                    <th className="p-4 text-sm font-bold text-neutral-secondary text-center uppercase tracking-wider">Acara</th>
                    <th className="p-4 text-sm font-bold text-neutral-secondary text-center uppercase tracking-wider">Partisipan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-border">
                  {organizers.map((org) => (
                    <tr key={org.id} className="hover:bg-neutral-soft/30 transition-colors">
                      <td className="p-4 font-medium text-neutral-main">{org.name}</td>
                      <td className="p-4 text-neutral-secondary">{org.email}</td>
                      <td className="p-4 text-center">
                        <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100">
                          {org.total_events}
                        </span>
                      </td>
                      <td className="p-4 text-center font-medium text-neutral-main">{org.total_participants}</td>
                    </tr>
                  ))}
                  {organizers.length === 0 && (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-neutral-secondary italic">
                        Belum ada mitra penyelenggara yang terdaftar.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default AdminUsersPage;