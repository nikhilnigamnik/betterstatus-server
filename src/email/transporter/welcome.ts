import { transporter } from '@/lib/transporter';
import { WelcomeEmail } from '../welcome.email';
import { render } from '@react-email/components';
import { env } from '@/utils';

export async function sendWelcomeEmail(to: string, name: string) {
  const emailHtml = await render(WelcomeEmail({ name }));

  const mailOptions = {
    from: `Nikhil from BetterStatus <${env.emailUser}>`,
    to,
    subject: 'Welcome to Betterstatus!',
    html: emailHtml,
  };

  const emailSent = await transporter.sendMail(mailOptions);

  return emailSent;
}
