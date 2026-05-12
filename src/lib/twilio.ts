import Twilio from "twilio";

let client: ReturnType<typeof Twilio> | null = null;

export function getTwilioClient() {
  if (client) return client;

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    throw new Error("TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN must be set");
  }

  client = Twilio(accountSid, authToken);
  return client;
}

export function getTwilioPhone(): string {
  const phone = process.env.TWILIO_PHONE_NUMBER;
  if (!phone) {
    throw new Error("TWILIO_PHONE_NUMBER must be set");
  }
  return phone;
}
