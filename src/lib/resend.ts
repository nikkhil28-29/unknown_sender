// src/lib/resend.ts
import { Resend } from 'resend';

console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY);  // Debug log to check if the environment variable is loaded
console.log('MONGODB_URI:', process.env.MONGODB_URI);  // Debug log to check if the environment variable is loaded


if (!process.env.RESEND_API_KEY) {
  throw new Error('Missing API key. Set RESEND_API_KEY in your environment variables.');
}

export const resend = new Resend(process.env.RESEND_API_KEY);
