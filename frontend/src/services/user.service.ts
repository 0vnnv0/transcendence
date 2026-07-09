// const BASE_URL = 'http://10.11.5.3:3000';

export interface FullUserProfile {
  id: number;
  intraName: string;
  email: string;
  avatarUrl: string;
  firstName: string;
  lastName: string;
  // Add any other backend properties here
}

export const fetchUserProfile = async (login: string): Promise<FullUserProfile> => {
  const token = localStorage.getItem('token');
  
  // Explicitly prepend BASE_URL to target Fastify on port 3000 directly
  const response = await fetch(`/api/users/${login}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || ''}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch user profile');
  }

  return response.json() as Promise<FullUserProfile>;
};

export async function fetchUsers() {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
}
