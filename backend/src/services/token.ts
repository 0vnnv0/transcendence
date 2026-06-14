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