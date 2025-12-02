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

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
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

    const organizer_id = req.user.id;

    let startTimestamp, endTimestamp;

    if (event_date && start_time && end_time) {
      const startDateTimeString = `${event_date}T${start_time}:00`;
      const endDateTimeString = `${event_date}T${end_time}:00`;

      startTimestamp = new Date(startDateTimeString).toISOString();
      endTimestamp = new Date(endDateTimeString).toISOString();

      if (new Date(endTimestamp) <= new Date(startTimestamp)) {
        return res.status(400).json({
          status: 'fail',
          message: 'Waktu selesai harus lebih akhir dari waktu mulai.',
        });
      }
    }

    if (quota && (quota < 1 || quota > 5000)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Kuota peserta harus antara 1 sampai 5000.',
      });
    }

    const updates = {
      title,
      description,
      location,
      quota,
      poster_url,
    };

    if (startTimestamp) updates.start_time = startTimestamp;
    if (endTimestamp) updates.end_time = endTimestamp;

    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .eq('organizer_id', organizer_id)
      .select();

    if (error) throw error;

    if (data.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message:
          'Acara tidak ditemukan atau Anda tidak memiliki akses untuk mengedit ini.',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Data acara berhasil diperbarui',
      data: data[0],
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};
