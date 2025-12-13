import React from 'react';

const CancelConfirmModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
  if (!isOpen) return null;

  return (
    // Backdrop
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
      
      {/* Modal Box */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-[400px] p-8 flex flex-col items-center text-center animate-scaleIn">
        
        {/* Tombol Close (X) di pojok kanan atas */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-neutral-secondary hover:text-neutral-main transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* ICON BESAR (Lingkaran Merah dengan X) */}
        <div className="w-24 h-24 rounded-full border-[4px] border-[#B91C1C] flex items-center justify-center mb-6 mt-2">
          <svg width="93" height="93" viewBox="0 0 24 24" fill="none" stroke="#B91C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>

        {/* Judul */}
        <h3 className="text-[20px] text-neutral-secondary mb-3 leading-snug">
          Apakah Anda yakin akan<br />membatalkan pendaftaran ini?
        </h3>

        {/* Deskripsi */}
        <p className="text-body text-neutral-secondary mb-8 leading-relaxed px-4">
          Pembatalan akan menghapus data secara permanen. Anda dapat mendaftarkan diri Anda kembali.
        </p>

        {/* Tombol Aksi (Tidak & Ya) */}
        <div className="flex gap-4 w-full justify-center">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="w-[120px] h-[45px] rounded-lg border border-neutral-border text-neutral-main font-bold text-[16px] hover:bg-neutral-soft transition-colors"
          >
            Tidak
          </button>
          
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="w-[120px] h-[45px] rounded-lg bg-[#B3261E] text-white font-bold text-[16px] hover:bg-red-800 transition-colors shadow-md"
          >
            {isLoading ? (
               <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : 'Ya'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default CancelConfirmModal;