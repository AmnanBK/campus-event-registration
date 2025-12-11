import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import OrganizerEventTable from '../components/OrganizerEventTable';
import EventFormModal from '../components/EventFormModal';
import Swal from 'sweetalert2';
import api from '../services/api.js';
import DeleteConfirmModal from '../components/DeleteConfirmModal.jsx';

// Import Icons untuk Stats
import calendarIcon from '../assets/icons/ic-calendar.svg';
import usersIcon from '../assets/icons/ic-people.svg'; // Pastikan ada
import alertIcon from '../assets/icons/ic-warning.svg'; // Pastikan ada (tanda seru)
import plusIcon from '../assets/icons/ic-add.svg';   // Pastikan ada

const OrganizerDashboard = () => {
  const [events, setEvents] = useState([]); // Default kosong, nunggu dari API
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalParticipants: 0,
    fullEvents: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const confirmDelete = async () => {
    setIsDeleteOpen(false); // Tutup modal dulu

    // Loading Swal
    Swal.fire({ title: 'Menghapus...', didOpen: () => Swal.showLoading() });

    try {
      // Panggil API Delete
      await api.delete(`/events/${deleteTargetId}`);
      
      // Refresh Data
      await fetchEvents();
      
      Swal.fire({
        icon: 'success',
        title: 'Terhapus!',
        text: 'Data acara berhasil dihapus.',
        confirmButtonColor: '#003366',
        timer: 1500
      });
    } catch (error) {
      console.error("Delete Error:", error);
      Swal.fire('Gagal', error.response?.data?.message || 'Gagal menghapus acara.', 'error');
    } finally {
      setDeleteTargetId(null);
    }
  };

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      
      // Panggil endpoint GET /events
      const response = await api.get('/events'); 
      const dataBackend = response.data.data.events; // Sesuaikan struktur response controller kamu

      // Mapping Data Backend -> Format Frontend
      const formattedEvents = dataBackend.map((item) => {
        // Ambil jam saja dari format ISO (2025-11-25T09:00:00)
        const getHm = (isoString) => {
          if (!isoString) return '';
          const date = new Date(isoString);
          return date.getHours().toString().padStart(2, '0') + ':' + 
                 date.getMinutes().toString().padStart(2, '0');
        };

        return {
          id: item.id,
          title: item.title,
          // Backend kamu sudah kasih format display_date ("Senin, 25 November...")
          date: item.display_date, 
          // Backend kamu sudah kasih format display_time ("09:00 - 12:00 WIB")
          time: item.display_time, 
          quotaFilled: item.quota_filled,
          quotaTotal: item.quota_total,
          status: item.status === 'open' ? 'Berlangsung' : item.status,
          
          // Data RAW untuk keperluan Form Edit nanti
          date_raw: item.start_time ? item.start_time.split('T')[0] : '',
          start_time_raw: getHm(item.start_time),
          end_time_raw: getHm(item.end_time),
          description: item.description,
          location: item.location,
          quota: item.quota_total
        };
      });

      setEvents(formattedEvents);

      // Hitung Statistik Real-time dari data yang didapat
      const totalPendaftar = formattedEvents.reduce((acc, curr) => acc + curr.quotaFilled, 0);
      const acaraPenuh = formattedEvents.filter(e => e.quotaFilled >= e.quotaTotal).length;

      setStats({
        totalEvents: formattedEvents.length,
        totalParticipants: totalPendaftar,
        fullEvents: acaraPenuh
      });

    } catch (error) {
      console.error("Error fetching events:", error);
      Swal.fire('Gagal', 'Tidak dapat mengambil data acara dari server.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Panggil saat halaman pertama kali dibuka
  useEffect(() => {
    fetchEvents();
  }, []);

  // HANDLERS (Placeholder)
  const handleView = (id) => alert(`Lihat detail event ID: ${id}`);
  const handleEdit = (id) => alert(`Edit event ID: ${id}`);
 const handleDeleteClick = (id) => {
    setDeleteTargetId(id); 
    setIsDeleteOpen(true); 
  };
 
  const handleCreateEvent = () => {
    setEditingEvent(null); // Mode Create
    setIsFormOpen(true);
  };

  const handleEditClick = (id) => {
    const eventToEdit = events.find(e => e.id === id);
    if (eventToEdit) {
      setEditingEvent(eventToEdit); // Mode Edit
      setIsFormOpen(true);
    }
  };

  const handleFormSubmit = async (data) => {
    // 1. Tutup modal dulu
    setIsFormOpen(false);

    // 2. Tampilkan Loading
    Swal.fire({
      title: 'Menyimpan Data...',
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading() }
    });

    try {
      // Siapkan payload (data yang akan dikirim)
      // Kita tambah poster_url dummy karena backend mewajibkannya
      const payload = {
        ...data,
        poster_url: 'https://placehold.co/600x400' // Gambar placeholder sementara
      };

      if (editingEvent) {
        // === UPDATE (PUT) ===
        // Endpoint: PUT /events/:id
        await api.put(`/events/${editingEvent.id}`, payload);

        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Data acara berhasil diperbarui.',
          confirmButtonColor: '#003366',
        });

      } else {
        // === CREATE (POST) ===
        // Endpoint: POST /events
        await api.post('/events', payload);

        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Acara baru berhasil dibuat.',
          confirmButtonColor: '#003366',
        });
      }

      // 3. WAJIB: Refresh Tabel dari Database
      // Panggil fungsi fetchEvents() supaya data terbaru muncul
      fetchEvents();

    } catch (error) {
      console.error("Submit Error:", error);
      // Tampilkan pesan error dari backend jika ada
      const errorMessage = error.response?.data?.message || 'Terjadi kesalahan sistem.';
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menyimpan',
        text: errorMessage,
      });
    }
  };

  return (
    <div className="min-h-screen bg-primary-surface w-full font-sans">
      
      <Navbar />

      <EventFormModal 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingEvent}
      />

      <DeleteConfirmModal 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
      />

      <main className="pt-[100px] px-4 md:px-8 pb-10 max-w-7xl mx-auto">
        
        {/* STATS CARDS (Dinamis dari Data API) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-card border border-neutral-border shadow-sm flex flex-col justify-between h-[120px]">
            <div className="flex justify-between items-start">
              <span className="text-neutral-secondary text-body">Total Acara</span>
              <img src={calendarIcon} alt="" className="w-5 h-5 opacity-60" />
            </div>
            <h3 className="text-[32px] text-primary-main">
              {isLoading ? '...' : stats.totalEvents}
            </h3>
          </div>

          <div className="bg-white p-6 rounded-card border border-neutral-border shadow-sm flex flex-col justify-between h-[120px]">
            <div className="flex justify-between items-start">
              <span className="text-neutral-secondary text-body">Total Pendaftar</span>
              <img src={usersIcon} alt="" className="w-5 h-5 opacity-60" />
            </div>
            <h3 className="text-[32px] text-primary-main">
              {isLoading ? '...' : stats.totalParticipants}
            </h3>
          </div>

          <div className="bg-white p-6 rounded-card border border-neutral-border shadow-sm flex flex-col justify-between h-[120px]">
            <div className="flex justify-between items-start">
              <span className="text-neutral-secondary text-body">Acara Penuh</span>
              <img src={alertIcon} alt="" className="w-5 h-5 text-feedback-danger" />
            </div>
            <h3 className="text-[32px] text-feedback-danger">
              {isLoading ? '...' : stats.fullEvents}
            </h3>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-white rounded-card border border-neutral-border shadow-sm overflow-hidden">
          
          <div className="p-6 border-b border-neutral-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-[18px] text-neutral-main">Daftar Acara</h2>
              <p className="text-[15px] text-neutral-secondary mt-1">Kelola acara yang Anda buat</p>
            </div>
            
            <button 
              onClick={handleCreateEvent}
              className="bg-primary-main hover:bg-primary-hover text-white px-5 py-2.5 rounded-btn text-body flex items-center gap-2 transition-colors shadow-md"
            >
              <img src={plusIcon} alt="" className="w-4 h-4 invert brightness-0" />
              Buat Acara
            </button>
          </div>

          {isLoading ? (
            <div className="p-10 text-center text-neutral-secondary flex justify-center items-center gap-2">
              <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-main"></span>
              Memuat data...
            </div>
          ) : (
            <OrganizerEventTable 
              events={events}
              onView={handleView}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          )}

        </div>

      </main>
    </div>
  );
};

export default OrganizerDashboard;