import React from 'react';

const HistoryTable = ({ data, onCancel }) => {
  return (
    <div className="bg-white rounded-card border border-neutral-border shadow-sm overflow-hidden">
      
      {/* TABLE HEADER */}
      {/* Grid Cols 12 agar presisi */}
      <div className="bg-neutral-soft border-b border-neutral-border grid grid-cols-12 gap-4 px-6 py-4 min-w-[800px]">
        <div className="col-span-4 text-body font-bold text-neutral-secondary">Judul Acara</div>
        <div className="col-span-2 text-body font-bold text-neutral-secondary">Waktu</div>
        <div className="col-span-3 text-body font-bold text-neutral-secondary">Penyelenggara</div>
        <div className="col-span-2 text-body font-bold text-neutral-secondary text-center">Status</div>
        <div className="col-span-1 text-body font-bold text-neutral-secondary text-center">Aksi</div>
      </div>

      {/* TABLE BODY */}
      <div className="divide-y divide-neutral-border">
        {data.length > 0 ? (
          data.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-neutral-soft/30 transition-colors min-w-[800px]">
              
              {/* Judul */}
              <div className="col-span-4 text-body font-medium text-neutral-main truncate pr-4">
                {item.title}
              </div>
              
              {/* Waktu */}
              <div className="col-span-2 text-body text-neutral-secondary">
                {item.date}
              </div>
              
              {/* Penyelenggara */}
              <div className="col-span-3 text-body text-neutral-secondary truncate pr-4">
                {item.organizer}
              </div>
              
              {/* Status Badge */}
              <div className="col-span-2 flex justify-center">
                <span className="bg-feedback-successBg text-feedback-success text-body px-4 py-1.5 rounded-full border border-feedback-successBorder">
                  {item.status}
                </span>
              </div>
              
              {/* Tombol Aksi */}
              <div className="col-span-1 flex justify-center">
                <button 
                  onClick={() => onCancel(item.id)}
                  className="bg-feedback-danger text-white text-body px-4 py-2 rounded-btn hover:bg-red-700 transition-colors shadow-sm"
                >
                  Batalkan
                </button>
              </div>

            </div>
          ))
        ) : (
          // Tampilan Kosong
          <div className="text-center py-16">
            <p className="text-neutral-secondary">Belum ada riwayat pendaftaran.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryTable;