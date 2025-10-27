import studySessionsData from '@/services/mockData/studySessions.json';

let sessions = [...studySessionsData];

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const studySessionService = {
  async getAll() {
    await delay();
    return sessions.map(session => ({ ...session }));
  },

  async create(sessionData) {
    await delay();

    // Validate required fields
    if (!sessionData.startTime || !sessionData.endTime) {
      throw new Error('Start time and end time are required');
    }

    // Calculate duration in seconds
    const start = new Date(sessionData.startTime);
    const end = new Date(sessionData.endTime);
    const duration = Math.floor((end - start) / 1000);

    if (duration <= 0) {
      throw new Error('Invalid session duration');
    }

    // Generate new ID
    const newId = sessions.length > 0 
      ? Math.max(...sessions.map(s => s.Id)) + 1 
      : 1;

    const newSession = {
      Id: newId,
      startTime: sessionData.startTime,
      endTime: sessionData.endTime,
      duration
    };

    sessions.push(newSession);
    return { ...newSession };
  }
};