import { type FullUserProfile } from "../types/user";

const DEFAULT_DAYS = ["Mon", "Tue", "Wed", "Thurs", "Fri"];

function normalizeProfile(profile: any): FullUserProfile {
  const preferredDays = profile?.availability?.preferredDays?.length
    ? profile.availability.preferredDays
    : DEFAULT_DAYS;

  return {
    ...profile,
    availability: {
      ...profile?.availability,
      preferredDays,
      workDaysPerWeek: profile?.availability?.workDaysPerWeek ?? preferredDays.length,
      isRemote: profile?.availability?.isRemote ?? false,
    },
  };
}

export default normalizeProfile;
