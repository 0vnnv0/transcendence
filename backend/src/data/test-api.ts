import axios from 'axios';

async function test() {
  const auth = await axios.post('https://api.intra.42.fr/oauth/token', {
    grant_type: 'client_credentials',
    client_id: 'u-s4t2ud-f6afffdd296d3dece25b422b688df6491835fed4d55eaca17df385b2e383acd7',
    client_secret: "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"
  });
  
  const user = await axios.get('https://api.intra.42.fr/v2/me', {
    headers: { Authorization: `Bearer ${auth.data.access_token}` }
  });

  console.log(JSON.stringify(user.data, null, 2)); // Zeigt dir alles schön formatiert
}
test();