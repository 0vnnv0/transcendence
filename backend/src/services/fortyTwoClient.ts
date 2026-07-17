import axios from "axios";

export class FortyTwoClient {
	constructor(private token: string) {}

	private headers() {
		return {
			Authorization: `Bearer ${this.token}`,
		};
	}

	async get(url: string, params?: any) {
		return axios.get(url, {
			headers: this.headers(),
			params,
		});
	}
}