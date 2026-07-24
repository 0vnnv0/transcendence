import type { ProjectData } from "./project";

export interface FullUserProfile {
  id: number; // gibts schon
  intraName: string; // gibts schon
  email: string; // gibts schon
  avatarUrl: string; // wird gebraucht
  firstName: string; // wird gebraucht
  lastName: string; // wird gebraucht
  intraUrl: string; // wird gebraucht
  currentRank: number; // gibts schon
  coalitionName: string; // gibts schon
}
