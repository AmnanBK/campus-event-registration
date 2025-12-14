import React from 'react'; 
// Import Icon Aksi
import eyeIcon from '../assets/icons/ic-eye.svg';
import editIcon from '../assets/icons/ic-edit.svg';
import trashIcon from '../assets/icons/ic-delete-confirm.svg';

const statusStyleMap = {
  'Berlangsung': 'bg-feedback-successBg text-feedback-success border-feedback-successBorder',
  'Dibatalkan': 'bg-feedback-dangerBg text-feedback-danger border-feedback-danger',
  'Akan Datang': 'bg-blue-50 text-blue-500 border-blue-500',
  'Selesai': 'bg-gray-100 text-gray-600 border-gray-600',
};


const OrganizerEventTable = ({ events, onView, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[900px]">
        
        {/* HEADER TABEL */}
        <div className="bg-neutral-soft border-b border-neutral-border grid grid-cols-12 gap-4 px-6 py-4">
          <div className="col-span-3 text-table-header text-neutral-secondary">Judul Acara</div>
          <div className="col-span-2 text-table-header text-neutral-secondary">Tanggal</div>
          <div className="col-span-2 text-table-header text-neutral-secondary">Waktu</div>
          <div className="col-span-1 text-table-header text-neutral-secondary">Kuota</div>
          <div className="col-span-2 text-table-header text-neutral-secondary text-center">Status</div>
          <div className="col-span-2 text-table-header text-neutral-secondary text-center">Aksi</div>
        </div>

        {/* BODY TABEL */}
        <div className="divide-y divide-neutral-border">
          {events.length > 0 ? (
            events.map((event) => (
              <div key={event.id} className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-neutral-soft/30 transition-colors">
                
                {/* Judul */}
                <div className="col-span-3 text-body font-medium text-neutral-main truncate pr-2">
                  {event.title}
                </div>

                {/* Tanggal */}
                <div className="col-span-2 text-body text-neutral-secondary">
                  {event.date}
                </div>

                {/* Waktu */}
                <div className="col-span-2 text-body text-neutral-secondary">
                  {event.time}
                </div>

                {/* Kuota */}
                <div className="col-span-1 text-body text-neutral-secondary">
                  {event.quotaFilled}/{event.quotaTotal}
                </div>

                {/* Status Badge */}
                <div className="col-span-2 flex justify-center">
                  <span
                    className={`text-body px-3 py-1 rounded-full border ${
                      statusStyleMap[event.status] ||
                      'bg-neutral-surface text-neutral-secondary border-neutral-border'
                    }`}
                  >
                    {event.status}
                  </span>
                </div>


                {/* Tombol Aksi (Mata, Pensil, Sampah) */}
                <div className="col-span-2 flex justify-center gap-2">
                  <button onClick={() => onView(event.id)} className="p-2 rounded-lg border border-neutral-border hover:bg-neutral-soft transition-colors" title="Lihat Detail">
                    <img src={eyeIcon} alt="View" className="w-4 h-4" />
                  </button>
                  <button onClick={() => onEdit(event.id)} className="p-2 rounded-lg border border-neutral-border hover:bg-neutral-soft transition-colors" title="Edit Acara">
                    <img src={editIcon} alt="Edit" className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDelete(event.id)} className="p-2 rounded-lg border border-feedback-danger/20 hover:bg-feedback-dangerBg transition-colors" title="Hapus Acara">
                    <img src={trashIcon} alt="Delete" className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))
          ) : (
            <div className="text-center py-10 text-neutral-secondary">
              Belum ada acara yang dibuat.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default OrganizerEventTable;