const { allQuery, getQuery, runQuery } = require('../database');

const eventController = {
  getAllEvents: async (req, res) => {
    try {
      const events = await allQuery('SELECT * FROM events ORDER BY created_at DESC');
      res.json({ success: true, data: events });
    } catch (error) {
      console.error('Error getting events:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getEventById: async (req, res) => {
    try {
      const event = await getQuery('SELECT * FROM events WHERE id = ?', [req.params.id]);
      if (!event) {
        return res.status(404).json({ success: false, error: 'Event not found' });
      }
      res.json({ success: true, data: event });
    } catch (error) {
      console.error('Error getting event:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  createEvent: async (req, res) => {
    try {
      const {
        user_id = 1,
        event_name,
        event_type = 'General Event',
        description,
        date,
        time,
        location,
        city,
        venue_type,
        audience_size,
        duration,
        status = 'planning'
      } = req.body;

      const finalEventName = event_name || event_type || 'Untitled Event';
      const finalEventType = event_type || 'General Event';

      const result = await runQuery(
        `INSERT INTO events (
          user_id, event_name, event_type, description, date, time,
          location, city, venue_type, audience_size, duration, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [user_id, finalEventName, finalEventType, description, date, time, location, city, venue_type, audience_size, duration, status]
      );

      const event = await getQuery('SELECT * FROM events WHERE id = ?', [result.id]);
      res.status(201).json({ success: true, data: event });
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  updateEvent: async (req, res) => {
    try {
      const {
        event_name,
        event_type,
        description,
        date,
        time,
        location,
        city,
        venue_type,
        audience_size,
        duration,
        status
      } = req.body;

      await runQuery(
        `UPDATE events SET
          event_name = ?, event_type = ?, description = ?, date = ?, time = ?,
          location = ?, city = ?, venue_type = ?, audience_size = ?, duration = ?,
          status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`,
        [event_name, event_type, description, date, time, location, city, venue_type, audience_size, duration, status, req.params.id]
      );

      const event = await getQuery('SELECT * FROM events WHERE id = ?', [req.params.id]);
      res.json({ success: true, data: event });
    } catch (error) {
      console.error('Error updating event:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  deleteEvent: async (req, res) => {
    try {
      await runQuery('DELETE FROM events WHERE id = ?', [req.params.id]);
      res.json({ success: true, message: 'Event deleted successfully' });
    } catch (error) {
      console.error('Error deleting event:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = eventController;
    