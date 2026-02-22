import axios from 'axios';

const API_BASE = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: async (username: string, password: string) => {
    const response = await api.post('/api/login/', { username, password });
    const { access, user } = response.data;
    localStorage.setItem('token', access);
    localStorage.setItem('user', JSON.stringify(user));
    return response.data;
  },

  register: async (username: string, password: string) => {
    const response = await api.post('/api/register/', { username, password });
    const { access, user } = response.data;
    localStorage.setItem('token', access);
    localStorage.setItem('user', JSON.stringify(user));
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken: () => localStorage.getItem('token'),

  getUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};

export const sessions = {
  create: async (title: string) => {
    const response = await api.post('/api/session/create/', { title });
    return response.data;
  },

  list: async () => {
    const response = await api.get('/api/session/list/');
    return response.data;
  },

  getReport: async (sessionId: number) => {
    const response = await api.get(`/api/session/report/${sessionId}/`);
    return response.data;
  },
};

export const paragraphs = {
  add: async (sessionId: number, content: string) => {
    const response = await api.post('/api/paragraph/add/', { session_id: sessionId, content });
    return response.data;
  },

  enhance: async (paragraphId: number) => {
    const response = await api.post('/api/paragraph/enhance/', { paragraph_id: paragraphId });
    return response.data;
  },
};

export interface AnalysisResult {
  drift_score: number;
  consistency_score: number;
  emotion: string;
  readability_before: number;
  readability_after: number;
  enhanced_text: string;
  explanation: string;
}

export interface Session {
  id: number;
  title: string;
  created_at: string;
  paragraphs: Paragraph[];
}

export interface Paragraph {
  id: number;
  content: string;
  drift_score: number | null;
  created_at: string;
}

export interface Enhancement {
  id: number;
  original_text: string;
  enhanced_text: string;
  explanation: string;
  readability_before: number;
  readability_after: number;
  emotion: string;
  consistency_score: number;
  created_at: string;
}

export interface ConsistencyIssue {
  type: string;
  message: string;
  suggestion?: string;
  severity: 'high' | 'medium' | 'low';
}

export interface Change {
  id?: string;
  original: string;
  modified: string;
  type: string;
  category?: string;
  confidence?: number;
  explanation?: string;
}

export const generate = {
  story: async (prompt: string, maxLength: number = 500) => {
    const response = await api.post('/api/generate/story/', { prompt, max_length: maxLength });
    return response.data;
  },

  continue: async (story: string, maxLength: number = 400) => {
    const response = await api.post('/api/generate/continue/', { story, max_length: maxLength });
    return response.data;
  },

  ending: async (story: string, maxLength: number = 300) => {
    const response = await api.post('/api/generate/ending/', { story, max_length: maxLength });
    return response.data;
  },

  script: async (sceneDescription: string, maxLength: number = 400) => {
    const response = await api.post('/api/generate/script/', { scene_description: sceneDescription, max_length: maxLength });
    return response.data;
  },

  expand: async (idea: string, maxLength: number = 500) => {
    const response = await api.post('/api/generate/expand/', { idea, max_length: maxLength });
    return response.data;
  },

  transformTone: async (text: string, tone: string) => {
    const response = await api.post('/api/transform/tone/', { text, tone });
    return response.data;
  },

  complete: async (text: string, maxLength: number = 400) => {
    const response = await api.post('/api/generate/complete/', { text, max_length: maxLength });
    return response.data;
  },

  custom: async (story: string, instruction: string, maxLength: number = 1000) => {
    const response = await api.post('/api/generate/custom/', { story, instruction, max_length: maxLength });
    return response.data;
  },
};



export interface EnhancementResult {
  text: string;
}

export interface StyleResult {
  text: string;
}

export interface ConsistencyResult {
  score: number;
}

export const analyzeText = async (text: string, sessionId?: number) => {
  const response = await api.post('/api/analyze', { text, session_id: sessionId });
  return response.data;
};

export const enhanceText = async (text: string, sessionId?: number) => {
  const response = await api.post('/api/enhance', { text, session_id: sessionId });
  return response.data;
};

export const applyStyle = async (text: string, style: string) => {
  const response = await api.post('/api/style', { text, style });
  return response.data;
};

export const checkConsistency = async (text: string, sessionId?: number) => {
  const response = await api.post('/api/consistency', { text, session_id: sessionId });
  return response.data;
};

export const saveDocument = async (text: string, sessionId: number) => {
  const response = await api.post('/api/document/save', { text, session_id: sessionId });
  return response.data;
};

export default api;
