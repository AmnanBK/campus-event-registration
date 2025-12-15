import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'; 

const organizerSchema = z.object({
  name: z.string().min(3, "Nama organisasi minimal 3 karakter"),
  email: z.string().email("Format email tidak valid"),
});

const NewOrganizerFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(organizerSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: ''
    }
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          name: initialData.name,
          email: initialData.email,
        });
      } else {
        reset({ name: '', email: '' });
      }
    }
  }, [isOpen, initialData, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        
        {/* HEADER */}
        <div className="p-6 border-b border-neutral-border flex justify-between items-start">
          <div>
            <h2 className="text-h2 text-neutral-main">
              {initialData ? 'Edit Mitra Penyelenggara' : 'Buat Akun Penyelenggara'}
            </h2>
            <p className="text-body text-neutral-secondary mt-1">
              {initialData ? 'Perbarui data akun mitra' : 'Tambahkan akun organisasi resmi kampus'}
            </p>
          </div>
          <button onClick={onClose} className="text-neutral-secondary hover:text-neutral-main p-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* FORM CONTENT */}
        <div className="p-6">
          <form id="organizer-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* 1. NAMA PENYELENGGARA */}
            <div>
              <label className="block text-body text-neutral-main mb-2">Nama Penyelenggara</label>
              <input
                type="text"
                className={`w-full px-4 py-2.5 rounded-lg border ${errors.name ? 'border-red-500 focus:ring-red-200' : 'border-neutral-input focus:border-primary-main focus:ring-primary-main'} focus:outline-none focus:ring-1 transition-colors text-sm`}
                placeholder="Contoh: BEM UPNVY, UKM Basket"
                {...register("name")} 
              />
              {errors.name && <span className="text-xs text-red-500 mt-1 block">{errors.name.message}</span>}
            </div>

            {/* 2. EMAIL PENYELENGGARA */}
            <div>
              <label className="block text-body text-neutral-main mb-2">E-mail</label>
              <input
                type="email"
                // Disable email kalau lagi Edit (biasanya email jadi ID unik)
                disabled={!!initialData} 
                className={`w-full px-4 py-2.5 rounded-lg border ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-neutral-input focus:border-primary-main focus:ring-primary-main'} focus:outline-none focus:ring-1 transition-colors text-sm ${initialData ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
                placeholder="Contoh: bem@upnyk.ac.id"
                {...register("email")}
              />
              {errors.email && <span className="text-xs text-red-500 mt-1 block">{errors.email.message}</span>}
            </div>

            {/* INFO BOX (Hanya muncul saat Create Baru) */}
            {!initialData && (
               <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-body text-blue-800 leading-relaxed">
                 <span className="font-bold">Catatan:</span> Password default akan dikirimkan ke email penyelenggara yang didaftarkan.
               </div>
            )}

          </form>
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t border-neutral-border bg-gray-50 flex justify-end gap-3 mt-auto">
          <button 
            onClick={onClose} 
            type="button" 
            disabled={isSubmitting} 
            className="px-5 py-2.5 rounded-lg border border-neutral-border text-neutral-main font-bold hover:bg-neutral-200 text-body transition-colors"
          >
            Batal
          </button>
          
          <button 
            form="organizer-form" 
            type="submit" 
            disabled={isSubmitting} 
            className="px-5 py-2.5 rounded-lg bg-[#003366] text-white font-bold hover:bg-[#002244] shadow-md flex items-center justify-center text-body transition-colors"
          >
            {isSubmitting ? (
               <div className="flex items-center gap-2">
                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                 <span>Menyimpan...</span>
               </div>
            ) : (
               initialData ? 'Simpan Perubahan' : 'Buat Akun'
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default NewOrganizerFormModal;