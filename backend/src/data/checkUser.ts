import axios from 'axios';

async function checkUser(login: string) {
  try {
    // 1. Authentifizierung
    const authResponse = await axios.post('https://api.intra.42.fr/oauth/token', {
      	grant_type: 'client_credentials',
        client_id: 'u-s4t2ud-f6afffdd296d3dece25b422b688df6491835fed4d55eaca17df385b2e383acd7',
    	client_secret: "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"
    });
    const token = authResponse.data.access_token;

    // 2. User-Daten abrufen
    const userResponse = await axios.get(`https://api.intra.42.fr/v2/users/${login}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // 3. Ausgabe des gesamten Objekts
    console.log("--- VOLLSTÄNDIGES USER OBJEKT ---");
    console.dir(userResponse.data, { depth: null }); // depth: null zeigt auch tief verschachtelte Objekte an
    
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Fehler:", error.response?.data || error.message);
    } else {
      console.error("Unerwarteter Fehler:", error);
    }
  }
}

checkUser('fjung');