import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'; // Import Resolver
import { eventSchema } from '../schemas/eventSchema'; // Import Schema

const EventFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }, // Ambil isSubmitting untuk loading state
  } = useForm({
    resolver: zodResolver(eventSchema), // Sambungkan Zod
    mode: 'onBlur', // <--- KUNCI UTAMA (Validasi saat user klik luar/pindah tab)
    defaultValues: {
      title: '',
      description: '',
      event_date: '',
      start_time: '',
      end_time: '',
      location: '',
      quota: ''
    }
  });

  // Effect Reset Data (Sama seperti sebelumnya)
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          title: initialData.title,
          description: initialData.description,
          event_date: initialData.date_raw || initialData.event_date,
          start_time: initialData.start_time_raw || initialData.start_time,
          end_time: initialData.end_time_raw || initialData.end_time,
          quota: initialData.quota_total || initialData.quota,
          location: initialData.location,
        });
      } else {
        reset({
          title: '', description: '', event_date: '', start_time: '', end_time: '', quota: '', location: ''
        });
      }
    }
  }, [isOpen, initialData, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-card w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* HEADER */}
        <div className="p-6 border-b border-neutral-border flex justify-between items-start">
          <div>
            <h2 className="text-h2 text-neutral-main">
              {initialData ? 'Edit Acara' : 'Buat Acara Baru'}
            </h2>
            <p className="text-body text-neutral-secondary mt-1">
              Isi formulir di bawah ini
            </p>
          </div>
          <button onClick={onClose} className="text-neutral-secondary hover:text-neutral-main">✕</button>
        </div>

        {/* FORM CONTENT */}
        <div className="overflow-y-auto p-6 custom-scrollbar">
          <form id="event-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* 1. NAMA ACARA */}
            <div>
              <label className="block text-body text-neutral-main mb-2">Nama Acara</label>
              <input
                type="text"
                className={`w-full h-[45px] px-4 rounded-input border ${errors.title ? 'border-feedback-danger' : 'border-neutral-input'} focus:outline-none focus:border-primary-main transition-colors`}
                placeholder="Masukkan nama acara"
                {...register("title")} 
              />
              {/* Pesan Error Zod */}
              {errors.title && <span className="text-[12px] text-feedback-danger mt-1 block">{errors.title.message}</span>}
            </div>

            {/* 2. DESKRIPSI */}
            <div>
              <label className="block text-body text-neutral-main mb-2">Deskripsi</label>
              <textarea
                rows="4"
                className={`w-full p-4 rounded-input border ${errors.description ? 'border-feedback-danger' : 'border-neutral-input'} focus:outline-none focus:border-primary-main resize-none`}
                placeholder="Deskripsikan acara secara detail"
                {...register("description")}
              ></textarea>
              {errors.description && <span className="text-[12px] text-feedback-danger mt-1 block">{errors.description.message}</span>}
            </div>

            {/* 3. GRID TANGGAL & WAKTU */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* TANGGAL */}
              <div>
                <label className="block text-body text-neutral-main mb-2">Tanggal</label>
                <input
                  type="date"
                  className={`w-full h-[45px] px-4 rounded-input border ${errors.event_date ? 'border-feedback-danger' : 'border-neutral-input'} focus:outline-none focus:border-primary-main`}
                  {...register("event_date")}
                />
                {errors.event_date && <span className="text-[12px] text-feedback-danger mt-1 block">{errors.event_date.message}</span>}
              </div>

              {/* WAKTU (START & END) */}
              <div>
                <label className="block text-body text-neutral-main mb-2">Waktu (Mulai - Selesai)</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <input
                      type="time"
                      className={`w-full h-[45px] px-2 text-center rounded-input border ${errors.start_time ? 'border-feedback-danger' : 'border-neutral-input'} focus:outline-none focus:border-primary-main`}
                      {...register("start_time")}
                    />
                  </div>
                  <span className="text-neutral-secondary">-</span>
                  <div className="flex-1">
                    <input
                      type="time"
                      className={`w-full h-[45px] px-2 text-center rounded-input border ${errors.end_time ? 'border-feedback-danger' : 'border-neutral-input'} focus:outline-none focus:border-primary-main`}
                      {...register("end_time")}
                    />
                  </div>
                </div>
                {/* ERROR WAKTU (Dari Refine Schema Zod) */}
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
                className={`w-full h-[45px] px-4 rounded-input border ${errors.quota ? 'border-feedback-danger' : 'border-neutral-input'} focus:outline-none focus:border-primary-main`}
                placeholder="Contoh: 100"
                min="1"
                {...register("quota")}
              />
              {/* Error Message Jelas untuk Kuota */}
              {errors.quota && <span className="text-[12px] text-feedback-danger mt-1 block">{errors.quota.message}</span>}
            </div>

            {/* 5. LOKASI */}
            <div>
              <label className="block text-body text-neutral-main mb-2">Lokasi</label>
              <input
                type="text"
                className={`w-full h-[45px] px-4 rounded-input border ${errors.location ? 'border-feedback-danger' : 'border-neutral-input'} focus:outline-none focus:border-primary-main`}
                placeholder="Nama Gedung / Link Zoom"
                {...register("location")}
              />
              {errors.location && <span className="text-[12px] text-feedback-danger mt-1 block">{errors.location.message}</span>}
            </div>

             {/* URL POSTER */}
             <div>
              <label className="block text-body text-neutral-main mb-2">URL Poster (Opsional)</label>
              <input
                type="text"
                className="w-full h-[45px] px-4 rounded-input border border-neutral-input focus:outline-none focus:border-primary-main"
                {...register("poster")}
              />
            </div>
          </form>
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t border-neutral-border bg-neutral-soft/30 flex justify-end gap-3 mt-auto">
          <button onClick={onClose} type="button" disabled={isSubmitting} className="px-6 h-[40px] rounded-btn border border-neutral-border text-neutral-main font-bold hover:bg-neutral-soft">
            Batal
          </button>
          
          <button form="event-form" type="submit" disabled={isSubmitting} className="px-6 h-[40px] rounded-btn bg-primary-main text-white font-bold hover:bg-primary-hover shadow-md flex items-center justify-center">
            {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (initialData ? 'Simpan' : 'Buat Acara')}
          </button>
        </div>

      </div>
    </div>
  );
};

export default EventFormModal;