import assignmentsData from "@/services/mockData/assignments.json";

let assignments = [...assignmentsData];

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));

export const assignmentService = {
  async getAll() {
    await delay();
    return [...assignments];
  },

  async getById(id) {
    await delay();
    const assignment = assignments.find(a => a.Id === parseInt(id));
    return assignment ? { ...assignment } : null;
  },

  async getByCourseId(courseId) {
    await delay();
    return assignments.filter(a => a.courseId === courseId.toString()).map(a => ({ ...a }));
  },

  async create(assignmentData) {
    await delay();
    const newAssignment = {
      Id: Math.max(...assignments.map(a => a.Id), 0) + 1,
      ...assignmentData,
      createdAt: new Date().toISOString(),
      completedAt: null
    };
    assignments.push(newAssignment);
    return { ...newAssignment };
  },

  async update(id, assignmentData) {
    await delay();
    const index = assignments.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      const updatedAssignment = { ...assignments[index], ...assignmentData };
      if (assignmentData.status === "completed" && assignments[index].status !== "completed") {
        updatedAssignment.completedAt = new Date().toISOString();
      } else if (assignmentData.status === "pending") {
        updatedAssignment.completedAt = null;
      }
      assignments[index] = updatedAssignment;
      return { ...assignments[index] };
    }
    return null;
  },

  async delete(id) {
    await delay();
    const index = assignments.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      const deleted = assignments.splice(index, 1)[0];
      return { ...deleted };
    }
    return null;
  }
};