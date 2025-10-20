import axios from 'axios';

const API_URL = 'http://localhost:4028/api';

export const aiService = {
  generateEventPlan: async (userInput, preferences = {}) => {
    try {
      const response = await axios.post(`${API_URL}/ai/generate-event-plan`, {
        userInput,
        preferences
      });
      return response.data;
    } catch (error) {
      console.error('Error generating event plan:', error);
      throw error;
    }
  },

  generatePoster: async (eventId) => {
    try {
      const response = await axios.post(`${API_URL}/ai/generate-poster/${eventId}`);
      return response.data;
    } catch (error) {
      console.error('Error generating poster:', error);
      throw error;
    }
  },

  generateEmailDraft: async (eventId) => {
    try {
      const response = await axios.post(`${API_URL}/ai/generate-email/${eventId}`);
      return response.data;
    } catch (error) {
      console.error('Error generating email draft:', error);
      throw error;
    }
  },

  generateInstagramCaption: async (eventId) => {
    try {
      const response = await axios.post(`${API_URL}/ai/generate-instagram/${eventId}`);
      return response.data;
    } catch (error) {
      console.error('Error generating Instagram caption:', error);
      throw error;
    }
  },

  generateAllContent: async (userInput, preferences = {}) => {
    try {
      const response = await axios.post(`${API_URL}/ai/generate-all`, {
        userInput,
        preferences
      });
      return response.data;
    } catch (error) {
      console.error('Error generating all content:', error);
      throw error;
    }
  }
};

export default aiService;
