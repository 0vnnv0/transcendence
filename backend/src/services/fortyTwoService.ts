import axios from 'axios';
import 'dotenv/config';
import { AuthTokenResponse, IntraUser } from '../types/fortyTwo.js';
import { fetchAllPages } from '../lib/fetchAllPages.js';
import { apiQueue } from '../lib/apiQueue.js';
import { FortyTwoClient } from './fortyTwoClient.js';

const FT_API_URL = 'https://api.intra.42.fr/v2';

export class FortyTwoService {
	constructor(private client: FortyTwoClient) {}

	async fetchCoalitionUsers(coalitionId: number) {
		return fetchAllPages(async (page) => {
			const res = await this.client.get(
				`${FT_API_URL}/coalitions/${coalitionId}/coalitions_users`,
				{
					page,
					per_page: 100,
				}
			);
			return res.data;
		});
	}

	async fetchQuestUsers(
		questId: number, 
		options?: { validated?: boolean; campusId?: number }
	) {
		const validated = options?.validated ?? true;
		const campusId = options?.campusId ?? 51;
		return fetchAllPages(async (page) => {
			const res = await this.client.get(
				`${FT_API_URL}/quests/${questId}/quests_users`,
				{
					page,
					per_page: 100,
					"filter[validated]": validated,
					"filter[campus_id]": campusId,
				}
			);
			return res.data;
		});
	}

	async fetchProjectUsers(projectId: number) {
		return fetchAllPages(async (page) => {
			const res = await this.client.get(
				`${FT_API_URL}/projects/${projectId}/projects_users`,
				{
					page,
					per_page: 100,
					"filter[campus]": 51,
				}
			);
			return res.data;
		});
	}
}

// export class FortyTwoService {
//   private clientId = process.env.FT_ID;
//   private clientSecret = process.env.FT_SECRET;

//   async getAccessToken(): Promise<string> {
//     const response = await axios.post<AuthTokenResponse>('https://api.intra.42.fr/oauth/token', {
//       grant_type: 'client_credentials',
//       client_id: this.clientId,
//       client_secret: this.clientSecret,
//     });
//     return response.data.access_token;
//   }

//   async getUserData(login: string, token: string): Promise<IntraUser> {
//     const response = await axios.get<IntraUser>(`${FT_API_URL}/users/${login}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return response.data;
//   }
// 	async getUserQuests(login: string, token: string) {
// 		const response = await axios.get(
// 			`${FT_API_URL}/users/${login}/quests_users`,
// 			{
// 				headers: { Authorization: `Bearer ${token}` }
// 			}
// 		); 
// 	return response.data;
// }

// 	async getUserCoalitions(userId: number, token: string) {
// 		const response = await axios.get(
// 			`${FT_API_URL}/users/${userId}/coalitions`,
// 			{
// 				headers: { Authorization: `Bearer ${token}` }
// 			}
// 		);

// 		return response.data;
// 	}

// 	async getUserProjects(userId: number, token: string) {
// 		const response = await axios.get(
// 			`${FT_API_URL}/users/${userId}/projects_users`,
// 			{
// 				headers: { Authorization: `Bearer ${token}` }
// 			}
// 		); 
// 	return response.data;
// 	}


// 	async fetchCoalitionUsers(coalitionId: number, token: string) {
// 		return apiQueue.add(async () => {
// 			return fetchAllPages(async (page) => {
// 					const response = await axios.get(
// 						`${FT_API_URL}/coalitions/${coalitionId}/coalitions_users`,
// 						{
// 							headers: {
// 								Authorization: `Bearer ${token}`,
// 							},
// 							params: {
// 								page,
// 								per_page: 100,
// 							},
// 						},
// 					);
// 					return response.data;
// 				});
// 		});
// 	}

// 	async fetchQuestUsers(questId: number, token: string) {
// 		return apiQueue.add(async () => {
// 			return fetchAllPages(async (page) => {
// 				const response = await axios.get(
// 					`${FT_API_URL}/quests/${questId}/quests_users`,
// 					{
// 						headers: {
// 							Authorization: `Bearer ${token}`,
// 						},
// 						params: {
// 							page,
// 							per_page: 100,
// 							"filter[validated]": true,
// 							"filter[campus_id]": 51,
// 						},
// 					},
// 				);
// 				return response.data;
// 			});
// 		});
// 	}

// 	async fetchProjectUsers(
// 		projectId: number,
// 		token: string,
// 	) {
// 		return apiQueue.add(async () => {
// 			return fetchAllPages(async (page) => {
// 				const response = await axios.get(
// 					`${FT_API_URL}/projects/${projectId}/projects_users`,
// 					{
// 						headers: {
// 							Authorization: `Bearer ${token}`,
// 						},
// 						params: {
// 							page,
// 							per_page: 100,
// 							"filter[campus]": 51,
// 						},
// 					}
// 				);

// 				return response.data;
// 			});
// 		});
// 	}
// }
