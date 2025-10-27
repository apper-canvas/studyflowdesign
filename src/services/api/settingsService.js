import { getApperClient } from '@/services/apperClient';

export const settingsService = {
  async get() {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.fetchRecords('setting_c', {
        fields: [
          { field: { Name: 'Id' } },
          { field: { Name: 'current_semester_c' } },
          { field: { Name: 'grade_scale_c' } },
          { field: { Name: 'notifications_c' } },
          { field: { Name: 'theme_c' } }
        ],
        pagingInfo: { limit: 1, offset: 0 }
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.data && response.data.length > 0) {
        const settings = response.data[0];
        return {
          Id: settings.Id,
          current_semester_c: settings.current_semester_c || '',
          grade_scale_c: settings.grade_scale_c ? JSON.parse(settings.grade_scale_c) : {},
          notifications_c: settings.notifications_c ? JSON.parse(settings.notifications_c) : true,
          theme_c: settings.theme_c || 'light'
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching settings:', error?.response?.data?.message || error);
      return null;
    }
  },

  async update(settingsData) {
    try {
      const apperClient = getApperClient();
      
      if (!settingsData.Id) {
        throw new Error('Settings ID is required for update');
      }

      const response = await apperClient.updateRecord('setting_c', {
        records: [{
          Id: parseInt(settingsData.Id),
          current_semester_c: settingsData.current_semester_c || '',
          grade_scale_c: JSON.stringify(settingsData.grade_scale_c || {}),
          notifications_c: JSON.stringify(settingsData.notifications_c !== undefined ? settingsData.notifications_c : true),
          theme_c: settingsData.theme_c || 'light'
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
        const settings = response.results[0].data;
        return {
          Id: settings.Id,
          current_semester_c: settings.current_semester_c || '',
          grade_scale_c: settings.grade_scale_c ? JSON.parse(settings.grade_scale_c) : {},
          notifications_c: settings.notifications_c ? JSON.parse(settings.notifications_c) : true,
          theme_c: settings.theme_c || 'light'
        };
      }

      throw new Error('Failed to update settings');
    } catch (error) {
      console.error('Error updating settings:', error?.response?.data?.message || error);
      throw error;
    }
  }
};