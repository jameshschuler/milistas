import client from 'twilio';


export const twilioInstance = client( process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN );
export const from = process.env.FROM;
