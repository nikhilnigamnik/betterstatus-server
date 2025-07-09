export function magicLinkEmail(link: string) {
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
          <h1>Sign in to <strong>BatchBird</strong></h1>
          <p>Hello,</p>
          <p>You requested a secure sign-in link for your account. Click below to continue:</p>
          <a href="${link}" class="button">Sign in</a>
          <p>This link will expire shortly for your security. If you didn’t request this, you can safely ignore the email.</p>
  
          <div class="footer">
            <p>Need help? Contact us at <a href="mailto:support@batchbird.co" style="color: #000;">support@batchbird.co</a></p>
            <p>Secure. Simple. Seamless.</p>
          </div>
        </body>
      </html>
    `;
}
