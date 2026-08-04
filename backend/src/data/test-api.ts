//noch gebraucht??

// import axios from 'axios';

// async function test() {
//   const auth = await axios.post('https://api.intra.42.fr/oauth/token', {
//     grant_type: 'client_credentials',
//     client_id: 'u-s4t2ud-d87b293135eedb7d232b27ba34be87490916f134a3a1152471ae97a3cda805ad',
//     client_secret: "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"
//   });
  
//   const user = await axios.get('https://api.intra.42.fr/v2/me', {
//     headers: { Authorization: `Bearer ${auth.data.access_token}` }
//   });

//   console.log(JSON.stringify(user.data, null, 2)); // Zeigt dir alles schön formatiert
// }
// test();