import { getApperClient } from '@/services/apperClient';

export const studySessionService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.fetchRecords('study_session_c', {
        fields: [
          { field: { Name: 'Id' } },
          { field: { Name: 'start_time_c' } },
          { field: { Name: 'end_time_c' } },
          { field: { Name: 'duration_c' } }
        ],
        orderBy: [{ fieldName: 'end_time_c', sorttype: 'DESC' }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching study sessions:', error?.response?.data?.message || error);
      return [];
    }
  },

  async create(sessionData) {
    try {
      if (!sessionData.start_time_c || !sessionData.end_time_c) {
        throw new Error('Start time and end time are required');
      }

      const start = new Date(sessionData.start_time_c);
      const end = new Date(sessionData.end_time_c);
      const duration = Math.floor((end - start) / 1000);

      if (duration <= 0) {
        throw new Error('Invalid session duration');
      }

      const apperClient = getApperClient();
      
      const response = await apperClient.createRecord('study_session_c', {
        records: [{
          start_time_c: sessionData.start_time_c,
          end_time_c: sessionData.end_time_c,
          duration_c: duration
        }]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results[0]) {
        if (!response.results[0].success) {
          const errors = response.results[0].errors || [];
          const errorMessage = errors.map(e => e.message || e).join(', ') || response.results[0].message;
          throw new Error(errorMessage);
        }
        return response.results[0].data;
      }

      throw new Error('Failed to create study session');
    } catch (error) {
      console.error('Error creating study session:', error?.response?.data?.message || error);
      throw error;
    }
  }
};