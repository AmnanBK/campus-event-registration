import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';
import searchIcon from '../assets/icons/ic-search.svg'; 
import EventDetailModal from '../components/EventDetailModal';

const StudentDashboard = () => {
  const dummyEvents = [
    {
      id: 1,
      title: "Turnamen Basket Antar Fakultas",
      description: "Kompetisi basket tahunan untuk semua mahasiswa. Daftar tim minimal 5 orang.",
      date: "Senin, 25 November 2025",
      time: "09:00 - 12:00 WIB",
      location: "GOR UNY",
      organizer: "UKM Basket",
      quotaFilled: 87,
      quotaTotal: 100,
      image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=2090&auto=format&fit=crop",
      is_registered: false
    },
    {
      id: 2,
      title: "Seminar Nasional AI",
      description: "Membahas masa depan kecerdasan buatan dalam dunia industri 4.0 bersama pakar.",
      date: "Selasa, 26 November 2025",
      time: "08:00 - 15:00 WIB",
      location: "Auditorium UPN",
      organizer: "HIMATIF",
      quotaFilled: 120,
      quotaTotal: 200,
      image: "https://images.unsplash.com/photo-1475721027767-pfa536 MBE1?q=80&w=2070&auto=format&fit=crop",
      is_registered: true
    },
    {
      id: 3,
      title: "Workshop UI/UX Design",
      description: "Belajar dasar-dasar desain antarmuka aplikasi menggunakan Figma.",
      date: "Rabu, 27 November 2025",
      time: "13:00 - 16:00 WIB",
      location: "Lab Komputer 3",
      organizer: "DSC Chapter",
      quotaFilled: 25,
      quotaTotal: 30,
      image: "https://images.unsplash.com/photo-1586717791821-3f44a5638d48?q=80&w=2070&auto=format&fit=crop",
      is_registered: false
    }
  ];

  const [activeTab, setActiveTab] = useState('daftar');
  // STATE BARU UNTUK PENCARIAN
  const [searchQuery, setSearchQuery] = useState('');

  // STATE MODAL
  const [selectedEvent, setSelectedEvent] = useState(null); // Menyimpan object event yang diklik
  const [isModalOpen, setIsModalOpen] = useState(false);

  // HANDLER UNTUK BUKA MODAL
  const handleOpenModal = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  // 4. HANDLER AKSI TOMBOL
  const handleRegister = (eventId) => {
    alert(`Berhasil mendaftar ke event ID: ${eventId}`);
    // Nanti di sini panggil API POST /register
    handleCloseModal();
  };

  const handleCancelRegistration = (eventId) => {
    // Confirm dulu biar aman
    if (window.confirm("Yakin ingin membatalkan pendaftaran?")) {
      alert(`Pendaftaran event ID: ${eventId} dibatalkan.`);
      // Nanti di sini panggil API DELETE /register
      handleCloseModal();
    }
  };

  // LOGIKA FILTER (Case Insensitive)
  // Cek apakah Judul atau Penyelenggara mengandung kata kunci
  const filteredEvents = dummyEvents.filter((event) => {
    const query = searchQuery.toLowerCase(); 
    return (
      event.title.toLowerCase().includes(query) || 
      event.organizer.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-primary-surface w-full font-sans">
      
      <Navbar />

      <EventDetailModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        event={selectedEvent}
        onRegister={handleRegister}
        onCancel={handleCancelRegistration}
      />

      <main className="pt-[100px] px-4 md:px-8 pb-10 max-w-7xl mx-auto">
        
        {/* TABS */}
        <div className="mb-6 w-full">
          <div className="bg-neutral-input p-1 rounded-full flex w-full border border-neutral-border/50">
            <button 
              onClick={() => setActiveTab('daftar')}
              className={`flex-1 py-2.5 rounded-full text-body transition-all text-center ${
                activeTab === 'daftar' 
                ? 'bg-white text-neutral-main shadow-sm ring-1 ring-black/5' 
                : 'text-neutral-secondary hover:text-neutral-main hover:bg-black/5'
              }`}
            >
              Daftar Acara
            </button>

            <button 
              onClick={() => setActiveTab('riwayat')}
              className={`flex-1 py-2.5 rounded-full text-body transition-all text-center ${
                activeTab === 'riwayat' 
                ? 'bg-white text-neutral-main shadow-sm ring-1 ring-black/5' 
                : 'text-neutral-secondary hover:text-neutral-main hover:bg-black/5'
              }`}
            >
              Riwayat
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8 w-full">
          <div className="bg-white border border-neutral-border rounded-xl shadow-sm flex items-center h-[50px] px-4 w-full focus-within:ring-2 focus-within:ring-primary-main/20 focus-within:border-primary-main transition-all">
            
            <div className="flex-shrink-0 mr-3">
              <img src={searchIcon} alt="Search" className="h-5 w-5 opacity-40" />
            </div>

            <input
              type="text"
              // Hubungkan dengan State
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-full bg-transparent border-none outline-none text-neutral-main placeholder-neutral-secondary/60 text-body"
              placeholder="Cari acara berdasarkan nama atau penyelenggara..."
            />
          </div>
        </div>

        {/* Grid Event */}
        {activeTab === 'daftar' ? (
          <>
            {/* Cek apakah hasil pencarian ada? */}
            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Looping menggunakan 'filteredEvents', BUKAN 'dummyEvents' */}
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} onClick={() => handleOpenModal(event)} />
                ))}
              </div>
            ) : (
              // Tampilan jika pencarian tidak ditemukan
              <div className="text-center py-20">
                <p className="text-neutral-secondary text-lg">
                  Tidak ditemukan acara dengan kata kunci "{searchQuery}"
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-card border border-neutral-border shadow-sm">
            <p className="text-neutral-secondary">Belum ada riwayat pendaftaran.</p>
          </div>
        )}

      </main>
    </div>
  );
};

export default StudentDashboard;