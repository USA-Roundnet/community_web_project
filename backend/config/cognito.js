const { Issuer, generators } = require('openid-client');

let client;

async function initializeClient() {
  const issuer = await Issuer.discover('https://cognito-idp.us-east-1.amazonaws.com/us-east-1_eJLyGLOSF');
  
  client = new issuer.Client({
    client_id: process.env.COGNITO_CLIENT_ID,
    client_secret: process.env.COGNITO_CLIENT_SECRET,
    redirect_uris: ['https://localhost:5173/HomePage'],
    response_types: ['code']
  });
}

module.exports = { initializeClient, client };