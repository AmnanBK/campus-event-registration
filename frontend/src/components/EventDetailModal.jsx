import React from 'react';
// Import Icon
import calendarIcon from '../assets/icons/ic-calendar.svg';
import clockIcon from '../assets/icons/ic-clock.svg';
import locationIcon from '../assets/icons/ic-location.svg';
import peopleIcon from '../assets/icons/ic-people.svg'; 

const EventDetailModal = ({ isOpen, onClose, event, onRegister, onCancel }) => {
  if (!isOpen || !event) return null;

  const isRegistered = event.is_registered;

  const now = new Date();
  const startTime = new Date(event.start_time);
  const endTime = new Date(event.end_time);

  const isCancelled = event.status === 'cancelled';

  const isFinished = !isCancelled && (now > endTime);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      
      <div className="bg-white rounded-card w-full max-w-2xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
        
        {/* HEADER */}
        <div className="p-6 pb-2 flex justify-between items-start">
          <div>
            <h2 className="text-h2 text-neutral-main mb-1">{event.title}</h2>
            <p className="text-body text-neutral-secondary">{event.organizer}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-neutral-secondary hover:text-neutral-main p-1"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* CONTENT */}
        <div className="overflow-y-auto px-6 py-2 custom-scrollbar">
          
          {/* BANNER */}
          <div className="w-full h-48 md:h-64 rounded-xl overflow-hidden mb-6 bg-gray-100 relative">
            <img 
              src={event.image} 
              alt={event.title} 
              className={`w-full h-full object-cover ${(isFinished || isCancelled) ? 'grayscale opacity-90' : ''}`}
            />
            {/* Badge Status di Gambar */}
            {isFinished && (
               <div className="absolute top-4 right-4 bg-gray-800/80 text-white px-3 py-1 rounded-full text-xs uppercase">
                 Selesai
               </div>
            )}
             {isCancelled && (
               <div className="absolute top-4 right-4 bg-red-800/80 text-white px-3 py-1 rounded-full text-xs uppercase">
                 Dibatalkan
               </div>
            )}
          </div>

          {/* METADATA GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 mb-6">
            <div className="flex items-start gap-3">
              <img src={calendarIcon} alt="" className="w-5 h-5 mt-0.5" />
              <div>
                <p className="text-body text-neutral-secondary">Tanggal</p>
                <p className="text-body text-neutral-main">{event.date}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <img src={locationIcon} alt="" className="w-5 h-5 mt-0.5" />
              <div>
                <p className="text-body text-neutral-secondary">Lokasi</p>
                <p className="text-body text-neutral-main">{event.location}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <img src={clockIcon} alt="" className="w-5 h-5 mt-0.5" />
              <div>
                <p className="text-body text-neutral-secondary">Waktu</p>
                <p className="text-body text-neutral-main">{event.time}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <img src={peopleIcon} alt="" className="w-5 h-5 mt-0.5"/>
              <div>
                <p className="text-body text-neutral-secondary">Kuota Pendaftar</p>
                <p className="text-body text-neutral-main">
                  {event.quotaFilled}/{event.quotaTotal}
                </p>
              </div>
            </div>
          </div>

          {/* DESKRIPSI */}
          <div className="mb-6">
            <p className="text-body text-neutral-main mb-2">Deskripsi</p>
            <div className="border border-neutral-border rounded-lg p-4 bg-white min-h-[100px]">
              <p className="text-body text-neutral-secondary leading-relaxed">
                {event.description}
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t border-neutral-border flex justify-end gap-4 bg-white mt-auto">
          <button 
            onClick={onClose}
            className="px-6 h-btn rounded-btn border border-neutral-border text-neutral-main font-bold hover:bg-neutral-soft transition-colors"
          >
            Kembali
          </button>

          {/* LOGIKA TOMBOL BERDASARKAN WAKTU & STATUS */}
          {(() => {
            // 1. Jika Batal (Prioritas Database)
            if (isCancelled) {
              return (
                <button disabled className="px-6 h-btn rounded-btn bg-red-100 text-red-500 font-bold cursor-not-allowed border border-red-200">
                  Acara Dibatalkan
                </button>
              );
            }

            // 2. Jika Selesai (Prioritas Waktu: now > end)
            if (isFinished) {
              return
            }

            // 3. Jika Masih Aktif & Sudah Daftar
            if (isRegistered) {
              return (
                <button 
                  onClick={() => onCancel(event.id)}
                  className="px-6 h-btn rounded-btn bg-feedback-danger text-white font-bold hover:bg-red-700 transition-colors shadow-md"
                >
                  Batalkan Pendaftaran
                </button>
              );
            }

            // 4. Default: Masih Aktif & Belum Daftar
            return (
              <button 
                onClick={() => onRegister(event.id)}
                className="px-6 h-btn rounded-btn bg-primary-main text-white font-bold hover:bg-primary-hover transition-colors shadow-md"
              >
                Daftar
              </button>
            );
          })()}
        </div>

      </div>
    </div>
  );
};

export default EventDetailModal;