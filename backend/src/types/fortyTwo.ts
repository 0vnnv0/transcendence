export interface IntraUser {
  id: number;
  login: string;
  email: string;
  image: {
    link: string;
  };
  cursus_users: {
    level: number;
    cursus: {
      name: string;
    };
  }[];
}

export interface AuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export type FortyTwoProjectSession = {
  id: number;
  solo: boolean;
  max_people: number | null;
  team_behaviour: string;
};

export type FortyTwoCursus = {
  id: number;
  name: string;
  slug: string;
};

export type FortyTwoProject = {
  id: number;
  name: string;
  slug: string;
  difficulty: number | null;
  description?: string;

  exam: boolean;

  cursus: FortyTwoCursus[];

  project_sessions: FortyTwoProjectSession[];
};
