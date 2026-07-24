import type { FullUserProfile, UpdateAvatarResponse } from "../types/user";

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

export async function fetchNextProject(userName: string) {
	const response = await fetch(`/api/users/${userName}/projects?view=current`);
	if (!response.ok) {
		throw new Error("Unable to load project");
	}
	return response.json();
}

export async function fetchRecommendedProjects(userName: string) {
	const response = await fetch(`/api/users/${userName}/projects?view=recommended`);
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
