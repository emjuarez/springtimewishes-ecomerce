// setup-calendar-permissions.js
import 'dotenv/config';

async function setupCalendarPermissions() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
  const calendarId = process.env.GOOGLE_CALENDAR_ID;

  console.log('Configurando permisos para:', credentials.client_email);
  console.log('En el calendario:', calendarId);

  // Obtener access token
  const accessToken = await getGoogleAccessToken(credentials);

  // Agregar permisos de escritura a la Service Account
  const aclResponse = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/acl`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        role: 'writer',
        scope: {
          type: 'user',
          value: credentials.client_email,
        },
      }),
    }
  );

  if (aclResponse.ok) {
    console.log('✅ Permisos configurados correctamente');
    const result = await aclResponse.json();
    console.log('Resultado:', result);
  } else {
    const error = await aclResponse.json();
    console.error('❌ Error:', error);
  }
}

async function getGoogleAccessToken(credentials) {
  const now = Math.floor(Date.now() / 1000);
  const expiry = now + 3600;

  const header = {alg: 'RS256', typ: 'JWT'};
  const claimSet = {
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/calendar',
    aud: 'https://oauth2.googleapis.com/token',
    exp: expiry,
    iat: now,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedClaimSet = base64UrlEncode(JSON.stringify(claimSet));
  const signatureInput = `${encodedHeader}.${encodedClaimSet}`;
  const signature = await signJWT(signatureInput, credentials.private_key);
  const jwt = `${signatureInput}.${signature}`;

  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  const tokenData = await tokenResponse.json();
  return tokenData.access_token;
}

async function signJWT(data, privateKey) {
  const {webcrypto} = await import('crypto');
  const pemHeader = '-----BEGIN PRIVATE KEY-----';
  const pemFooter = '-----END PRIVATE KEY-----';
  const pemContents = privateKey
    .substring(pemHeader.length, privateKey.length - pemFooter.length - 1)
    .replace(/\s/g, '');

  const binaryDer = Buffer.from(pemContents, 'base64');

  const key = await webcrypto.subtle.importKey(
    'pkcs8',
    binaryDer,
    {name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256'},
    false,
    ['sign']
  );

  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const signature = await webcrypto.subtle.sign('RSASSA-PKCS1-v1_5', key, dataBuffer);

  return base64UrlEncode(signature);
}

function base64UrlEncode(data) {
  let base64;
  if (typeof data === 'string') {
    base64 = Buffer.from(data).toString('base64');
  } else if (data instanceof ArrayBuffer) {
    base64 = Buffer.from(data).toString('base64');
  } else {
    base64 = Buffer.from(data).toString('base64');
  }
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

setupCalendarPermissions();
