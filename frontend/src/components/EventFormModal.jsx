import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

const EventFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  // 1. SETUP REACT HOOK FORM
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  // 2. LOGIC: RESET FORM SAAT MODAL DIBUKA
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Mode Edit: Isi form dengan data lama
        reset({
          title: initialData.title,
          description: initialData.description,
          event_date: initialData.date_raw, // Pastikan format YYYY-MM-DD
          start_time: initialData.start_time_raw, // HH:mm
          end_time: initialData.end_time_raw,     // HH:mm
          quota: initialData.quota_total,
          location: initialData.location,
        });
      } else {
        // Mode Create: Kosongkan form
        reset({
          title: '',
          description: '',
          event_date: '',
          start_time: '',
          end_time: '',
          quota: '',
          location: ''
        });
      }
    }
  }, [isOpen, initialData, reset]);

  // Pantau value start_time untuk validasi real-time
  const startTimeValue = watch("start_time");

  if (!isOpen) return null;

  return (
    // BACKDROP
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      
      {/* MODAL CONTAINER */}
      <div className="bg-white rounded-card w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* HEADER */}
        <div className="p-6 border-b border-neutral-border flex justify-between items-start">
          <div>
            <h2 className="text-h2 text-neutral-main">
              {initialData ? 'Edit Acara' : 'Buat Acara Baru'}
            </h2>
            <p className="text-body text-neutral-secondary mt-1">
              Isi formulir di bawah ini untuk {initialData ? 'memperbarui' : 'membuat'} acara
            </p>
          </div>
          <button onClick={onClose} className="text-neutral-secondary hover:text-neutral-main">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* FORM CONTENT (SCROLLABLE) */}
        <div className="overflow-y-auto p-6 custom-scrollbar">
          <form id="event-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* 1. NAMA ACARA */}
            <div>
              <label className="block text-body text-neutral-main mb-2">Nama Acara</label>
              <input
                type="text"
                className={`w-full h-[45px] px-4 rounded-input border ${errors.title ? 'border-feedback-danger' : 'border-neutral-input'} focus:outline-none focus:border-primary-main focus:ring-1 focus:ring-primary-main transition-colors`}
                placeholder="Masukkan nama acara"
                {...register("title", { required: "Nama acara wajib diisi" })}
              />
              {errors.title && <span className="text-[12px] text-feedback-danger mt-1">{errors.title.message}</span>}
            </div>

            {/* 2. DESKRIPSI */}
            <div>
              <label className="block text-body text-neutral-main mb-2">Deskripsi</label>
              <textarea
                rows="4"
                className={`w-full p-4 rounded-input border ${errors.description ? 'border-feedback-danger' : 'border-neutral-input'} focus:outline-none focus:border-primary-main focus:ring-1 focus:ring-primary-main transition-colors resize-none`}
                placeholder="Deskripsikan acara secara detail"
                {...register("description", { required: "Deskripsi wajib diisi" })}
              ></textarea>
              {errors.description && <span className="text-[12px] text-feedback-danger mt-1">{errors.description.message}</span>}
            </div>

            {/* 3. GRID TANGGAL & WAKTU */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* TANGGAL */}
              <div>
                <label className="block text-body text-neutral-main mb-2">Tanggal</label>
                <input
                  type="date"
                  className={`w-full h-[45px] px-4 rounded-input border ${errors.event_date ? 'border-feedback-danger' : 'border-neutral-input'} focus:outline-none focus:border-primary-main transition-colors`}
                  {...register("event_date", { required: "Tanggal wajib diisi" })}
                />
                {errors.event_date && <span className="text-[12px] text-feedback-danger mt-1">{errors.event_date.message}</span>}
              </div>

              {/* WAKTU (START & END) */}
              <div>
                <label className="block text-body text-neutral-main mb-2">Waktu (Mulai - Selesai)</label>
                <div className="flex items-center gap-2">
                  {/* START TIME */}
                  <div className="flex-1">
                    <input
                      type="time"
                      className={`w-full h-[45px] px-2 text-center rounded-input border ${errors.start_time ? 'border-feedback-danger' : 'border-neutral-input'} focus:outline-none focus:border-primary-main`}
                      {...register("start_time", { required: "Jam mulai wajib" })}
                    />
                  </div>
                  <span className="text-neutral-secondary">-</span>
                  {/* END TIME */}
                  <div className="flex-1">
                    <input
                      type="time"
                      className={`w-full h-[45px] px-2 text-center rounded-input border ${errors.end_time ? 'border-feedback-danger' : 'border-neutral-input'} focus:outline-none focus:border-primary-main`}
                      {...register("end_time", { 
                        required: "Jam selesai wajib",
                        // --- VALIDASI CUSTOM: END > START ---
                        validate: (value) => {
                          if (!startTimeValue) return true;
                          return value > startTimeValue || "Waktu selesai harus lebih akhir dari mulai";
                        }
                      })}
                    />
                  </div>
                </div>
                {/* Error Message Group */}
                {(errors.start_time || errors.end_time) && (
                  <span className="text-[12px] text-feedback-danger mt-1 block">
                    {errors.start_time?.message || errors.end_time?.message}
                  </span>
                )}
              </div>
            </div>

            {/* 4. KUOTA PESERTA */}
            <div>
              <label className="block text-body text-neutral-main mb-2">Kuota Peserta</label>
              <input
                type="number"
                className={`w-full h-[45px] px-4 rounded-input border ${errors.quota ? 'border-feedback-danger' : 'border-neutral-input'} focus:outline-none focus:border-primary-main transition-colors`}
                placeholder="Contoh: 100"
                min="1"
                max="5000"
                {...register("quota", { 
                  required: "Kuota wajib diisi",
                  min: { value: 1, message: "Minimal 1 peserta" },
                  max: { value: 5000, message: "Maksimal 5000 peserta" }
                })}
              />
              {errors.quota && <span className="text-[12px] text-feedback-danger mt-1">{errors.quota.message}</span>}
            </div>

            {/* 5. LOKASI */}
            <div>
              <label className="block text-body text-neutral-main mb-2">Lokasi</label>
              <input
                type="text"
                className={`w-full h-[45px] px-4 rounded-input border ${errors.location ? 'border-feedback-danger' : 'border-neutral-input'} focus:outline-none focus:border-primary-main transition-colors`}
                placeholder="Nama Gedung / Link Zoom"
                {...register("location", { required: "Lokasi wajib diisi" })}
              />
              {errors.location && <span className="text-[12px] text-feedback-danger mt-1">{errors.location.message}</span>}
            </div>

            {/* 5. URL POSTER */}
            <div>
              <label className="block text-body text-neutral-main mb-2">URL Gambar (Opsional)</label>
              <input
                type="text"
                className={`w-full h-[45px] px-4 rounded-input border ${errors.location ? 'border-feedback-danger' : 'border-neutral-input'} focus:outline-none focus:border-primary-main transition-colors`}
                {...register("poster")}
              />
              {errors.location && <span className="text-[12px] text-feedback-danger mt-1">{errors.location.message}</span>}
            </div>

          </form>
        </div>

        {/* FOOTER ACTION BUTTONS */}
        <div className="p-6 border-t border-neutral-border bg-neutral-soft/30 flex justify-end gap-3 mt-auto">
          <button 
            onClick={onClose}
            type="button"
            className="px-6 h-[40px] rounded-btn border border-neutral-border text-neutral-main  font-bold hover:bg-neutral-soft transition-colors"
          >
            Batal
          </button>
          
          <button 
            form="event-form" // Connect button luar ke form ID
            type="submit"
            className="px-6 h-[40px] rounded-btn bg-primary-main text-white font-bold hover:bg-primary-hover transition-colors shadow-md"
          >
            {initialData ? 'Simpan' : 'Buat Acara'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default EventFormModal;