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