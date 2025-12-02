import supabase from '../config/supabase.js';

export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      event_date,
      start_time,
      end_time,
      location,
      quota,
      poster_url,
    } = req.body;

    const organizer_id = req.user?.id;

    if (
      !title ||
      !event_date ||
      !start_time ||
      !end_time ||
      !location ||
      !quota
    ) {
      return res.status(400).json({
        status: 'fail',
        message: 'Mohon lengkapi semua field yang wajib diisi.',
      });
    }

    const startDateTimeString = `${event_date}T${start_time}:00`;
    const endDateTimeString = `${event_date}T${end_time}:00`;

    const startObj = new Date(startDateTimeString);
    const endObj = new Date(endDateTimeString);

    if (isNaN(startObj.getTime()) || isNaN(endObj.getTime())) {
      return res.status(400).json({
        status: 'fail',
        message:
          'Format tanggal atau waktu tidak valid. Gunakan YYYY-MM-DD dan HH:mm',
      });
    }

    if (endObj <= startObj) {
      return res.status(400).json({
        status: 'fail',
        message: 'Waktu selesai harus lebih akhir dari waktu mulai.',
      });
    }

    const quotaNum = Number(quota);
    if (quotaNum < 1 || quotaNum > 5000) {
      return res.status(400).json({
        status: 'fail',
        message: 'Kuota peserta harus antara 1 sampai 5000.',
      });
    }

    const { data, error } = await supabase
      .from('events')
      .insert([
        {
          organizer_id,
          title,
          description,
          start_time: startObj.toISOString(),
          end_time: endObj.toISOString(),
          location,
          quota: quotaNum,
          poster_url,
          status: 'open',
        },
      ])
      .select();

    if (error) throw error;

    res.status(201).json({
      status: 'success',
      message: 'Acara berhasil dibuat',
      data: data[0],
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};
