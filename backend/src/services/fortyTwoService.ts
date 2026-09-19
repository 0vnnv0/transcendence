import 'dotenv/config';
import { fetchAllPages } from '../lib/fetchAllPages.js';
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