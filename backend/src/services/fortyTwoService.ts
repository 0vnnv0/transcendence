import axios from 'axios';
import { AuthTokenResponse, IntraUser } from '../types/fortyTwo';

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
}
