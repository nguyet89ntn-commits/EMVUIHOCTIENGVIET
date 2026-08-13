export interface CustomQuestionData {
  id: string; // e.g. "game-alphabet-1" or "letter-l-a"
  promptTitle?: string;
  exampleWord?: string;
  audioText?: string;
  imageUrl?: string;
  correctAnswer?: string;
  options?: string[];
  blankWordDisplay?: string;
}

const STORAGE_KEY = "vuihoc_custom_questions_v1";

export const getCustomQuestion = (key: string): CustomQuestionData | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const store = JSON.parse(raw);
    return store[key] || null;
  } catch (e) {
    return null;
  }
};

export const saveCustomQuestion = (key: string, data: CustomQuestionData): boolean => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const store = raw ? JSON.parse(raw) : {};
    store[key] = { ...store[key], ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    return true;
  } catch (e) {
    console.error("Failed to save custom question:", e);
    return false;
  }
};

export const removeCustomQuestion = (key: string): boolean => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return true;
    const store = JSON.parse(raw);
    delete store[key];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    return true;
  } catch (e) {
    return false;
  }
};

export const hasCustomQuestion = (key: string): boolean => {
  return !!getCustomQuestion(key);
};
