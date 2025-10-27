import { getApperClient } from '@/services/apperClient';

export const assignmentService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.fetchRecords('assignment_c', {
        fields: [
          { field: { Name: 'Id' } },
          { field: { Name: 'title_c' } },
          { field: { Name: 'description_c' } },
          { field: { Name: 'due_date_c' } },
          { field: { Name: 'priority_c' } },
          { field: { Name: 'status_c' } },
          { field: { Name: 'grade_c' } },
          { field: { Name: 'weight_c' } },
          { field: { Name: 'completed_at_c' } },
          { field: { Name: 'course_id_c' }, referenceField: { field: { Name: 'Id' } } }
        ],
        orderBy: [{ fieldName: 'due_date_c', sorttype: 'ASC' }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(assignment => ({
        ...assignment,
        course_id_c: assignment.course_id_c?.Id || assignment.course_id_c
      }));
    } catch (error) {
      console.error('Error fetching assignments:', error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.getRecordById('assignment_c', parseInt(id), {
        fields: [
          { field: { Name: 'Id' } },
          { field: { Name: 'title_c' } },
          { field: { Name: 'description_c' } },
          { field: { Name: 'due_date_c' } },
          { field: { Name: 'priority_c' } },
          { field: { Name: 'status_c' } },
          { field: { Name: 'grade_c' } },
          { field: { Name: 'weight_c' } },
          { field: { Name: 'completed_at_c' } },
          { field: { Name: 'course_id_c' }, referenceField: { field: { Name: 'Id' } } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      const assignment = response.data;
      return {
        ...assignment,
        course_id_c: assignment.course_id_c?.Id || assignment.course_id_c
      };
    } catch (error) {
      console.error(`Error fetching assignment ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async getByCourseId(courseId) {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.fetchRecords('assignment_c', {
        fields: [
          { field: { Name: 'Id' } },
          { field: { Name: 'title_c' } },
          { field: { Name: 'description_c' } },
          { field: { Name: 'due_date_c' } },
          { field: { Name: 'priority_c' } },
          { field: { Name: 'status_c' } },
          { field: { Name: 'grade_c' } },
          { field: { Name: 'weight_c' } },
          { field: { Name: 'completed_at_c' } },
          { field: { Name: 'course_id_c' }, referenceField: { field: { Name: 'Id' } } }
        ],
        where: [
          {
            FieldName: 'course_id_c',
            Operator: 'EqualTo',
            Values: [parseInt(courseId)]
          }
        ],
        orderBy: [{ fieldName: 'due_date_c', sorttype: 'ASC' }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(assignment => ({
        ...assignment,
        course_id_c: assignment.course_id_c?.Id || assignment.course_id_c
      }));
    } catch (error) {
      console.error('Error fetching course assignments:', error?.response?.data?.message || error);
      return [];
    }
  },

  async create(assignmentData) {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.createRecord('assignment_c', {
        records: [{
          title_c: assignmentData.title_c,
          description_c: assignmentData.description_c || '',
          due_date_c: assignmentData.due_date_c,
          priority_c: assignmentData.priority_c || 'medium',
          status_c: assignmentData.status_c || 'pending',
          grade_c: assignmentData.grade_c ? parseFloat(assignmentData.grade_c) : null,
          weight_c: assignmentData.weight_c ? parseInt(assignmentData.weight_c) : 10,
          completed_at_c: null,
          course_id_c: parseInt(assignmentData.course_id_c)
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
        const assignment = response.results[0].data;
        return {
          ...assignment,
          course_id_c: assignment.course_id_c?.Id || assignment.course_id_c
        };
      }

      throw new Error('Failed to create assignment');
    } catch (error) {
      console.error('Error creating assignment:', error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, assignmentData) {
    try {
      const apperClient = getApperClient();
      
      const updateData = {
        Id: parseInt(id),
        title_c: assignmentData.title_c,
        description_c: assignmentData.description_c || '',
        due_date_c: assignmentData.due_date_c,
        priority_c: assignmentData.priority_c || 'medium',
        status_c: assignmentData.status_c || 'pending',
        grade_c: assignmentData.grade_c ? parseFloat(assignmentData.grade_c) : null,
        weight_c: assignmentData.weight_c ? parseInt(assignmentData.weight_c) : 10
      };

      if (assignmentData.course_id_c) {
        updateData.course_id_c = parseInt(assignmentData.course_id_c);
      }

      if (assignmentData.status_c === 'completed') {
        updateData.completed_at_c = new Date().toISOString();
      } else if (assignmentData.status_c === 'pending') {
        updateData.completed_at_c = null;
      }

      const response = await apperClient.updateRecord('assignment_c', {
        records: [updateData]
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
        const assignment = response.results[0].data;
        return {
          ...assignment,
          course_id_c: assignment.course_id_c?.Id || assignment.course_id_c
        };
      }

      throw new Error('Failed to update assignment');
    } catch (error) {
      console.error('Error updating assignment:', error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.deleteRecord('assignment_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results[0]) {
        if (!response.results[0].success) {
          throw new Error(response.results[0].message || 'Failed to delete assignment');
        }
        return { success: true };
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting assignment:', error?.response?.data?.message || error);
      throw error;
    }
  }
};