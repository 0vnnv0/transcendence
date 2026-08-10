import type { ChatUser } from '../types/chat';
import type { FullUserProfile, UpdateAvatarResponse } from "../types/user";

const API_URL = '/api'; 

// export interface FullUserProfile {
//   id: number;
//   intraName: string;
//   email: string;
//   avatarUrl: string;
//   firstName: string;
//   lastName: string;
//   // Add any other backend properties here
// }

export const fetchUserProfile = async (login: string): Promise<FullUserProfile> => {
  const token = localStorage.getItem('token');
  
  // Explicitly prepend BASE_URL to target Fastify on port 3000 directly
  const response = await fetch(`${API_URL}/users/${login}`, {
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

export const fetchAllUsers = async (): Promise<ChatUser[]> => {
  const response = await fetch(`${API_URL}/users`);
  
  if (!response.ok) {
    throw new Error('Fehler beim Laden der User');
  }
  
  return response.json();
};

export const fetchUsersBySearch = async (searchQuery: string): Promise<ChatUser[]> => {
  // 1. Fetch auf den echten Endpunkt mit dem Query-Parameter "q"
  const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(searchQuery)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    // Wichtig, falls ihr mit Cookies/Sessions arbeitet:
    // credentials: 'include', 
  });
  
  if (!response.ok) {
    throw new Error('Error searching user');
  }
  
  const data = await response.json();
  console.log("Raw Backend Response für", searchQuery, ":", data);
  const results = Array.isArray(data) ? data : (data.users || []);
  
  const users: ChatUser[] = results
    .filter((item: any) => item.type === 'user')
    .map((item: any) => ({
      id: item.id,
      intraName: item.title, 
      avatarUrl: item.avatarUrl
    }));
    
  return users;
};

export async function fetchNextProject(userName: string) {
    const response = await fetch(`${API_URL}/users/${userName}/projects?view=current`);
    
    if (!response.ok) {
        throw new Error("Unable to load project");
    }
    
    return response.json();
}

export async function fetchRecommendedProjects(userName: string) {
	const response = await fetch(`${API_URL}/users/${userName}/projects?view=recommended`);
	if (!response.ok) {
		throw new Error("Unable to load project");
	}
	return response.json();
}

export const updateAvatar = async (
  login: string,
  file: File
): Promise<UpdateAvatarResponse> => {
  const token = localStorage.getItem('token');

  const formData = new FormData();
  formData.append('avatar', file);

  const response = await fetch(`/api/users/${login}/avatar`, {
    method: 'PATCH',
    headers: {
      // No Content-Type here — the browser sets multipart/form-data
      // with the correct boundary automatically when body is FormData.
      // Setting it manually will break the upload.
      'Authorization': `Bearer ${token || ''}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update avatar');
  }

  return response.json() as Promise<UpdateAvatarResponse>;
};
