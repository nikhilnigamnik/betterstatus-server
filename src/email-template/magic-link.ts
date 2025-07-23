export function magicLinkEmail(link: string) {
  return `
      <html>
  <head>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
          Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        background-color: #f9f9f9;
        color: #1a1a1a;
        padding: 40px 16px;
        line-height: 1.6;
      }

      .email-container {
        background-color: #ffffff;
        max-width: 600px;
        margin: auto;
        padding: 40px 24px;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
      }

      img.logo {
        width: 40px;
        height: 40px;
      }

      h1 {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 12px;
        color: #111111;
      }

      p {
        font-size: 16px;
        margin: 12px 0;
        color: #333333;
      }

      a.button {
        display: inline-block;
        margin-top: 24px;
        padding: 8px 20px;
        background-color: #000000;
        color: #ffffff !important;
        text-decoration: none;
        font-weight: 600;
        border-radius: 6px;
        font-size: 14px;
      }

      .footer {
        margin-top: 48px;
        font-size: 14px;
        color: #888888;
        border-top: 1px solid #eaeaea;
        padding-top: 24px;
      }

      .footer a {
        color: #000000;
        text-decoration: underline;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <img src="https://assets.betterstatus.co/icon.png" alt="BetterStatus Logo" class="logo" />

      <h1>BetterStatus</h1>

      <p>Hello,</p>
      <p>
        You requested a secure sign-in link for your account. Click the button
        below to continue:
      </p>

      <a href="${link}" class="button">Sign in</a>

      <p style="margin-top: 24px;">
        This link will expire shortly for your security. If you didn’t request this, you can safely ignore this email.
      </p>

      <div class="footer">
        <p>
          Need help? Contact us at
          <a href="mailto:support@betterstatus.co">support@betterstatus.co</a>
        </p>
      </div>
    </div>
  </body>
</html>

    `;
}
