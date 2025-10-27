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
    const index = students.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Student not found');
    }
    students[index] = {
      ...students[index],
      ...studentData,
      Id: students[index].Id
    };
    return { ...students[index] };
  },

  async delete(id) {
    await delay();
    const index = students.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Student not found');
    }
    students.splice(index, 1);
    return { success: true };
  }
};