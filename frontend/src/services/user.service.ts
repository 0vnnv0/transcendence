import type { ChatUser } from '../types/chat';
import type { FullUserProfile, PresignedPostResponse, UpdateProfilePayload, UpdateProfileResponse } from "../types/user";

const API_URL = '/api'; 


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

export const fetchUsersBySearch = async (searchQuery: string): Promise<FullUserProfile[]> => {
  const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(searchQuery)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },

  });
  
  if (!response.ok) {
    throw new Error('Error searching user');
  }
  
  const data = await response.json();
  console.log("Gefundene Suchergebnisse:", data);
  console.log("Raw Backend Response für", searchQuery, ":", data);
  const results = Array.isArray(data) ? data : (data.users || []);
  
  const users: FullUserProfile[] = results
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

export async function getUploadUrl(contentType: string): Promise<PresignedPostResponse> {
	const token = localStorage.getItem('token');

	const response = await fetch("/api/upload-url", {
		credentials: "include",
		method: 'POST',
    	headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ contentType }),
	});
	if (!response.ok) {
		throw new Error("Unable to get upload Url");
	}
	const data = await response.json()
	return data;
}

export async function uploadToS3(
	presignedPost: PresignedPostResponse,
	file: File
): Promise<void> {
	const formData = new FormData();

	Object.entries(presignedPost.fields).forEach(([key, value]) => {
		formData.append(key, value);
	});
	formData.append('file', file); // must be appended last

	const res = await fetch(presignedPost.url, {
		method: 'POST',
		body: formData,
	});

	if (!res.ok) {
		throw new Error(`S3 upload failed: ${res.status}`);
	}
}

export function getAvatarUrl(userId: string | number): string {
	const cfDomain = 'd3reft7l9ycc4f.cloudfront.net';
	return `https://${cfDomain}/avatars/${userId}/avatar.webp?t=${Date.now()}`;
}

export async function uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
	const presignedPost = await getUploadUrl(file.type);
	await uploadToS3(presignedPost, file);

	const avatarUrl = `${presignedPost.url}/${presignedPost.fields.key}`;
  	return { avatarUrl };
}

// export const updateAvatar = async (
//   login: string,
//   file: File
// ): Promise<UpdateAvatarResponse> => {
//   const token = localStorage.getItem('token');

//   const formData = new FormData();
//   formData.append('avatar', file);

//   const response = await fetch(`/api/users/${login}/upload-url`, {
//     method: 'PATCH',
//     headers: {
//       // No Content-Type here — the browser sets multipart/form-data
//       // with the correct boundary automatically when body is FormData.
//       // Setting it manually will break the upload.
//       'Authorization': `Bearer ${token || ''}`,
//     },
//     body: formData,
//   });

//   if (!response.ok) {
//     const errorData = await response.json().catch(() => ({}));
//     throw new Error(errorData.message || 'Failed to update avatar');
//   }

//   return response.json() as Promise<UpdateAvatarResponse>;
// };

export const fetchActiveUsersByProject = async (username: string, projectName: string): Promise<FullUserProfile[]> => {
  const response = await fetch(`/api/users/${username}/${projectName}/matches`);

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.error ?? 'Fehler beim Laden der aktiven User');
  }

  const data: { matches: FullUserProfile[] } = await response.json();
  return data.matches;
};

export const updateUserProfile = async (
	userId: number,
	data: UpdateProfilePayload
): Promise<UpdateProfileResponse> => {
	const token = localStorage.getItem('token');

	const body = {
		availability: {
			workDaysPerWeek: data.days.length,
			preferredDays: data.days,
			isRemote: data.location === 'remote',
		}
	}

	const response = await fetch(`/api/profile/${userId}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token || ''}`,
		},
		body: JSON.stringify(body),
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(errorData.message || 'Failed to update profile');
	}

	return response.json() as Promise<UpdateProfileResponse>;
};
