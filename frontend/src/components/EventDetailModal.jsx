import React from 'react';
// Import Icon (Pastikan file-nya ada)
import calendarIcon from '../assets/icons/ic-calendar.svg';
import clockIcon from '../assets/icons/ic-clock.svg';
import locationIcon from '../assets/icons/ic-location.svg';
import peopleIcon from '../assets/icons/ic-people.svg'; 

const EventDetailModal = ({ isOpen, onClose, event, onRegister, onCancel }) => {
  if (!isOpen || !event) return null;

  // LOGIKA UTAMA (Sesuai DoD)
  // Cek status is_registered dari data event
  const isRegistered = event.is_registered;

  return (
    // 1. BACKDROP (Latar Gelap Transparan)
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      
      {/* 2. MODAL CONTAINER */}
      <div className="bg-white rounded-card w-full max-w-2xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
        
        {/* HEADER: Judul & Tombol Close (X) */}
        <div className="p-6 pb-2 flex justify-between items-start">
          <div>
            <h2 className="text-h2 text-neutral-main mb-1">{event.title}</h2>
            <p className="text-body text-neutral-secondary">{event.organizer}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-neutral-secondary hover:text-neutral-main p-1"
          >
            {/* Icon X */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* SCROLLABLE CONTENT AREA */}
        <div className="overflow-y-auto px-6 py-2 custom-scrollbar">
          
          {/* 3. GAMBAR BANNER */}
          <div className="w-full h-48 md:h-64 rounded-xl overflow-hidden mb-6 bg-gray-100">
            <img 
              src={event.image} 
              alt={event.title} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* 4. METADATA GRID (2 Kolom) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 mb-6">
            
            {/* Tanggal */}
            <div className="flex items-start gap-3">
              <img src={calendarIcon} alt="" className="w-5 h-5 mt-0.5" />
              <div>
                <p className="text-body text-neutral-secondary">Tanggal</p>
                <p className="text-body text-neutral-main">{event.date}</p>
              </div>
            </div>

            {/* Lokasi */}
            <div className="flex items-start gap-3">
              <img src={locationIcon} alt="" className="w-5 h-5 mt-0.5" />
              <div>
                <p className="text-body text-neutral-secondary">Lokasi</p>
                <p className="text-body text-neutral-main">{event.location}</p>
              </div>
            </div>

            {/* Waktu */}
            <div className="flex items-start gap-3">
              <img src={clockIcon} alt="" className="w-5 h-5 mt-0.5" />
              <div>
                <p className="text-body text-neutral-secondary">Waktu</p>
                <p className="text-body text-neutral-main">{event.time}</p>
              </div>
            </div>

            {/* Kuota */}
            <div className="flex items-start gap-3">
              {/* Ganti src ini dengan icon user/group yang sesuai */}
              <img src={peopleIcon} alt="" className="w-5 h-5 mt-0.5"/>
              <div>
                <p className="text-body text-neutral-secondary">Kuota Pendaftar</p>
                <p className="text-body text-neutral-main">
                  {event.quotaFilled}/{event.quotaTotal}
                </p>
              </div>
            </div>
          </div>

          {/* 5. DESKRIPSI (Dalam Kotak Border) */}
          <div className="mb-6">
            <p className="text-body text-neutral-main mb-2">Deskripsi</p>
            <div className="border border-neutral-border rounded-lg p-4 bg-white min-h-[100px]">
              <p className="text-body text-neutral-secondary leading-relaxed">
                {event.description}
              </p>
            </div>
          </div>
        </div>

        {/* 6. FOOTER: Tombol Aksi */}
        <div className="p-6 border-t border-neutral-border flex justify-end gap-4 bg-white mt-auto">
          {/* Tombol Tutup/Batal Modal */}
          <button 
            onClick={onClose}
            className="px-6 h-btn rounded-btn border border-neutral-border text-neutral-main font-bold hover:bg-neutral-soft transition-colors"
          >
            Kembali
          </button>

          {/* TOMBOL DINAMIS (RED/BLUE) */}
          {isRegistered ? (
            // STATE: SUDAH TERDAFTAR -> TAMPILKAN TOMBOL MERAH (BATALKAN)
            <button 
              disabled={true}
              // onClick={() => onCancel(event.id)}
              className="px-6 h-btn rounded-btn bg-feedback-danger text-white font-bold hover:bg-red-700 transition-colors shadow-md"
            >
              Batalkan Pendaftaran
            </button>
          ) : (
            // STATE: BELUM TERDAFTAR -> TAMPILKAN TOMBOL BIRU (DAFTAR)
            <button 
              onClick={() => onRegister(event.id)}
              className="px-6 h-btn rounded-btn bg-primary-main text-white font-bold hover:bg-primary-hover transition-colors shadow-md"
            >
              Daftar
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default EventDetailModal;