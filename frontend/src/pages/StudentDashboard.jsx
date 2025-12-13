import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';
import searchIcon from '../assets/icons/ic-search.svg'; 
import EventDetailModal from '../components/EventDetailModal'; 
import HistoryTable from '../components/HistoryTable'; 
import api from '../services/api';
import Swal from 'sweetalert2';

const StudentDashboard = () => {
  const [events, setEvents] = useState([]); 
  const [history, setHistory] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('daftar');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    try {
      setIsLoading(true);

      const [eventsRes, historyRes] = await Promise.all([
        api.get('/events'),
        api.get('/registrations/history') 
      ]);

      const eventsData = eventsRes.data.data.events || [];
      const historyData = historyRes.data.data || [];

      const formattedHistory = historyData.map(item => ({
        id: item.registration_id, 
        event_id: item.event_id, 
        title: item.event_title,
        date: item.display_date,
        organizer: item.organizer_name,
        status: 'Terdaftar' 
      }));
      setHistory(formattedHistory);

      const registrationMap = {};
      formattedHistory.forEach(h => {
        registrationMap[h.event_id] = h.id; 
      });

      const formattedEvents = eventsData.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        date: item.display_date, 
        time: item.display_time,
        location: item.location,
        organizer: item.organizer_name || "Penyelenggara", 
        quotaFilled: item.quota_filled || 0,
        quotaTotal: item.quota_total || item.quota,
        image: item.poster_url || "https://placehold.co/600x400?text=No+Image",
        
        is_registered: !!registrationMap[item.id], 
        registration_id: registrationMap[item.id] || null 
      }));

      setEvents(formattedEvents);

    } catch (error) {
      console.error("Gagal memuat data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []); 

  // --- HANDLERS MODAL ---
  const handleOpenModal = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedEvent(null), 200);
  };

  // --- HANDLERS AKSI ---
  
  // 1. REGISTER
  const handleRegister = async (eventId) => {
    handleCloseModal();
    Swal.fire({ title: 'Mendaftar...', didOpen: () => Swal.showLoading() });

    try {
      await api.post(`/registrations/${eventId}`);
      await loadData(); 
      
      Swal.fire({
        icon: 'success',
        title: 'Berhasil Mendaftar!',
        text: 'Cek tiket Anda di menu Riwayat.',
        confirmButtonColor: '#003366'
      });

    } catch (error) {
      const msg = error.response?.data?.message || 'Gagal mendaftar.';
      Swal.fire('Gagal', msg, 'error');
    }
  };

  // 2. CANCEL
  const handleCancelRegistration = async (registrationId) => {
    handleCloseModal(); // Tutup modal kalau cancel dari modal
    
    const result = await Swal.fire({
      title: 'Batalkan Pendaftaran?',
      text: "Slot kuota akan dilepas dan Anda harus daftar ulang jika berubah pikiran.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#B3261E',
      cancelButtonColor: '#003366',
      confirmButtonText: 'Ya, Batalkan'
    });

    if (result.isConfirmed) {
      Swal.fire({ title: 'Memproses...', didOpen: () => Swal.showLoading() });
      try {
        await api.delete(`/registrations/${registrationId}`);
        await loadData(); 
        Swal.fire('Dibatalkan!', 'Pendaftaran dibatalkan.', 'success');
      } catch (error) {
        Swal.fire('Error', 'Gagal membatalkan.', 'error');
      }
    }
  };

  // FILTER
  const filteredEvents = events.filter((event) => {
    const query = searchQuery.toLowerCase(); 
    return (
      event.title.toLowerCase().includes(query) || 
      event.organizer.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-primary-surface w-full font-sans">
      <Navbar />

      {/* --- INTEGRASI MODAL BARU --- */}
      <EventDetailModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        event={selectedEvent}
        
        onRegister={(id) => handleRegister(id)} 
        
        onCancel={(eventId) => {
           const evt = events.find(e => e.id === eventId);
           if (evt && evt.registration_id) {
             handleCancelRegistration(evt.registration_id);
           } else {
             Swal.fire('Error', 'Data registrasi tidak ditemukan', 'error');
           }
        }} 
      />

      <main className="pt-[100px] px-4 md:px-8 pb-10 max-w-7xl mx-auto">
        
        {/* TABS */}
        <div className="mb-6 w-full">
          <div className="bg-neutral-input p-1 rounded-full flex w-full border border-neutral-border/50">
            <button 
              onClick={() => setActiveTab('daftar')}
              className={`flex-1 py-2.5 rounded-full text-body font-bold transition-all text-center ${activeTab === 'daftar' ? 'bg-white shadow-sm ring-1 ring-black/5' : 'text-neutral-secondary hover:bg-black/5'}`}
            >
              Daftar Acara
            </button>
            <button 
              onClick={() => setActiveTab('riwayat')}
              className={`flex-1 py-2.5 rounded-full text-body font-bold transition-all text-center ${activeTab === 'riwayat' ? 'bg-white shadow-sm ring-1 ring-black/5' : 'text-neutral-secondary hover:bg-black/5'}`}
            >
              Riwayat
            </button>
          </div>
        </div>

        {/* CONTENT */}
        {activeTab === 'daftar' ? (
          <>
            <div className="mb-8 w-full">
              <div className="bg-white border border-neutral-border rounded-xl shadow-sm flex items-center h-[50px] px-4 w-full focus-within:ring-2 focus-within:ring-primary-main/20">
                <img src={searchIcon} alt="Search" className="h-5 w-5 opacity-40 mr-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-full bg-transparent border-none outline-none text-body"
                  placeholder="Cari acara..."
                />
              </div>
            </div>
            
            {isLoading ? (
               <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-main"></div></div>
            ) : filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onClick={() => handleOpenModal(event)} 
                    isRegistered={event.is_registered} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-neutral-secondary">Tidak ditemukan acara.</div>
            )}
          </>
        ) : (
          <div className="overflow-x-auto pb-4">
             {isLoading ? (
                <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-main"></div></div>
             ) : (
               <HistoryTable 
                 data={history} 
                 onCancel={(regId) => handleCancelRegistration(regId)} 
               />
             )}
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;