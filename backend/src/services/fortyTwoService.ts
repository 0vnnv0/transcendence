import axios from 'axios';
import 'dotenv/config';
import { AuthTokenResponse, IntraUser } from '../types/fortyTwo.js';

const FT_API_URL = 'https://api.intra.42.fr/v2';

export class FortyTwoService {
  private clientId = process.env.FT_ID;
  private clientSecret = process.env.FT_SECRET;

  async getAccessToken(): Promise<string> {
    const response = await axios.post<AuthTokenResponse>('https://api.intra.42.fr/oauth/token', {
      grant_type: 'client_credentials',
      client_id: this.clientId,
      client_secret: this.clientSecret,
    });
    return response.data.access_token;
  }

  async getUserData(login: string, token: string): Promise<IntraUser> {
    const response = await axios.get<IntraUser>(`${FT_API_URL}/users/${login}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
	async getUserQuests(login: string, token: string) {
		const response = await axios.get(
			`${FT_API_URL}/users/${login}/quests_users`,
			{
				headers: { Authorization: `Bearer ${token}` }
			}
		); 
	return response.data;
}

	async getUserCoalitions(userId: number, token: string) {
		const response = await axios.get(
			`${FT_API_URL}/users/${userId}/coalitions`,
			{
				headers: { Authorization: `Bearer ${token}` }
			}
		);

		return response.data;
	}

	async getUserProjects(userId: number, token: string) {
		const response = await axios.get(
			`${FT_API_URL}/users/${userId}/projects_users`,
			{
				headers: { Authorization: `Bearer ${token}` }
			}
		); 
	return response.data;
	}

	async fetchBerlinUsers(token: string) {
	const response = await axios.get(
		`${FT_API_URL}/campus/51/users`,
		{
		headers: {
			Authorization: `Bearer ${token}`,
		},
		params: {
			per_page: 100,
		},
		}
	);

	return response.data;
	}
}
