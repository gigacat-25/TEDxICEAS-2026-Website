import { google } from 'googleapis';

const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

export async function sendConfirmationEmail(to: string, userName: string, ticketId: string, ticketType: string, price: number) {
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    console.log('Gmail credentials are not configured. Skipping confirmation email.');
    return null;
  }

  try {
    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

    const subject = 'TEDxICEAS 2026 - Ticket Confirmation';
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    
    const messageParts = [
      `From: TEDxICEAS <thejaswinps@gmail.com>`,
      `To: ${to}`,
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      `Subject: ${utf8Subject}`,
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
    
    const message = messageParts.join('\n');

    // The body needs to be base64url encoded.
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const res = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    return res.data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
