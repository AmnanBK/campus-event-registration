import React, { useState, useEffect } from 'react';
import api from '../services/api'; 
import Swal from 'sweetalert2';

const ParticipantTableModal = ({ isOpen, onClose, eventId, eventTitle, eventDate, quota }) => {
  const [participants, setParticipants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (isOpen && eventId) {
      const fetchParticipants = async () => {
        try {
          setIsLoading(true);
          
          const response = await api.get(`/events/${eventId}/participants`);
          
          setParticipants(response.data.data);
          
        } catch (error) {
          console.error("Gagal ambil peserta:", error);
          
          if (error.response?.status === 403) {
            onClose();
            Swal.fire('Akses Ditolak', 'Anda bukan pemilik acara ini.', 'error');
          } else {
            Swal.fire('Gagal', 'Terjadi kesalahan saat memuat data peserta.', 'error');
          }
        } finally {
          setIsLoading(false);
        }
      };

      fetchParticipants();
    }
  }, [isOpen, eventId]); 

  const formatDate = (isoString) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric'
    }) + ', ' + date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
  };

  const handleExport = async () => {
    if (participants.length === 0) {
      Swal.fire({
        icon: 'info', 
        title: 'Belum Ada Peserta',
        text: 'Tidak ada data peserta untuk diunduh saat ini.',
        confirmButtonColor: '#003366'
      });
      return;
    }
    
    try {
      setIsExporting(true); 

      const response = await api.get(`/events/${eventId}/export`, {
        responseType: 'blob', 
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      const link = document.createElement('a');
      link.href = url;
      
      const cleanTitle = eventTitle ? eventTitle.replace(/[^a-zA-Z0-9]/g, '_') : 'event';
      const dateSuffix = eventDate ? `-${eventDate}` : '';
      
      link.setAttribute('download', `Peserta-${cleanTitle}${dateSuffix}.csv`);
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      window.URL.revokeObjectURL(url);

      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      Toast.fire({
        icon: 'success',
        title: 'File CSV berhasil diunduh'
      });

    } catch (error) {
      console.error("Gagal export csv:", error);
      Swal.fire('Gagal', 'Terjadi kesalahan saat mengunduh file.', 'error');
    } finally {
      setIsExporting(false); 
    }
  };

  if (!isOpen) return null;

  return (
    // BACKDROP
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      
      {/* MODAL CONTAINER */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh]">
        
        {/* HEADER */}
        <div className="p-8 pb-4 flex justify-between items-start">
          <div>
            <h2 className="text-h2 text-neutral-main">Daftar Peserta</h2>
            <p className="text-body text-neutral-secondary mt-1">{eventTitle}</p>
          </div>
          <button onClick={onClose} className="text-neutral-secondary hover:text-neutral-main p-1 rounded-full hover:bg-neutral-soft transition-colors">
            {/* Icon Close (X) */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* STATS & ACTION BAR */}
        <div className="px-8 py-4 flex justify-between items-end">
          <div>
            <p className="text-[18px] text-neutral-secondary mb-1">Kuota</p>
            <p className="text-[20px] text-primary-main">{quota}</p>
          </div>
          
          <button 
            onClick={handleExport}
            className="bg-primary-main hover:bg-primary-hover text-white px-5 py-2 rounded-lg text-body flex items-center gap-2 transition-colors shadow-md h-[40px]"
          >
            {/* Icon Download SVG */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Export CSV
          </button>
        </div>

        {/* TABLE CONTENT */}
        <div className="p-8 pt-2 overflow-y-auto custom-scrollbar">
          <div className="border border-neutral-border rounded-lg overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-[#F8F9FA] border-b border-neutral-border">
                <tr>
                  <th className="py-4 px-3 text-table-header text-neutral-secondary w-[25%]">Nama</th>
                  <th className="py-4 px-3 text-table-header text-neutral-secondary w-[30%]">E-mail</th>
                  <th className="py-4 px-3 text-table-header text-neutral-secondary w-[20%]">NIM</th>
                  <th className="py-4 px-3 text-table-header text-neutral-secondary w-[25%]">Waktu Daftar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-border">
                {isLoading ? (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-neutral-secondary">
                      <div className="flex flex-col items-center gap-2">
                        <span className="w-6 h-6 border-2 border-primary-main/30 border-t-primary-main rounded-full animate-spin"></span>
                        <span>Memuat data peserta...</span>
                      </div>
                    </td>
                  </tr>
                ) : participants.length > 0 ? (
                  participants.map((user) => (
                    <tr key={user.user_id} className="hover:bg-neutral-soft/30 transition-colors">
                      <td className="py-4 px-3 text-body text-neutral-main font-medium">{user.name}</td>
                      <td className="py-4 px-3 text-body text-neutral-secondary">{user.email}</td>
                      <td className="py-4 px-3 text-body text-neutral-secondary">{user.nim || '-'}</td>
                      <td className="py-4 px-3 text-body text-neutral-secondary">{formatDate(user.registered_at)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-neutral-secondary">
                      Belum ada peserta yang mendaftar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ParticipantTableModal;