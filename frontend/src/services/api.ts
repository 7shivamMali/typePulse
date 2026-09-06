const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
  : '/api';

export async function fetchWords(params: {
  count?: number;
  punctuation?: boolean;
  numbers?: boolean;
  mode?: 'words' | 'quote';
}) {
  const query = new URLSearchParams();
  if (params.count) query.set('count', params.count.toString());
  if (params.punctuation) query.set('punctuation', 'true');
  if (params.numbers) query.set('numbers', 'true');
  if (params.mode) query.set('mode', params.mode);

  const res = await fetch(`${API_BASE}/words?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch words');
  return res.json();
}

export async function fetchCodeSnippet(language?: string) {
  const query = new URLSearchParams();
  if (language) query.set('language', language);

  const res = await fetch(`${API_BASE}/code?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch code snippet');
  return res.json();
}

export async function fetchDrill(keys: string, count: number = 25) {
  const query = new URLSearchParams();
  query.set('keys', keys);
  query.set('count', count.toString());

  const res = await fetch(`${API_BASE}/drills/generate?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to generate drill');
  return res.json();
}

export async function submitTestResult(
  data: {
    wpm: number;
    raw_wpm: number;
    accuracy: number;
    consistency: number;
    mode: string;
    duration: number;
    characters?: string;
    keystrokes?: string;
  },
  token?: string | null
) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}/tests`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to submit test');
  }
  return res.json();
}

export async function fetchGhostPB(mode: string, token?: string | null) {
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}/ghost/pb?mode=${encodeURIComponent(mode)}`, {
    headers,
  });
  if (!res.ok) return { has_ghost: false };
  return res.json();
}

export async function fetchLeaderboard(mode: string = 'time 30') {
  const res = await fetch(`${API_BASE}/leaderboard?mode=${encodeURIComponent(mode)}`);
  if (!res.ok) return [];
  return res.json();
}

export async function registerUser(username: string, email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Registration failed');
  }
  return res.json();
}

export async function loginUser(username: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Invalid username or password');
  }
  return res.json();
}

export async function fetchMe(token: string) {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Session expired');
  return res.json();
}
