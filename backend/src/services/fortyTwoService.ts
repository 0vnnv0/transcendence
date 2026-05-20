import axios from 'axios';
import "dotenv/config";
import { AuthTokenResponse, IntraUser } from '../types/fortyTwo';

// const FT_API_URL = 'https://api.intra.42.fr/v2';

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
 
  
// }

export class FortyTwoService {
  private baseUrl = "https://api.intra.42.fr/v2";
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

  async getProjectBySlug(token: string, slug: string) {
    const res = await axios.get(`${this.baseUrl}/projects`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        "page[size]": 100,
        filter: {
          slug: slug,
        },
      },
    });

    return res.data?.[0];
  }
}

//   async getAllProjects(token: string) {
//   let page = 1;
//   let allProjects: any[] = [];

//   while (true) {
//     const response = await axios.get(
//       "https://api.intra.42.fr/v2/cursus/21/projects?filter[exam]=false",
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         params: {
//           "page[size]": 100,
//           "page[number]": page,
//         },
//       }
//     );

//     const projects = response.data;

//     if (projects.length === 0) {
//       break;
//     }

//     allProjects.push(...projects);

//     console.log(`Loaded page ${page} (${projects.length} projects)`);

//     page++;
//   }

//   return allProjects;
// }

// async getCoreProjects(token: string) {
//   let page = 1;
//   let allProjects: any[] = [];

//   while (true) {
//     const response = await axios.get(
//       "https://api.intra.42.fr/v2/cursus/21/projects",
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         params: {
//           "page[size]": 100,
//           "page[number]": page,
//         },
//       }
//     );

//     const projects = response.data;

//     if (projects.length === 0) break;

//     allProjects.push(...projects);

//     console.log(`Loaded page ${page}`);

//     page++;
//   }

//   return allProjects;
// }
