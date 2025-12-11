import supabase from '../config/supabase.js';

export const registerEvent = async (req, res) => {
  try {
    const { id: event_id } = req.params;
    const user_id = req.user.id;

    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('status, quota, title')
      .eq('id', event_id)
      .single();

    if (eventError || !event) {
      return res.status(404).json({
        status: 'fail',
        message: 'Acara tidak ditemukan.',
      });
    }

    if (event.status !== 'open') {
      return res.status(400).json({
        status: 'fail',
        message: `Pendaftaran gagal. Status acara saat ini: ${event.status}.`,
      });
    }

    const { count: currentParticipants, error: countError } = await supabase
      .from('registrations')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', event_id);

    if (countError) throw countError;

    if (currentParticipants >= event.quota) {
      return res.status(400).json({
        status: 'fail',
        message: 'Mohon maaf, kuota peserta sudah penuh.',
      });
    }

    const { error: insertError } = await supabase
      .from('registrations')
      .insert([{ user_id, event_id }]);

    if (insertError) {
      if (insertError.code === '23505') {
        return res.status(409).json({
          status: 'fail',
          message: 'Anda sudah terdaftar di acara ini.',
        });
      }
      throw insertError;
    }

    res.status(201).json({
      status: 'success',
      message: `Berhasil mendaftar ke acara ${event.title}`,
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

export const cancelRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const { data: registration, error: fetchError } = await supabase
      .from('registrations')
      .select('id, event_id')
      .eq('id', id)
      .eq('user_id', user_id)
      .single();

    if (fetchError || !registration) {
      return res.status(404).json({
        status: 'fail',
        message:
          'Data pendaftaran tidak ditemukan atau Anda tidak memiliki akses.',
      });
    }

    const { error: deleteError } = await supabase
      .from('registrations')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    res.status(200).json({
      status: 'success',
      message: 'Pendaftaran dibatalkan',
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
