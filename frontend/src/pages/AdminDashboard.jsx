import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
import Swal from 'sweetalert2';

// --- IMPORT MODAL YANG BARU DIBUAT ---
import NewOrganizerFormModal from '../components/NewOrganizerFormModal'; 
import DeleteConfirmModal from '../components/DeleteConfirmModal';

// Import Icons
import buildingIcon from '../assets/icons/ic-building.svg';
import userIcon from '../assets/icons/ic-people.svg';
import calendarIcon from '../assets/icons/ic-calendar.svg';
import plusIcon from '../assets/icons/ic-add.svg'; 
import trashIcon from '../assets/icons/ic-delete-confirm.svg';

const AdminUsersPage = () => {
  const location = useLocation();
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [stats, setStats] = useState({ total_events: 0, total_participants: 0, total_organizers: 0 });
  const [organizers, setOrganizers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

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

  // --- HANDLER BUKA MODAL ---
  const handleCreate = () => {
    setIsModalOpen(true);
  };

  // --- HANDLER SUBMIT DATA (Dipanggil dari Modal) ---
  const handleSubmitOrganizer = async (data) => {
    try {
      // API Call
      await api.post('/admin/organizers', data);
      
      // Notifikasi Sukses
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Akun mitra berhasil ditambahkan.',
        confirmButtonColor: '#003366',
        timer: 1500
      });
      
      // Tutup Modal & Refresh Data
      setIsModalOpen(false);
      fetchData();

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Gagal membuat akun.',
        confirmButtonColor: '#003366'
      });
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteTargetId(id);
    setIsDeleteModalOpen(true);
  };

  // 2. Eksekusi saat tombol "YA" diklik di Modal
  const handleDelete = async () => {
    if (!deleteTargetId) return;

    try {
      // Simulasi sukses 
      console.log("Menghapus ID:", deleteTargetId);

      // Tutup Modal & Reset Target
      setIsDeleteModalOpen(false);
      setDeleteTargetId(null);

      Swal.fire({
        icon: 'success',
        title: 'Terhapus!',
        text: 'Data berhasil dihapus.',
        showConfirmButton: false,
        timer: 1500
      });

      fetchData();

    } catch (error) {
      setIsDeleteModalOpen(false);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: error.response?.data?.message || 'Gagal menghapus data.',
        confirmButtonColor: '#003366'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8FA] font-sans">
      <Navbar />
      
      <NewOrganizerFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitOrganizer}
      />

      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Penyelenggara?"
        message="Apakah Anda yakin ingin menghapus akun penyelenggara ini? Data yang dihapus tidak dapat dikembalikan."
      />
      
      <main className="pt-[100px] px-4 md:px-8 pb-10 max-w-7xl mx-auto">
        
        {/* --- CARDS STATISTIK --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-xl border border-neutral-border shadow-sm flex flex-col justify-between h-[120px]">
                <div className="flex justify-between items-start">
                    <span className="text-neutral-secondary text-body text-sm">Total Acara</span>
                    <img src={calendarIcon} alt="" className="w-5 h-5 text-primary-main opacity-70" />
                </div>
                <h3 className="text-[32px] text-primary-main mt-auto">
                    {stats.total_events}
                </h3>
            </div>
            
            {/* Card 2 */}
            <div className="bg-white p-6 rounded-xl border border-neutral-border shadow-sm flex flex-col justify-between h-[120px]">
                <div className="flex justify-between items-start">
                    <span className="text-neutral-secondary text-body text-sm">Total Pendaftar</span>
                    <img src={userIcon} alt="" className="w-5 h-5 text-primary-main opacity-70" />
                </div>
                <h3 className="text-[32px] text-primary-main mt-auto">
                    {stats.total_participants}
                </h3>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 rounded-xl border border-neutral-border shadow-sm flex flex-col justify-between h-[120px]">
                <div className="flex justify-between items-start">
                    <span className="text-neutral-secondary text-body text-sm">Jumlah Penyelenggara</span>
                    <img src={buildingIcon} alt="" className="w-5 h-5 text-primary-main opacity-70" />
                </div>
                <h3 className="text-[32px] text-primary-main mt-auto">
                    {stats.total_organizers}
                </h3>
            </div>
        </div>

        {/* --- DAFTAR PENYELENGGARA --- */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-border overflow-hidden">
          
          {/* Header Section */}
          <div className="p-6 border-b border-neutral-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#F9FAFB]">
             <div>
                <h3 className="text-[18px] text-neutral-main">Daftar Penyelenggara Acara</h3>
                <p className="text-[15px] text-neutral-secondary mt-1">Kelola akun penyelenggara dan berikan akses</p>
             </div>
             <button 
                onClick={handleCreate} 
                className="bg-[#003366] hover:bg-[#002244] text-white px-5 py-2.5 rounded-lg text-body flex items-center gap-2 transition-colors shadow-sm"
              >
                <img src={plusIcon} alt="" className="w-4 h-4 invert brightness-0" /> Buat Akun Penyelenggara
              </button>
          </div>

          {/* TABEL AREA */}
          <div className="p-6">
            <div className="border border-neutral-border rounded-lg overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-[#F8F9FA] border-b border-neutral-border">
                        <tr>
                            <th className="py-4 px-4 text-table-header text-neutral-secondary w-[25%]">Penyelenggara</th>
                            <th className="py-4 px-4 text-table-header text-neutral-secondary w-[30%]">E-mail</th>
                            <th className="py-4 px-4 text-table-header text-neutral-secondary w-[15%]">Total Acara</th>
                            <th className="py-4 px-4 text-table-header text-neutral-secondary w-[15%]">Total Peserta</th>
                            {/* <th className="py-4 px-4 text-table-header text-neutral-secondary w-[15%] text-center">Aksi</th> */}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-border">
                        {isLoading ? (
                            <tr>
                                <td colSpan="5" className="py-12 text-center text-neutral-secondary">
                                    <div className="flex flex-col items-center gap-2">
                                        <span className="w-6 h-6 border-2 border-primary-main/30 border-t-primary-main rounded-full animate-spin"></span>
                                        <span>Memuat data...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : organizers.length > 0 ? (
                            organizers.map((org) => (
                                <tr key={org.id} className="hover:bg-neutral-50 transition-colors">
                                    <td className="py-4 px-4 text-body text-neutral-main">{org.name}</td>
                                    <td className="py-4 px-4 text-body text-neutral-secondary">{org.email}</td>
                                    <td className="py-4 px-4 text-body text-neutral-secondary">{org.total_events}</td>
                                    <td className="py-4 px-4 text-body text-neutral-secondary">{org.total_participants}</td>
                                    {/* <td className="py-4 px-4 text-center">
                                        <button onClick={() => handleDeleteClick(org.id)} className="p-2 rounded-lg border border-feedback-danger/20 hover:bg-feedback-dangerBg transition-colors" title="Hapus Acara">
                                            <img src={trashIcon} alt="Delete" className="w-4 h-4" />
                                        </button>
                                    </td> */}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="py-12 text-center text-neutral-secondary">
                                    Belum ada data penyelenggara.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
};

export default AdminUsersPage;