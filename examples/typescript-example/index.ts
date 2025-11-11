import { RespondIO } from '../..';

function randomString(length: number = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateRandomEmail(): string {
  const user = `user_${randomString(6)}`;
  const domain = `example${Math.floor(Math.random() * 1000)}.com`;
  return `${user}@${domain}`;
}

function generateRandomName(): string {
  const names = [
    'Alex',
    'Sam',
    'Jordan',
    'Taylor',
    'Casey',
    'Morgan',
    'Jamie',
    'Riley',
    'Drew',
    'Cameron',
  ];
  return names[Math.floor(Math.random() * names.length)];
}

function generateRandomPhone(): string {
  // Very simple pseudo-random international format, e.g. +1 5551234567
  const countryCodes = ['+1', '+44', '+61', '+65', '+60', '+94'];
  const cc = countryCodes[Math.floor(Math.random() * countryCodes.length)];
  const number = Math.floor(100000000 + Math.random() * 900000000); // 9-digit number
  return `${cc}${number}`;
}

async function main() {
  const client = new RespondIO({
    apiToken: process.env.RESPONDIO_API_TOKEN || 'your_api_token_here',
    baseUrl: process.env.RESPONDIO_API_BASE_URL || 'https://api.respond.io/v2',
  });

  try {
    const email = generateRandomEmail();

    const newContact = await client.contacts.create(`email:${email}`, {
      firstName: generateRandomName(),
      lastName: generateRandomName(),
      phone: generateRandomPhone(),
      language: 'en',
      countryCode: 'US',
    });

    console.log('Created contact response:: ', newContact);

    // Get a contact
    const contact = await client.contacts.get(`email:${email}`);
    console.log('New Contact ::', contact.firstName, contact.email);
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

if (require.main === module) {
  main();
}

export { main };
