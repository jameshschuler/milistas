import client from 'twilio';
require( 'dotenv' ).config();

export const twilioInstance = client( process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN );
export const from = process.env.FROM;

export async function send ( to: string, message: string ) {
    await twilioInstance.messages.create( {
        body: message,
        from: from,
        to: `+1${to}`
    } );

    // TODO: maybe save this for reference at some point
    // console.log( messageInstance );
}
