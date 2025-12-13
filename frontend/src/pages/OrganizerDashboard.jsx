import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import OrganizerEventTable from '../components/OrganizerEventTable';
import EventFormModal from '../components/EventFormModal';
import Swal from 'sweetalert2';
import api from '../services/api.js';
import DeleteConfirmModal from '../components/DeleteConfirmModal.jsx';
import ParticipantTableModal from '../components/ParticipantTableModal.jsx';

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

  const [isParticipantModalOpen, setIsParticipantModalOpen] = useState(false);
  const [viewingEvent, setViewingEvent] = useState(null); // Untuk simpan event mana yg lagi dilihat

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

  const fetchStats = async () => {
    try {
      const response = await api.get('/organizers/dashboard/stats'); 
      const data = response.data.data;

      setStats({
        totalEvents: data.total_events,
        totalParticipants: data.total_participants,
        fullEvents: data.total_events_full
      });
    } catch (error) {
      console.error("Gagal ambil stats:", error);
    }
  };

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
    
      const response = await api.get('/organizers/events'); 
      const dataBackend = response.data.data || [];

      const formattedEvents = dataBackend.map((item) => {
        const getHm = (isoString) => {
          if (!isoString) return '';
          const date = new Date(isoString);
          return date.getHours().toString().padStart(2, '0') + ':' + 
                 date.getMinutes().toString().padStart(2, '0');
        };

        const getDisplayDate = (isoString) => {
             if (!isoString) return '-';
             const date = new Date(isoString);
             return date.toLocaleDateString('id-ID', {
                 day: 'numeric', month: 'short', year: 'numeric'
             });
        };

        return {
          id: item.id,
          title: item.title,
          date: getDisplayDate(item.start_time), 
          time: `${getHm(item.start_time)} - ${getHm(item.end_time)} WIB`, 
          
          quotaFilled: item.quota_filled || 0, 
          quotaTotal: item.quota_total,
          
          status: item.status_label, 
          
          date_raw: item.start_time ? item.start_time.split('T')[0] : '',
          start_time_raw: getHm(item.start_time),
          end_time_raw: getHm(item.end_time),
          description: item.description || '',
          location: item.location || '',
          quota: item.quota_total
        };
      });

      setEvents(formattedEvents);

    } catch (error) {
      console.error("Error fetching events:", error);
      Swal.fire('Gagal', 'Tidak dapat mengambil data acara.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchEvents();
  }, []);

  // HANDLERS (Placeholder)
  const handleView = (id) => {
    const eventToView = events.find(e => e.id === id);
      if (eventToView) {
          setViewingEvent(eventToView);
          setIsParticipantModalOpen(true);
      }
    };
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
    setIsFormOpen(false);

    Swal.fire({
      title: 'Menyimpan Data...',
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading() }
    });

    try {
      const payload = {
        ...data,
        poster_url: 'https://placehold.co/600x400' 
      };

      if (editingEvent) {
        await api.put(`/events/${editingEvent.id}`, payload);

        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Data acara berhasil diperbarui.',
          confirmButtonColor: '#003366',
        });

      } else {
        await api.post('/events', payload);

        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Acara baru berhasil dibuat.',
          confirmButtonColor: '#003366',
        });
      }

      fetchEvents();
      fetchStats();

    } catch (error) {
      console.error("Submit Error:", error);
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

      <ParticipantTableModal 
        isOpen={isParticipantModalOpen}
        onClose={() => setIsParticipantModalOpen(false)}
        eventId={viewingEvent?.id} // Kirim ID event ke modal buat fetch API
        eventTitle={viewingEvent?.title}
        eventDate={viewingEvent?.date_raw}
        quota={`${viewingEvent?.quotaFilled || 0}/${viewingEvent?.quotaTotal || 0}`}
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