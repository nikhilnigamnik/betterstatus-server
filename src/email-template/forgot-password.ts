export function forgotPasswordEmail(resetLink: string) {
  return `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #ffffff;
              color: #000000;
              padding: 32px;
              line-height: 1.6;
            }
            h1 {
              font-size: 24px;
              margin-bottom: 16px;
            }
            p {
              font-size: 16px;
              margin: 12px 0;
            }
            .button {
              display: inline-block;
              margin-top: 24px;
              padding: 12px 24px;
              background-color: #000000;
              color: #ffffff;
              text-decoration: none;
              font-weight: bold;
              border-radius: 0;
            }
            .footer {
              margin-top: 40px;
              font-size: 14px;
              color: #555555;
            }
          </style>
        </head>
        <body>
          <h1>Reset your password</h1>
          <p>Hello,</p>
          <p>We received a request to reset your password for your betterstatus account. If you made this request, click the button below to set a new password:</p>
          <a href="${resetLink}" class="button">Reset Password</a>
          <p>This link will expire shortly for your security.</p>
          <p>If you didn’t request a password reset, you can safely ignore this email.</p>
  
          <div class="footer">
            <p>Need help? Contact us at <a href="mailto:support@betterstatus.co" style="color: #000;">support@betterstatus.co</a></p>
            <p>Stay secure with betterstatus.</p>
          </div>
        </body>
      </html>
    `;
}
