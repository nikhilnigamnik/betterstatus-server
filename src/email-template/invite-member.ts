export function inviteMemberEmail(workspaceName: string, link: string) {
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
        <h1>You're Invited to <strong>${workspaceName}</strong> on betterstatus</h1>
        <p>Hello there,</p>
        <p>You've been invited to collaborate in the <strong>${workspaceName}</strong> workspace on <strong>betterstatus</strong>.</p>
        <p>betterstatus helps teams manage uptime, monitor APIs, and handle incidents effortlessly.</p>
        <p>To accept the invitation and get started, simply click the button below:</p>
        <a href="${link}" class="button">Accept Invitation</a>
        <p>If you didn’t expect this invitation, feel free to ignore this message — no action will be taken without your confirmation.</p>

        <div class="footer">
          <p>Need help? Reach out to our team at <a href="mailto:support@betterstatus.co" style="color: #000;">support@betterstatus.co</a></p>
          <p>Stay on top of uptime. Build with confidence.</p>
        </div>
      </body>
    </html>
  `;
}
