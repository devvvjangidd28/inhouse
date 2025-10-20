const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const openaiService = {
  generateEventPlan: async (userInput, preferences = {}) => {
    try {
      const prompt = `Generate a detailed event plan based on the following description:

User Input: ${userInput}

Event Details:
- Venue: ${preferences.venue || 'Not specified'}
- Number of People: ${preferences.number_of_people || 'Not specified'}
- Budget: ${preferences.budget ? `₹${preferences.budget}` : 'Not specified'}
- Event Date: ${preferences.event_date || 'Not specified'}
- Event Time: ${preferences.event_time || 'Not specified'}
- Event Type: ${preferences.event_type || 'Not specified'}

Please provide:
1. Event Name
2. Event Type
3. Detailed Description
4. Timeline (hourly breakdown)
5. Task List (at least 5-7 tasks)
6. Budget Breakdown (venue, catering, services, miscellaneous)

Format the response as a JSON object with these keys: eventName, eventType, description, timeline, tasks, budget.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are an expert event planner. Generate comprehensive event plans in JSON format. Always respond with valid JSON only.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      const content = response.choices[0].message.content.trim();

      let parsedContent;
      try {
        parsedContent = JSON.parse(content);
      } catch (e) {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedContent = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Failed to parse JSON from OpenAI response');
        }
      }

      return parsedContent;
    } catch (error) {
      console.error('Error generating event plan:', error);
      throw error;
    }
  },

  generatePoster: async (eventData) => {
    try {
      const prompt = `Create a compelling poster text for an event:

Event Name: ${eventData.eventName || eventData.event_name}
Event Type: ${eventData.eventType || eventData.event_type}
Description: ${eventData.description}
Date: ${eventData.date || 'TBA'}
Time: ${eventData.time || 'TBA'}
Location: ${eventData.location || 'TBA'}

Generate:
1. Main headline (catchy and attention-grabbing)
2. Subheadline
3. Key highlights (3-5 bullet points)
4. Call to action

Return as JSON with keys: headline, subheadline, highlights, callToAction`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a creative marketing copywriter. Generate poster content in JSON format.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 500
      });

      const content = response.choices[0].message.content.trim();

      let parsedContent;
      try {
        parsedContent = JSON.parse(content);
      } catch (e) {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedContent = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Failed to parse JSON from OpenAI response');
        }
      }

      return parsedContent;
    } catch (error) {
      console.error('Error generating poster:', error);
      throw error;
    }
  },

  generateEmailDraft: async (eventData) => {
    try {
      const prompt = `Create a professional email invitation for an event:

Event Name: ${eventData.eventName || eventData.event_name}
Event Type: ${eventData.eventType || eventData.event_type}
Description: ${eventData.description}
Date: ${eventData.date || 'TBA'}
Time: ${eventData.time || 'TBA'}
Location: ${eventData.location || 'TBA'}

Generate a complete email including:
1. Subject line
2. Greeting
3. Email body (engaging and informative)
4. Closing

Return as JSON with keys: subject, greeting, body, closing`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a professional business communications expert. Generate email content in JSON format.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 800
      });

      const content = response.choices[0].message.content.trim();

      let parsedContent;
      try {
        parsedContent = JSON.parse(content);
      } catch (e) {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedContent = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Failed to parse JSON from OpenAI response');
        }
      }

      return parsedContent;
    } catch (error) {
      console.error('Error generating email draft:', error);
      throw error;
    }
  },

  generateInstagramCaption: async (eventData) => {
    try {
      const prompt = `Create engaging Instagram captions for an event:

Event Name: ${eventData.eventName || eventData.event_name}
Event Type: ${eventData.eventType || eventData.event_type}
Description: ${eventData.description}
Date: ${eventData.date || 'TBA'}

Generate 3 different Instagram caption options:
1. Professional and formal
2. Casual and fun
3. Inspirational and engaging

Each caption should include relevant hashtags (5-10) and emojis where appropriate.

Return as JSON with keys: caption1, caption2, caption3, hashtags`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a social media marketing expert. Generate Instagram captions in JSON format.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 600
      });

      const content = response.choices[0].message.content.trim();

      let parsedContent;
      try {
        parsedContent = JSON.parse(content);
      } catch (e) {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedContent = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Failed to parse JSON from OpenAI response');
        }
      }

      return parsedContent;
    } catch (error) {
      console.error('Error generating Instagram caption:', error);
      throw error;
    }
  },

  generateAllContent: async (userInput, preferences = {}) => {
    try {
      const eventPlan = await openaiService.generateEventPlan(userInput, preferences);

      const eventData = {
        eventName: eventPlan.eventName,
        event_name: eventPlan.eventName,
        eventType: eventPlan.eventType,
        event_type: eventPlan.eventType,
        description: eventPlan.description,
        date: preferences.event_date,
        time: preferences.event_time,
        location: preferences.venue
      };

      const [poster, email, instagram] = await Promise.all([
        openaiService.generatePoster(eventData),
        openaiService.generateEmailDraft(eventData),
        openaiService.generateInstagramCaption(eventData)
      ]);

      return {
        eventPlan,
        poster,
        email,
        instagram
      };
    } catch (error) {
      console.error('Error generating all content:', error);
      throw error;
    }
  }
};

module.exports = openaiService;
