import supabase from '../config/supabase.js';
import bcrypt from 'bcrypt';

export const createOrganizer = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        status: 'fail',
        message: 'Nama dan Email wajib diisi.',
      });
    }

    const defaultPassword = 'password123';
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(defaultPassword, saltRounds);

    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          name,
          email,
          password: passwordHash,
          role: 'organizer',
          nim: null,
        },
      ])
      .select('id, name, email, role, created_at');

    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({
          status: 'fail',
          message: 'Email sudah terdaftar digunakan oleh akun lain.',
        });
      }
      throw error;
    }

    res.status(201).json({
      status: 'success',
      message: 'Akun penyelenggara berhasil dibuat.',
      note: `Default password set to: ${defaultPassword}`,
      data: data[0],
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    const [events, participants, organizers] = await Promise.all([
      supabase.from('events').select('*', { count: 'exact', head: true }),

      supabase
        .from('registrations')
        .select('*', { count: 'exact', head: true }),

      supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'organizer'),
    ]);

    if (events.error || participants.error || organizers.error) {
      throw new Error('Gagal mengambil data statistik');
    }

    res.status(200).json({
      status: 'success',
      data: {
        total_events: events.count,
        total_participants: participants.count,
        total_organizers: organizers.count,
      },
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

export const getOrganizersList = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select(
        `
        id,
        name,
        email,
        events (
          id,
          registrations (count)
        )
      `
      )
      .eq('role', 'organizer');

    if (error) throw error;

    const formattedOrganizers = data.map((org) => {
      const totalEvents = org.events.length;

      const totalParticipants = org.events.reduce((sum, event) => {
        const count = event.registrations[0]?.count || 0;
        return sum + count;
      }, 0);

      return {
        id: org.id,
        name: org.name,
        email: org.email,
        total_events: totalEvents,
        total_participants: totalParticipants,
      };
    });

    res.status(200).json({
      status: 'success',
      data: formattedOrganizers,
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
