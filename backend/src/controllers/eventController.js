import supabase from '../config/supabase.js';
import { Parser } from 'json2csv';

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

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const organizer_id = req.user.id;

    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .select('id')
      .eq('id', id)
      .eq('organizer_id', organizer_id)
      .single();

    if (eventError || !eventData) {
      return res.status(404).json({
        status: 'fail',
        message: 'Acara tidak ditemukan atau Anda tidak memiliki akses.',
      });
    }

    const { count, error: regError } = await supabase
      .from('registrations')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', id);

    if (regError) throw regError;

    if (count > 0) {
      const { error: updateError } = await supabase
        .from('events')
        .update({ status: 'cancelled' })
        .eq('id', id);

      if (updateError) throw updateError;

      return res.status(200).json({
        status: 'success',
        message:
          'Acara memiliki pendaftar. Status diubah menjadi "cancelled" (Soft Delete).',
        action: 'soft_delete',
      });
    } else {
      const { error: deleteError } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      return res.status(200).json({
        status: 'success',
        message: 'Acara belum ada pendaftar. Data berhasil dihapus permanen.',
        action: 'hard_delete',
      });
    }
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

export const getEventParticipants = async (req, res) => {
  try {
    const { id } = req.params;
    const organizer_id = req.user.id;

    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .select('id')
      .eq('id', id)
      .eq('organizer_id', organizer_id)
      .single();

    if (eventError || !eventData) {
      return res.status(403).json({
        status: 'fail',
        message: 'Akses ditolak. Event ini bukan milik Anda.',
      });
    }

    const { data, error } = await supabase
      .from('registrations')
      .select(
        `
        registered_at,
        users (
          id,
          name,
          email,
          nim
        )
      `
      )
      .eq('event_id', id)
      .order('registered_at', { ascending: false });

    if (error) throw error;

    const formattedData = data.map((item) => ({
      user_id: item.users.id,
      name: item.users.name,
      email: item.users.email,
      nim: item.users.nim,
      registered_at: item.registered_at,
    }));

    res.status(200).json({
      status: 'success',
      data: formattedData,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

export const exportParticipantsCSV = async (req, res) => {
  try {
    const { id } = req.params;
    const organizer_id = req.user.id;

    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .select('title')
      .eq('id', id)
      .eq('organizer_id', organizer_id)
      .single();

    if (eventError || !eventData) {
      return res.status(403).json({
        status: 'fail',
        message: 'Akses ditolak. Event ini bukan milik Anda.',
      });
    }

    const { data, error } = await supabase
      .from('registrations')
      .select(
        `
        registered_at,
        users ( name, email, nim )
      `
      )
      .eq('event_id', id)
      .order('registered_at', { ascending: true });

    if (error) throw error;

    const participants = data.map((item) => ({
      Nama: item.users.name,
      Email: item.users.email,
      NIM: item.users.nim || '-',
      'Waktu Daftar': new Date(item.registered_at).toLocaleString('id-ID'),
    }));

    const fields = ['Nama', 'Email', 'NIM', 'Waktu Daftar'];

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(participants);

    const filename = `participants-${eventData.title.replace(/ /g, '_')}.csv`;

    res.header('Content-Type', 'text/csv');
    res.attachment(filename);
    return res.send(csv);
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const search = req.query.search || '';

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('events')
      .select('*, organizer:users(name)', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    const formattedEvents = data.map((event) => {
      const startObj = new Date(event.start_time);
      const endObj = new Date(event.end_time);

      const dateString = startObj.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

      const timeString = `${startObj.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      })} - ${endObj.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      })} WIB`;

      return {
        id: event.id,
        title: event.title,
        organizer_name: event.organizer?.name || 'Unknown Organizer',
        description: event.description,
        location: event.location,
        quota_total: event.quota,
        quota_filled: 0,
        poster_url: event.poster_url,
        status: event.status,
        display_date: dateString,
        display_time: timeString,
        start_time: event.start_time,
        end_time: event.end_time,
      };
    });

    res.status(200).json({
      status: 'success',
      data: {
        events: formattedEvents,
        pagination: {
          currentPage: page,
          itemsPerPage: limit,
          totalItems: count,
          totalPages: Math.ceil(count / limit),
        },
      },
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
