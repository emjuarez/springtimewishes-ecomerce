async function sendConfirmationEmail({
  name,
  email,
  date,
  time,
  comments,
  eventLink,
  env,
}) {
  try {
    const appointmentDate = new Date(`${date}T${time}:00`);

    const formattedDate = appointmentDate.toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const formattedTime = appointmentDate.toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
    });

  const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #000;
              color: #fff;
              padding: 30px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background-color: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 8px 8px;
            }
            .details {
              background-color: #fff;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
              border-left: 4px solid #000;
            }
            .detail-row {
              margin: 10px 0;
            }
            .label {
              font-weight: bold;
              color: #000;
            }
            .button {
              display: inline-block;
              background-color: #000;
              color: #fff;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #666;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>¡Cita Confirmada!</h1>
          </div>
          
          <div class="content">
            <p>Hola ${name},</p>
            
            <p>Tu cita ha sido agendada exitosamente. Aquí están los detalles:</p>
            
            <div class="details">
              <div class="detail-row">
                <span class="label">📅 Fecha:</span> ${formattedDate}
              </div>
              <div class="detail-row">
                <span class="label">🕐 Hora:</span> ${formattedTime}
              </div>
              ${comments ? `
              <div class="detail-row">
                <span class="label">💬 Comentarios:</span> ${comments}
              </div>
              ` : ''}
            </div>
            
            <p>Puedes agregar esta cita a tu calendario haciendo clic en el siguiente botón:</p>
            
            <center>
              <a href="${eventLink}" class="button">Agregar a Google Calendar</a>
            </center>
            
            <p>Si necesitas cancelar o reprogramar tu cita, por favor contáctanos con anticipación.</p>
            
            <p>¡Esperamos verte pronto!</p>
            
            <p>Saludos,<br><strong>SpringTime Wishes</strong></p>
          </div>
          
          <div class="footer">
            <p>Este es un email de confirmación automático. Por favor no respondas a este mensaje.</p>
          </div>
        </body>
      </html>
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'SpringTime Wishes <onboarding@resend.dev>',
        to: [email],
        subject: `Confirmación de cita - ${formattedDate}`,
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Resend error:', errorData);
      throw new Error('Error al enviar email');
    }

    const data = await response.json();
    console.log('Email enviado:', data);

    return data;
  } catch (error) {
    console.error('Error in sendConfirmationEmail:', error);
    return null; // no bloquea la cita
  }
}

export async function action({request, context}) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({error: 'Method not allowed'}), {
      status: 405,
      headers: {'Content-Type': 'application/json'},
    });
  }

  try {
    const formData = await request.json();
    const {name, email, date, time, comments} = formData;

    // ... validaciones (mantén las que ya tienes)

    // Crear evento en Google Calendar
    const event = await createGoogleCalendarEvent({
      name,
      email,
      date,
      time,
      comments,
      env: context.env,
    });

    // Enviar email de confirmación
    await sendConfirmationEmail({
      name,
      email,
      date,
      time,
      comments,
      eventLink: event.htmlLink,
      env: context.env,
    });

    return new Response(JSON.stringify({
      success: true,
      message: 'Cita agendada exitosamente. Recibirás un email de confirmación en breve.',
      eventId: event.id,
      eventLink: event.htmlLink,
    }), {
      status: 200,
      headers: {'Content-Type': 'application/json'},
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return new Response(JSON.stringify({
      error: 'Error al crear la cita: ' + error.message
    }), {
      status: 500,
      headers: {'Content-Type': 'application/json'},
    });
  }
}


async function createGoogleCalendarEvent({name, email, date, time, comments, env}) {
  try {
    // Obtener credenciales desde variables de entorno
    const credentials = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_KEY);
    const calendarId = env.GOOGLE_CALENDAR_ID;

    // Obtener access token de Google
    const accessToken = await getGoogleAccessToken(credentials);

    // Combinar fecha y hora
    const [hours, minutes] = time.split(':');
    const startDateTime = new Date(`${date}T${hours}:${minutes}:00`);
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // +1 hora

    // Crear evento
    const event = {
      summary: `Cita con ${name}`,
      description: `Cliente: ${name}\nEmail: ${email}\n\nComentarios: ${comments || 'Sin comentarios'}`,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'America/Mexico_City',
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'America/Mexico_City',
      },
      // attendees eliminado - no se enviarán invitaciones automáticas
      reminders: {
        useDefault: false,
        overrides: [
          {method: 'email', minutes: 1440}, // 1 día antes
          {method: 'email', minutes: 60}, // 1 hora antes
        ],
      },
    };

    // Insertar evento usando Google Calendar API REST (sin sendUpdates)
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Google Calendar API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Google Calendar API Error:', error);
    throw new Error(`Error al crear evento: ${error.message}`);
  }
}

async function getGoogleAccessToken(credentials) {
  // Crear JWT para autenticación
  const now = Math.floor(Date.now() / 1000);
  const expiry = now + 3600; // 1 hora

  const header = {
    alg: 'RS256',
    typ: 'JWT',
  };

  const claimSet = {
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/calendar',
    aud: 'https://oauth2.googleapis.com/token',
    exp: expiry,
    iat: now,
  };

  // Codificar header y claim set
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedClaimSet = base64UrlEncode(JSON.stringify(claimSet));
  const signatureInput = `${encodedHeader}.${encodedClaimSet}`;

  // Firmar con la private key
  const signature = await signJWT(signatureInput, credentials.private_key);
  const jwt = `${signatureInput}.${signature}`;

  // Intercambiar JWT por access token
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();
    throw new Error(`Failed to get access token: ${errorText}`);
  }

  const tokenData = await tokenResponse.json();
  return tokenData.access_token;
}

async function signJWT(data, privateKey) {
  // Importar la clave privada
  const pemHeader = '-----BEGIN PRIVATE KEY-----';
  const pemFooter = '-----END PRIVATE KEY-----';
  const pemContents = privateKey.substring(
    pemHeader.length,
    privateKey.length - pemFooter.length - 1
  ).replace(/\s/g, '');

  const binaryDer = base64ToArrayBuffer(pemContents);

  const key = await crypto.subtle.importKey(
    'pkcs8',
    binaryDer,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256',
    },
    false,
    ['sign']
  );

  // Firmar los datos
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    key,
    dataBuffer
  );

  return base64UrlEncode(signature);
}

function base64UrlEncode(data) {
  let base64;
  
  if (typeof data === 'string') {
    base64 = btoa(data);
  } else if (data instanceof ArrayBuffer) {
    const bytes = new Uint8Array(data);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    base64 = btoa(binary);
  } else {
    base64 = btoa(data);
  }

  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function base64ToArrayBuffer(base64) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}
