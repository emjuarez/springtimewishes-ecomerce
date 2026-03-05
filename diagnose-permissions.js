import 'dotenv/config';

async function diagnose() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
  const calendarId = process.env.GOOGLE_CALENDAR_ID;

  console.log('🔍 Diagnóstico de permisos\n');
  console.log('Service Account:', credentials.client_email);
  console.log('Calendar ID:', calendarId);
  console.log('\n--- Obteniendo Access Token ---');

  try {
    const accessToken = await getGoogleAccessToken(credentials);
    console.log('✅ Access Token obtenido\n');

    // Verificar acceso al calendario
    console.log('--- Verificando acceso al calendario ---');
    const calResponse = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}`,
      {headers: {'Authorization': `Bearer ${accessToken}`}}
    );

    if (calResponse.ok) {
      const cal = await calResponse.json();
      console.log('✅ Acceso al calendario OK');
      console.log('Nombre:', cal.summary);
    } else {
      console.log('❌ No se puede acceder al calendario');
      console.log('Error:', await calResponse.text());
    }

    // Verificar permisos ACL
    console.log('\n--- Verificando permisos ACL ---');
    const aclResponse = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/acl`,
      {headers: {'Authorization': `Bearer ${accessToken}`}}
    );

    if (aclResponse.ok) {
      const acl = await aclResponse.json();
      console.log('✅ Permisos ACL:');
      acl.items.forEach(item => {
        if (item.scope.value === credentials.client_email) {
          console.log(`  → ${item.scope.value}: ${item.role}`);
        }
      });
    } else {
      console.log('❌ No se pueden leer los permisos ACL');
      console.log('Error:', await aclResponse.text());
    }

    // Intentar crear un evento de prueba
    console.log('\n--- Intentando crear evento de prueba ---');
    const testEvent = {
      summary: 'Test - Borrar',
      start: {
        dateTime: new Date(Date.now() + 86400000).toISOString(),
        timeZone: 'America/Mexico_City',
      },
      end: {
        dateTime: new Date(Date.now() + 90000000).toISOString(),
        timeZone: 'America/Mexico_City',
      },
    };

    const eventResponse = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testEvent),
      }
    );

    if (eventResponse.ok) {
      const event = await eventResponse.json();
      console.log('✅ Evento de prueba creado exitosamente');
      console.log('ID:', event.id);
      console.log('\n🎉 ¡Todo funciona correctamente!');
    } else {
      const error = await eventResponse.json();
      console.log('❌ No se puede crear eventos');
      console.log('Error:', error.error.message);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function getGoogleAccessToken(credentials) {
  const now = Math.floor(Date.now() / 1000);
  const {webcrypto} = await import('crypto');
  
  const header = {alg: 'RS256', typ: 'JWT'};
  const claimSet = {
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/calendar',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedClaimSet = Buffer.from(JSON.stringify(claimSet)).toString('base64url');
  const signatureInput = `${encodedHeader}.${encodedClaimSet}`;

  const pemContents = credentials.private_key
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s/g, '');

  const key = await webcrypto.subtle.importKey(
    'pkcs8',
    Buffer.from(pemContents, 'base64'),
    {name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256'},
    false,
    ['sign']
  );

  const signature = await webcrypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    key,
    Buffer.from(signatureInput)
  );

  const encodedSignature = Buffer.from(signature).toString('base64url');
  const jwt = `${signatureInput}.${encodedSignature}`;

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

diagnose();
