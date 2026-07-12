// //pbohme

// import dotenv from "dotenv";
// import axios from "axios";
// import { FortyTwoService } from "../src/services/fortyTwoService.js";


// const FT_API_URL = "https://api.intra.42.fr/v2";

// export async function testUserId() {
// 	const service = new FortyTwoService();
// 	const token = await service.getAccessToken();

// 	const res = await axios.get(
// 	`${FT_API_URL}/users/204425`,
// 	{
// 		headers: {
// 		Authorization: `Bearer ${token}`,
// 		},
// 		params: {
// 			page: 1,
// 			per_page: 100,
// 		},
// 	}
// 	);

// 	console.dir(res.data, { depth: null });
// }

// testUserId();