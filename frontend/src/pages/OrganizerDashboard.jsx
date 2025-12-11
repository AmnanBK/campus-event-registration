import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import OrganizerEventTable from '../components/OrganizerEventTable';

// Import Icons untuk Stats
import calendarIcon from '../assets/icons/ic-calendar.svg';
import usersIcon from '../assets/icons/ic-people.svg'; // Pastikan ada
import alertIcon from '../assets/icons/ic-warning.svg'; // Pastikan ada (tanda seru)
import plusIcon from '../assets/icons/ic-add.svg';   // Pastikan ada

const OrganizerDashboard = () => {
  // --- DUMMY DATA STATS ---
  const stats = {
    totalEvents: 2,
    totalParticipants: 150,
    fullEvents: 1
  };

  // --- DUMMY DATA EVENTS ---
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Turnamen Basket Antar Fakultas",
      date: "25 Nov 2025",
      time: "09:00 - 12:00 WIB",
      quotaFilled: 150,
      quotaTotal: 200,
      status: "Berlangsung"
    },
    {
      id: 2,
      title: "Workshop Quality Assurance",
      date: "7 Des 2025",
      time: "09:00 - 12:00 WIB",
      quotaFilled: 30,
      quotaTotal: 30,
      status: "Berlangsung"
    },
    {
      id: 3,
      title: "Turnamen Futsal Antar Fakultas",
      date: "30 Nov 2025",
      time: "16:00 - 23:00 WIB",
      quotaFilled: 150,
      quotaTotal: 200,
      status: "Berlangsung"
    }
  ]);

  // HANDLERS (Placeholder)
  const handleView = (id) => alert(`Lihat detail event ID: ${id}`);
  const handleEdit = (id) => alert(`Edit event ID: ${id}`);
  const handleDelete = (id) => {
    if(window.confirm("Yakin hapus acara ini?")) {
      setEvents(events.filter(e => e.id !== id));
    }
  };
  const handleCreateEvent = () => alert("Buka form buat acara baru");

  return (
    <div className="min-h-screen bg-primary-surface w-full font-sans">
      
      <Navbar />

      <main className="pt-[100px] px-4 md:px-8 pb-10 max-w-7xl mx-auto">
        
        {/* 1. STATS CARDS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Card 1: Total Acara */}
          <div className="bg-white p-6 rounded-card border border-neutral-border shadow-sm flex flex-col justify-between h-[120px]">
            <div className="flex justify-between items-start">
              <span className="text-neutral-secondary text-[16px]">Total Acara</span>
              <img src={calendarIcon} alt="" className="w-5 h-5 opacity-60" />
            </div>
            <h3 className="text-[32px] text-primary-main">{stats.totalEvents}</h3>
          </div>

          {/* Card 2: Total Pendaftar */}
          <div className="bg-white p-6 rounded-card border border-neutral-border shadow-sm flex flex-col justify-between h-[120px]">
            <div className="flex justify-between items-start">
              <span className="text-neutral-secondary text-[16px]">Total Pendaftar</span>
              <img src={usersIcon} alt="" className="w-5 h-5 opacity-60" />
            </div>
            <h3 className="text-[32px] text-primary-main">{stats.totalParticipants}</h3>
          </div>

          {/* Card 3: Acara Penuh (Angka Merah) */}
          <div className="bg-white p-6 rounded-card border border-neutral-border shadow-sm flex flex-col justify-between h-[120px]">
            <div className="flex justify-between items-start">
              <span className="text-neutral-secondary text-[16px]">Acara Penuh</span>
              <img src={alertIcon} alt="" className="w-5 h-5 text-feedback-danger" />
            </div>
            {/* Text Merah Sesuai Desain */}
            <h3 className="text-[32px] text-feedback-danger">{stats.fullEvents}</h3>
          </div>

        </div>

        {/* 2. TABLE SECTION */}
        <div className="bg-white rounded-card border border-neutral-border shadow-sm overflow-hidden">
          
          {/* Header Tabel & Tombol Buat Acara */}
          <div className="p-6 border-b border-neutral-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-[18px] text-neutral-main">Daftar Acara</h2>
              <p className="text-[15px] text-neutral-secondary mt-1">Kelola acara yang Anda buat</p>
            </div>
            
            <button 
              onClick={handleCreateEvent}
              className="bg-primary-main hover:bg-primary-hover text-white px-5 py-2.5 rounded-btn text-body flex items-center gap-2 transition-colors shadow-md"
            >
              <img src={plusIcon} alt="" className="w-4 h-4 invert brightness-0" /> {/* invert biar putih */}
              Buat Acara
            </button>
          </div>

          {/* Komponen Tabel */}
          <OrganizerEventTable 
            events={events}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

        </div>

      </main>
    </div>
  );
};

export default OrganizerDashboard;