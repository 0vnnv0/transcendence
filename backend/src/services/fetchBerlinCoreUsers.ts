import axios from "axios";

import { fetchAllPages } from "../lib/fetchAllPages.js";
import { FortyTwoService } from "./fortyTwoService.js";

const FT_API_URL = "https://api.intra.42.fr/v2";

export async function fetchBerlinCoreUsers() {
	const service = new FortyTwoService();
	const token = await service.getAccessToken();

	return fetchAllPages(async (page) => {
		const res = await axios.get(
			`${FT_API_URL}/quests/37/quests_users`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
				params: {
					page,
					per_page: 100,
					"filter[validated]": false,
					"filter[campus_id]": 51,
				},
			}
		);
		return res.data;
	});
}