// Da dein Fastify-Backend auf Port 3000 läuft
const BASE_URL = 'http://localhost:3000';

export async function loginUser(credentials) {
  const response = await fetch(`/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Login failed');
  }
  return response.json(); 
}

export async function signUpUser(credentials) {
  const response = await fetch('/api/signUp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Login failed');
  }

  return response.json(); 
}

export async function authorizeUser() {
  const token = localStorage.getItem('token');
  const response = await fetch(`/api/auth/42`, { 
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Authorization failed');
  }

  return response.json();
}
