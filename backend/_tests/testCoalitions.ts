// //pbohme

// import dotenv from "dotenv";
// import path from "path";
// import axios from "axios";
// import { FortyTwoService } from "../src/services/fortyTwoService.js";

// dotenv.config({
//   path: path.resolve(process.cwd(), ".env"),
// });

// const FT_API_URL = "https://api.intra.42.fr/v2";

// async function fetchCoalitionUsers(coalitionId: number, token: string) {
//   const res = await axios.get(
//     `${FT_API_URL}/coalitions/${coalitionId}/coalitions_users`,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       params: {
//         page: 1,
//         per_page: 50,
//       },
//     }
//   );

//   return res.data;
// }

// async function test() {
//   const service = new FortyTwoService();
//   const token = await service.getAccessToken();

//   // 🔥 test 1 coalition (Arctos)
//   const arctos = await fetchCoalitionUsers(384, token);

//   console.log("\n=== RAW RESPONSE (Arctos) ===");
//   console.dir(arctos.slice(0, 3), { depth: null });

//   console.log("\n=== CHECK FIELDS ===");
//   console.log("first item keys:", Object.keys(arctos?.[0] || {}));

//   console.log("\n=== USER OBJECT (if nested) ===");
//   console.dir(arctos?.[0]?.user || arctos?.[0], { depth: null });
// }

// test().catch(console.error);