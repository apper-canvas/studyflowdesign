import settingsData from "@/services/mockData/settings.json";

let settings = { ...settingsData };

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 100));

export const settingsService = {
  async get() {
    await delay();
    return { ...settings };
  },

  async update(settingsData) {
    await delay();
    settings = { ...settings, ...settingsData };
    return { ...settings };
  }
};