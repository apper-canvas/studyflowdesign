import { getApperClient } from '@/services/apperClient';

export const studentService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.fetchRecords('student_c', {
        fields: [
          { field: { Name: 'Id' } },
          { field: { Name: 'name_c' } },
          { field: { Name: 'email_c' } },
          { field: { Name: 'phone_c' } },
          { field: { Name: 'major_c' } },
          { field: { Name: 'year_c' } },
          { field: { Name: 'gpa_c' } },
          { field: { Name: 'enrollment_date_c' } }
        ],
        orderBy: [{ fieldName: 'Id', sorttype: 'DESC' }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching students:', error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.getRecordById('student_c', parseInt(id), {
        fields: [
          { field: { Name: 'Id' } },
          { field: { Name: 'name_c' } },
          { field: { Name: 'email_c' } },
          { field: { Name: 'phone_c' } },
          { field: { Name: 'major_c' } },
          { field: { Name: 'year_c' } },
          { field: { Name: 'gpa_c' } },
          { field: { Name: 'enrollment_date_c' } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error('Student not found');
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching student ${id}:`, error?.response?.data?.message || error);
      throw new Error('Student not found');
    }
  },

  async create(studentData) {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.createRecord('student_c', {
        records: [{
          name_c: studentData.name_c,
          email_c: studentData.email_c,
          phone_c: studentData.phone_c || '',
          major_c: studentData.major_c || '',
          year_c: studentData.year_c || '',
          gpa_c: studentData.gpa_c ? parseFloat(studentData.gpa_c) : null,
          enrollment_date_c: studentData.enrollment_date_c || null
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

      throw new Error('Failed to create student');
    } catch (error) {
      console.error('Error creating student:', error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, studentData) {
    try {
      if (id === null || id === undefined || id === '') {
        throw new Error(`Invalid student ID provided: ${id}`);
      }
      
      const parsedId = parseInt(id);
      if (isNaN(parsedId)) {
        throw new Error(`Student ID must be a valid number. Received: ${id}`);
      }

      const apperClient = getApperClient();
      
      const response = await apperClient.updateRecord('student_c', {
        records: [{
          Id: parsedId,
          name_c: studentData.name_c,
          email_c: studentData.email_c,
          phone_c: studentData.phone_c || '',
          major_c: studentData.major_c || '',
          year_c: studentData.year_c || '',
          gpa_c: studentData.gpa_c ? parseFloat(studentData.gpa_c) : null,
          enrollment_date_c: studentData.enrollment_date_c || null
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

      throw new Error('Failed to update student');
    } catch (error) {
      console.error('Error updating student:', error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      if (id === null || id === undefined || id === '') {
        throw new Error(`Invalid student ID provided: ${id}`);
      }
      
      const parsedId = parseInt(id);
      if (isNaN(parsedId)) {
        throw new Error(`Student ID must be a valid number. Received: ${id}`);
      }

      const apperClient = getApperClient();
      
      const response = await apperClient.deleteRecord('student_c', {
        RecordIds: [parsedId]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results[0]) {
        if (!response.results[0].success) {
          throw new Error(response.results[0].message || 'Failed to delete student');
        }
        return { success: true };
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting student:', error?.response?.data?.message || error);
      throw error;
    }
  }
};