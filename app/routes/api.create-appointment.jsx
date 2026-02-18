// import {json} from '@shopify/remix-oxygen';

// export async function action({request}) {
//   if (request.method !== 'POST') {
//     return json({error: 'Method not allowed'}, {status: 405});
//   }

//   try {
//     const formData = await request.json();
//     const {name, email, date, time, comments} = formData;

//     // Validar datos
//     if (!name || !email || !date || !time) {
//       return json({error: 'Faltan campos requeridos'}, {status: 400});
//     }

//     // Crear evento en Google Calendar
//     const event = await createGoogleCalendarEvent({
//       name,
//       email,
//       date,
//       time,
//       comments,
//     });

//     return json({
//       success: true,
//       message: 'Cita agendada exitosamente',
//       eventId: event.id,
//     });
//   } catch (error) {
//     console.error('Error creating appointment:', error);
//     return json(
//       {error: 'Error al crear la cita'},
//       {status: 500}
//     );
//   }
// }

// async function createGoogleCalendarEvent({name, email, date, time, comments}) {
//   const GOOGLE_CALENDAR_API_KEY = process.env.GOOGLE_CALENDAR_API_KEY;
//   const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;

//   // Combinar fecha y hora
//   const [hours, minutes] = time.split(':');
//   const startDateTime = new Date(`${date}T${hours}:${minutes}:00`);
//   const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // +1 hora

//   const event = {
//     summary: `Cita con ${name}`,
//     description: `Cliente: ${name}\nEmail: ${email}\n\nComentarios: ${comments || 'N/A'}`,
//     start: {
//       dateTime: startDateTime.toISOString(),
//       timeZone: 'America/Mexico_City',
//     },
//     end: {
//       dateTime: endDateTime.toISOString(),
//       timeZone: 'America/Mexico_City',
//     },
//     attendees: [
//       {email: email},
//     ],
//     reminders: {
//       useDefault: false,
//       overrides: [
//         {method: 'email', minutes: 24 * 60}, // 1 día antes
//         {method: 'popup', minutes: 60}, // 1 hora antes
//       ],
//     },
//   };

//   const response = await fetch(
//     `https://www.googleapis.com/calendar/v3/calendars/${GOOGLE_CALENDAR_ID}/events?key=${GOOGLE_CALENDAR_API_KEY}`,
//     {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${GOOGLE_CALENDAR_API_KEY}`,
//       },
//       body: JSON.stringify(event),
//     }
//   );

//   if (!response.ok) {
//     throw new Error('Error al crear evento en Google Calendar');
//   }

//   return await response.json();
// }
