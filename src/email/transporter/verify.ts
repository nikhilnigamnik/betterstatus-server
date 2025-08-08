import { transporter } from '@/lib/transporter';
import { render } from '@react-email/components';
import { env } from '@/utils';
import { VerifyEmail } from '../verify.email';

export async function sendVerifyEmail(to: string, token: string) {
  const emailHtml = await render(VerifyEmail({ token }));

  const mailOptions = {
    from: `Nikhil from BetterStatus <${env.emailUser}>`,
    to,
    subject: 'Verify your email address',
    html: emailHtml,
  };

  const emailSent = await transporter.sendMail(mailOptions);

  return emailSent;
}
