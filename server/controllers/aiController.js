const openaiService = require('../services/openaiService');
const { runQuery, getQuery } = require('../database');

const aiController = {
  generateEventPlan: async (req, res) => {
    try {
      const { userInput, preferences } = req.body;

      if (!userInput || userInput.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'User input is required'
        });
      }

      const eventPlan = await openaiService.generateEventPlan(userInput, preferences || {});

      const eventData = {
        user_id: 1,
        event_name: eventPlan.eventName || 'AI Generated Event',
        event_type: eventPlan.eventType || 'General Event',
        description: eventPlan.description || userInput,
        date: preferences?.event_date,
        time: preferences?.event_time,
        location: preferences?.venue,
        city: preferences?.city,
        venue_type: preferences?.venue_type,
        audience_size: preferences?.number_of_people,
        duration: preferences?.duration || 4,
        status: 'planning'
      };

      const result = await runQuery(
        `INSERT INTO events (
          user_id, event_name, event_type, description, date, time,
          location, city, venue_type, audience_size, duration, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          eventData.user_id,
          eventData.event_name,
          eventData.event_type,
          eventData.description,
          eventData.date,
          eventData.time,
          eventData.location,
          eventData.city,
          eventData.venue_type,
          eventData.audience_size,
          eventData.duration,
          eventData.status
        ]
      );

      const savedEvent = await getQuery('SELECT * FROM events WHERE id = ?', [result.id]);

      if (eventPlan.tasks && Array.isArray(eventPlan.tasks)) {
        for (const task of eventPlan.tasks) {
          await runQuery(
            `INSERT INTO tasks (event_id, title, description, status, priority) VALUES (?, ?, ?, ?, ?)`,
            [result.id, task.title || task, task.description || '', 'todo', task.priority || 'medium']
          );
        }
      }

      if (eventPlan.budget) {
        await runQuery(
          `INSERT INTO budgets (event_id, venue_total, catering_total, services_total, miscellaneous_total, grand_total, budget_data)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            result.id,
            eventPlan.budget.venue || 0,
            eventPlan.budget.catering || 0,
            eventPlan.budget.services || 0,
            eventPlan.budget.miscellaneous || 0,
            eventPlan.budget.total || 0,
            JSON.stringify(eventPlan.budget)
          ]
        );
      }

      res.status(201).json({
        success: true,
        data: {
          event: savedEvent,
          eventPlan
        }
      });
    } catch (error) {
      console.error('Error generating event plan:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to generate event plan'
      });
    }
  },

  generatePoster: async (req, res) => {
    try {
      const { eventId } = req.params;

      if (!eventId) {
        return res.status(400).json({
          success: false,
          error: 'Event ID is required'
        });
      }

      const event = await getQuery('SELECT * FROM events WHERE id = ?', [eventId]);

      if (!event) {
        return res.status(404).json({
          success: false,
          error: 'Event not found'
        });
      }

      const poster = await openaiService.generatePoster(event);

      await runQuery(
        `INSERT INTO marketing_materials (event_id, material_type, title, content)
         VALUES (?, ?, ?, ?)`,
        [eventId, 'poster', 'Event Poster', JSON.stringify(poster)]
      );

      res.json({
        success: true,
        data: poster
      });
    } catch (error) {
      console.error('Error generating poster:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to generate poster'
      });
    }
  },

  generateEmailDraft: async (req, res) => {
    try {
      const { eventId } = req.params;

      if (!eventId) {
        return res.status(400).json({
          success: false,
          error: 'Event ID is required'
        });
      }

      const event = await getQuery('SELECT * FROM events WHERE id = ?', [eventId]);

      if (!event) {
        return res.status(404).json({
          success: false,
          error: 'Event not found'
        });
      }

      const email = await openaiService.generateEmailDraft(event);

      await runQuery(
        `INSERT INTO marketing_materials (event_id, material_type, title, content)
         VALUES (?, ?, ?, ?)`,
        [eventId, 'email', email.subject, JSON.stringify(email)]
      );

      res.json({
        success: true,
        data: email
      });
    } catch (error) {
      console.error('Error generating email draft:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to generate email draft'
      });
    }
  },

  generateInstagramCaption: async (req, res) => {
    try {
      const { eventId } = req.params;

      if (!eventId) {
        return res.status(400).json({
          success: false,
          error: 'Event ID is required'
        });
      }

      const event = await getQuery('SELECT * FROM events WHERE id = ?', [eventId]);

      if (!event) {
        return res.status(404).json({
          success: false,
          error: 'Event not found'
        });
      }

      const instagram = await openaiService.generateInstagramCaption(event);

      await runQuery(
        `INSERT INTO marketing_materials (event_id, material_type, title, content)
         VALUES (?, ?, ?, ?)`,
        [eventId, 'instagram', 'Instagram Captions', JSON.stringify(instagram)]
      );

      res.json({
        success: true,
        data: instagram
      });
    } catch (error) {
      console.error('Error generating Instagram caption:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to generate Instagram caption'
      });
    }
  },

  generateAllContent: async (req, res) => {
    try {
      const { userInput, preferences } = req.body;

      if (!userInput || userInput.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'User input is required'
        });
      }

      const allContent = await openaiService.generateAllContent(userInput, preferences || {});

      const eventData = {
        user_id: 1,
        event_name: allContent.eventPlan.eventName || 'AI Generated Event',
        event_type: allContent.eventPlan.eventType || 'General Event',
        description: allContent.eventPlan.description || userInput,
        date: preferences?.event_date,
        time: preferences?.event_time,
        location: preferences?.venue,
        city: preferences?.city,
        venue_type: preferences?.venue_type,
        audience_size: preferences?.number_of_people,
        duration: preferences?.duration || 4,
        status: 'planning'
      };

      const result = await runQuery(
        `INSERT INTO events (
          user_id, event_name, event_type, description, date, time,
          location, city, venue_type, audience_size, duration, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          eventData.user_id,
          eventData.event_name,
          eventData.event_type,
          eventData.description,
          eventData.date,
          eventData.time,
          eventData.location,
          eventData.city,
          eventData.venue_type,
          eventData.audience_size,
          eventData.duration,
          eventData.status
        ]
      );

      const savedEvent = await getQuery('SELECT * FROM events WHERE id = ?', [result.id]);

      if (allContent.eventPlan.tasks && Array.isArray(allContent.eventPlan.tasks)) {
        for (const task of allContent.eventPlan.tasks) {
          await runQuery(
            `INSERT INTO tasks (event_id, title, description, status, priority) VALUES (?, ?, ?, ?, ?)`,
            [result.id, task.title || task, task.description || '', 'todo', task.priority || 'medium']
          );
        }
      }

      if (allContent.eventPlan.budget) {
        await runQuery(
          `INSERT INTO budgets (event_id, venue_total, catering_total, services_total, miscellaneous_total, grand_total, budget_data)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            result.id,
            allContent.eventPlan.budget.venue || 0,
            allContent.eventPlan.budget.catering || 0,
            allContent.eventPlan.budget.services || 0,
            allContent.eventPlan.budget.miscellaneous || 0,
            allContent.eventPlan.budget.total || 0,
            JSON.stringify(allContent.eventPlan.budget)
          ]
        );
      }

      await runQuery(
        `INSERT INTO marketing_materials (event_id, material_type, title, content)
         VALUES (?, ?, ?, ?)`,
        [result.id, 'poster', 'Event Poster', JSON.stringify(allContent.poster)]
      );

      await runQuery(
        `INSERT INTO marketing_materials (event_id, material_type, title, content)
         VALUES (?, ?, ?, ?)`,
        [result.id, 'email', allContent.email.subject, JSON.stringify(allContent.email)]
      );

      await runQuery(
        `INSERT INTO marketing_materials (event_id, material_type, title, content)
         VALUES (?, ?, ?, ?)`,
        [result.id, 'instagram', 'Instagram Captions', JSON.stringify(allContent.instagram)]
      );

      res.status(201).json({
        success: true,
        data: {
          event: savedEvent,
          ...allContent
        }
      });
    } catch (error) {
      console.error('Error generating all content:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to generate content'
      });
    }
  }
};

module.exports = aiController;
