import React from 'react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, title = "Apakah Anda yakin akan menghapus data ini?", message = "Data yang Anda hapus akan hilang secara permanen dan tidak dapat dipulihkan." }) => {
  if (!isOpen) return null;

  return (
    // BACKDROP
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
      
      {/* MODAL CONTAINER */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-[400px] p-8 flex flex-col items-center text-center animate-scaleIn">
        
        {/* ICON SAMPAH MERAH (SVG) */}
        <div className="mb-6">
          <svg width="83" height="93" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20" stroke="#B3261E" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* TITLE */}
        <h3 className="text-[20px] text-neutral-secondary mb-3 leading-snug">
          {title}
        </h3>

        {/* MESSAGE */}
        <p className="text-body text-neutral-secondary mb-8 leading-relaxed px-4">
          {message}
        </p>

        {/* BUTTON GROUP */}
        <div className="flex gap-4 w-full justify-center">
          {/* Tombol TIDAK */}
          <button
            onClick={onClose}
            className="w-[120px] h-[45px] rounded-lg border border-neutral-border text-neutral-main font-bold text-[16px] hover:bg-neutral-soft transition-colors"
          >
            Tidak
          </button>

          {/* Tombol YA (Merah) */}
          <button
            onClick={onConfirm}
            className="w-[120px] h-[45px] rounded-lg bg-[#B3261E] text-white font-bold text-[16px] hover:bg-red-800 transition-colors shadow-md"
          >
            Ya
          </button>
        </div>

      </div>
    </div>
  );
};

export default DeleteConfirmModal;