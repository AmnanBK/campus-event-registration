import supabase from '../config/supabase.js';

export const getDashboardStats = async (req, res) => {
  try {
    const organizer_id = req.user.id;

    const { data: events, error } = await supabase
      .from('events')
      .select('id, quota')
      .eq('organizer_id', organizer_id);

    if (error) throw error;

    const total_events = events.length;

    const eventIds = events.map((e) => e.id);
    let total_participants = 0;

    if (eventIds.length > 0) {
      const { count } = await supabase
        .from('registrations')
        .select('*', { count: 'exact', head: true })
        .in('event_id', eventIds);
      total_participants = count || 0;
    }

    res.status(200).json({
      status: 'success',
      data: {
        total_events,
        total_participants,
        total_events_full: 0,
      },
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

export const getMyEvents = async (req, res) => {
  try {
    const organizer_id = req.user.id;

    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .eq('organizer_id', organizer_id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const now = new Date();

    const formattedEvents = events.map((event) => {
      const start = new Date(event.start_time);
      const end = new Date(event.end_time);
      let statusLabel = 'Akan Datang';

      if (event.status === 'cancelled') {
        statusLabel = 'Dibatalkan';
      } else if (now > end) {
        statusLabel = 'Selesai';
      } else if (now >= start && now <= end) {
        statusLabel = 'Berlangsung';
      } else {
        statusLabel = 'Akan Datang';
      }

      return {
        id: event.id,
        title: event.title,
        start_time: event.start_time,
        end_time: event.end_time,
        quota_total: event.quota,
        quota_filled: 0,
        status_db: event.status,
        status_label: statusLabel,
      };
    });

    res.status(200).json({
      status: 'success',
      data: formattedEvents,
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
