import axios from "axios";

const FT_AUTH_URL = "https://api.intra.42.fr/oauth/token";

export async function getAccessToken() {
	const response = await axios.post(FT_AUTH_URL, {
		grant_type: "client_credentials",
		client_id: process.env.FT_ID,
		client_secret: process.env.FT_SECRET,
	})

	return response.data.access_token;
}

// export async function getAccessToken(code?: string) {
// 	const body: Record<string, string> = {
// 		client_id: process.env.FT_ID!,
// 		client_secret: process.env.FT_SECRET!,
// 	};

// 	if (code) {
// 		body.grant_type = "authorization_code";
// 		body.code = code;
// 		body.redirect_uri = process.env.FT_REDIRECT_URI!;
// 	} else {
// 		body.grant_type = "client_credentials";
// 	}

// 	const response = await axios.post(
// 		FT_AUTH_URL,
// 		new URLSearchParams(body),
// 		{
// 			headers: {
// 				"Content-Type": "application/x-www-form-urlencoded",
// 			},
// 		}
// 	);

// 	return response.data;
// }