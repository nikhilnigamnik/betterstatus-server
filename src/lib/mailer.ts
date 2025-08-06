import { WelcomeEmail } from '@/email';
import { Resend } from 'resend';
import { render } from '@react-email/render';

const resend = new Resend('re_RbNcwkNX_3vgtf4mSD2981VUoRK6jgBEe');

export const sendEmail = async () => {
  const emailHtml = await render(WelcomeEmail({ name: 'Ritesh' }));

  return await resend.emails.send({
    from: `Resend <onboarding@resend.dev>`,
    to: 'nikhilnigamnik@gmail.com',
    subject: 'Onboarding Email Verification',
    html: emailHtml,
  });
};
