import studentsData from '@/services/mockData/students.json';

let students = [...studentsData];
let nextId = Math.max(...students.map(s => s.Id), 0) + 1;

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const studentService = {
  async getAll() {
    await delay();
    return [...students];
  },

  async getById(id) {
    await delay();
    const student = students.find(s => s.Id === parseInt(id));
    if (!student) {
      throw new Error('Student not found');
    }
    return { ...student };
  },

  async create(studentData) {
    await delay();
    const newStudent = {
      ...studentData,
      Id: nextId++
    };
    students.push(newStudent);
    return { ...newStudent };
  },

  async update(id, studentData) {
    await delay();
// Validate ID parameter
    if (id === null || id === undefined || id === '') {
      throw new Error(`Invalid student ID provided: ${id}`);
    }
    
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      throw new Error(`Student ID must be a valid number. Received: ${id}`);
    }
    
    const index = students.findIndex(s => s?.Id === parsedId);
    if (index === -1) {
      const availableIds = students.map(s => s?.Id).filter(Boolean).join(', ');
      throw new Error(
        `Student not found. Requested ID: ${parsedId} (original: ${id}). ` +
        `Available student IDs: ${availableIds || 'none'}`
      );
    }

    students[index] = {
      ...students[index],
      Id: students[index].Id,
      ...studentData
    };
    return students[index];
  },

  remove: (id) => {
    // Validate ID parameter
    if (id === null || id === undefined || id === '') {
      throw new Error(`Invalid student ID provided: ${id}`);
    }
    
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      throw new Error(`Student ID must be a valid number. Received: ${id}`);
    }
    
    const index = students.findIndex(s => s?.Id === parsedId);
    if (index === -1) {
      const availableIds = students.map(s => s?.Id).filter(Boolean).join(', ');
      throw new Error(
        `Student not found for deletion. Requested ID: ${parsedId} (original: ${id}). ` +
        `Available student IDs: ${availableIds || 'none'}`
      );
    }
    students.splice(index, 1);
    return { success: true };
  }
};