// //pbohme

// import dotenv from "dotenv";
// import axios from "axios";
// import { FortyTwoService } from "../src/services/fortyTwoService.js";
// import { getAccessToken } from "../src/services/token.js";
// import { FortyTwoClient } from "../src/services/fortyTwoClient.js";


// const FT_API_URL = "https://api.intra.42.fr/v2";

// export async function testQuestUser() {
// 	const token = await getAccessToken();
// 	const client = new FortyTwoClient(token);
// 	const service = new FortyTwoService(client);

// 	const res = await service.fetchQuestUsers(37, { validated: false });

// 	console.dir(res, { depth: null });
// }

// testQuestUser();