 
// TypeScript Interfaces & Types
 

export interface AuthCredentials {
  email?: string;
  password?: string;
  [key: string]: any; // Allows for any additional OAuth / 42 specific properties if passed
}

export interface LoginResponse {
  access_token: string;
}

export interface TokenResponse {
  token: string;
}

interface ApiErrorResponse {
  message?: string;
}

 
// API Service Functions
 

export async function loginUser(credentials: AuthCredentials): Promise<LoginResponse> {
  const response = await fetch(`/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData: ApiErrorResponse = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Login failed');
  }
  
  return response.json() as Promise<LoginResponse>; 
}

export async function signUpUser(credentials: AuthCredentials): Promise<TokenResponse> {
  const response = await fetch(`/api/signUp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData: ApiErrorResponse = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Registration failed');
  }

  return response.json() as Promise<TokenResponse>; 
}

export async function authorizeUser(): Promise<TokenResponse> {
  const token: string | null = localStorage.getItem('token');
  
  const response = await fetch(`/api/auth/42`, { 
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || ''}`
    }
  });

  if (!response.ok) {
    const errorData: ApiErrorResponse = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Authorization failed');
  }

  return response.json() as Promise<TokenResponse>;
}
