import { Resend } from 'resend';
import { WelcomeEmail } from '@/email';

const resend = new Resend('re_RbNcwkNX_3vgtf4mSD2981VUoRK6jgBEe');

export const sendEmail = async () => {
  return await resend.emails.send({
    from: `Nikhil from BetterStatus <onboarding@resend.dev>`,
    to: 'nikhilnigamnik@gmail.com',
    subject: 'Welcome to BetterStatus!',
    react: WelcomeEmail({ name: 'Nikks' }),
  });
};
