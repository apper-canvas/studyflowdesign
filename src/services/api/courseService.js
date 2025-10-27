import { getApperClient } from '@/services/apperClient';

export const courseService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.fetchRecords('course_c', {
        fields: [
          { field: { Name: 'Id' } },
          { field: { Name: 'name_c' } },
          { field: { Name: 'code_c' } },
          { field: { Name: 'instructor_c' } },
          { field: { Name: 'color_c' } },
          { field: { Name: 'credits_c' } },
          { field: { Name: 'semester_c' } },
          { field: { Name: 'schedule_c' } }
        ],
        orderBy: [{ fieldName: 'Id', sorttype: 'DESC' }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(course => ({
        ...course,
        schedule_c: course.schedule_c ? JSON.parse(course.schedule_c) : []
      }));
    } catch (error) {
      console.error('Error fetching courses:', error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.getRecordById('course_c', parseInt(id), {
        fields: [
          { field: { Name: 'Id' } },
          { field: { Name: 'name_c' } },
          { field: { Name: 'code_c' } },
          { field: { Name: 'instructor_c' } },
          { field: { Name: 'color_c' } },
          { field: { Name: 'credits_c' } },
          { field: { Name: 'semester_c' } },
          { field: { Name: 'schedule_c' } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      const course = response.data;
      return {
        ...course,
        schedule_c: course.schedule_c ? JSON.parse(course.schedule_c) : []
      };
    } catch (error) {
      console.error(`Error fetching course ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(courseData) {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.createRecord('course_c', {
        records: [{
          name_c: courseData.name_c,
          code_c: courseData.code_c,
          instructor_c: courseData.instructor_c || '',
          color_c: courseData.color_c || '#6366f1',
          credits_c: courseData.credits_c ? parseInt(courseData.credits_c) : 3,
          semester_c: courseData.semester_c || '',
          schedule_c: JSON.stringify(courseData.schedule_c || [])
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
        const course = response.results[0].data;
        return {
          ...course,
          schedule_c: course.schedule_c ? JSON.parse(course.schedule_c) : []
        };
      }

      throw new Error('Failed to create course');
    } catch (error) {
      console.error('Error creating course:', error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, courseData) {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.updateRecord('course_c', {
        records: [{
          Id: parseInt(id),
          name_c: courseData.name_c,
          code_c: courseData.code_c,
          instructor_c: courseData.instructor_c || '',
          color_c: courseData.color_c || '#6366f1',
          credits_c: courseData.credits_c ? parseInt(courseData.credits_c) : 3,
          semester_c: courseData.semester_c || '',
          schedule_c: JSON.stringify(courseData.schedule_c || [])
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
        const course = response.results[0].data;
        return {
          ...course,
          schedule_c: course.schedule_c ? JSON.parse(course.schedule_c) : []
        };
      }

      throw new Error('Failed to update course');
    } catch (error) {
      console.error('Error updating course:', error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.deleteRecord('course_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results[0]) {
        if (!response.results[0].success) {
          throw new Error(response.results[0].message || 'Failed to delete course');
        }
        return { success: true };
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting course:', error?.response?.data?.message || error);
      throw error;
    }
  }
};