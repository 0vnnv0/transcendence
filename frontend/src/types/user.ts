export interface Friendship {
  id: number;
  senderId: number;
  receiverId: number;
  status: 'PENDING' | 'ACCEPTED' | 'BLOCKED'; // je nachdem, was dein Backend nutzt
}

export interface ActiveProject {
  slug: string;
  status: 'searching_a_group' | 'in_progress';
  hasTeam: boolean;
}

export interface FullUserProfile {
  id: number; // gibts schon
  login: string; // gibts schon
  email: string; // gibts schon
  avatarUrl: string; // wird gebraucht
  firstName: string; // wird gebraucht
  lastName: string; // wird gebraucht
  intraUrl: string; // wird gebraucht
  currentRank: number; // gibts schon
  coalitionName: string; // gibts schon
  activeProjects: ActiveProject[];
  friendship?: Friendship | null;
  availability: {
	  workDaysPerWeek: number;
	  preferredDays: ("Mon" | "Tue" | "Wed" | "Thurs" | "Fri" | "Sat" | "Sun")[];
	  isRemote: boolean;
  }
}

// export interface UpdateAvatarResponse {
//   avatarUrl: string
// }

export interface UpdateProfilePayload {
	days: string[];
	location: string;
}

export interface UpdateProfileResponse {
	// shape this to match what modProfileInfo actually returns
	id: string;
	days: string[];
	location: string;
}

export interface PresignedPostResponse {
	url: string;
	fields: Record<string, string>;
}
