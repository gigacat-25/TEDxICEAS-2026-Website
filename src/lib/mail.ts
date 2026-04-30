const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;
const SENDER_EMAIL = 'thejaswinps@gmail.com';

/**
 * Gets a fresh access token using the refresh token.
 */
async function getAccessToken() {
  const url = 'https://oauth2.googleapis.com/token';
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  });

  const data = await res.json() as any;
  if (!res.ok) {
    throw new Error(`Failed to refresh access token: ${data.error_description || data.error}`);
  }
  return data.access_token;
}

/**
 * Helper to encode string to base64url format
 */
function base64urlEncode(str: string): string {
  // Edge runtime supports btoa and TextEncoder
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  let binary = '';
  const bytes = new Uint8Array(data);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function sendConfirmationEmail(to: string, userName: string, ticketId: string, ticketType: string, price: number) {
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    console.log('Gmail credentials are not configured. Skipping confirmation email.');
    return null;
  }

  try {
    const accessToken = await getAccessToken();

    const subject = 'TEDxICEAS 2026 - Ticket Confirmation';
    
    // Construct MIME message
    const messageParts = [
      `From: TEDxICEAS <${SENDER_EMAIL}>`,
      `To: ${to}`,
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      `Subject: ${subject}`,
      '',
      '<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">',
      '  <h2 style="color: #eb0028;">TEDxICEAS 2026</h2>',
      `  <p>Hi <strong>${userName}</strong>,</p>`,
      '  <p>Thank you for booking your ticket for TEDxICEAS 2026! Your booking is confirmed.</p>',
      '  <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">',
      `    <p style="margin: 5px 0;"><strong>Ticket ID:</strong> ${ticketId}</p>`,
      `    <p style="margin: 5px 0;"><strong>Pass Type:</strong> ${ticketType.toUpperCase()}</p>`,
      `    <p style="margin: 5px 0;"><strong>Price:</strong> ₹${price}</p>`,
      '    <p style="margin: 5px 0;"><strong>Status:</strong> Confirmed</p>',
      '  </div>',
      '  <p>We look forward to seeing you at the event!</p>',
      '  <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">',
      '  <p style="font-size: 12px; color: #888;">This is an automated message. Please do not reply to this email.</p>',
      '</div>',
    ];
    
    const message = messageParts.join('\r\n');
    const encodedMessage = base64urlEncode(message);

    const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        raw: encodedMessage,
      }),
    });

    const data = await res.json() as any;
    if (!res.ok) {
      throw new Error(`Gmail API error: ${data.error?.message || JSON.stringify(data.error)}`);
    }

    return data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
