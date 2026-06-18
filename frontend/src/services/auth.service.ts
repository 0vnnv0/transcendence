// --- Interfaces ---

// Passe diese Felder an das an, was dein Backend tatsächlich erwartet!
export interface LoginCredentials {
  email?: string;
  password?: string;
  // Fallback, falls du noch andere Felder mitschickst:
  [key: string]: unknown; 
}

export interface SignUpCredentials {
  email?: string;
  password?: string;
  username?: string;
  [key: string]: unknown;
}

// --- Service Funktionen ---

// Hinweis: BASE_URL ist definiert, wird in deinen fetch-Aufrufen aber nicht genutzt.
const BASE_URL = 'http://localhost:3000';

export async function loginUser(credentials: LoginCredentials): Promise<any> {
  const response = await fetch(`/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    // Wir sagen TS hier, dass errorData ein Objekt mit einer optionalen 'message' ist
    const errorData = (await response.json()) as { message?: string };
    throw new Error(errorData.message || 'Login failed');
  }
  return response.json(); 
}

export async function signUpUser(credentials: SignUpCredentials): Promise<any> {
  const response = await fetch('/api/signUp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = (await response.json()) as { message?: string };
    // Tippfehler korrigiert: Hier stand vorher 'Login failed'
    throw new Error(errorData.message || 'SignUp failed');
  }

  return response.json(); 
}

export async function authorizeUser(): Promise<any> {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`/api/auth/42`, { 
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      // Fallback für den Fall, dass token 'null' ist
      'Authorization': `Bearer ${token || ''}`
    }
  });

  if (!response.ok) {
    const errorData = (await response.json()) as { message?: string };
    throw new Error(errorData.message || 'Authorization failed');
  }

  return response.json();
}