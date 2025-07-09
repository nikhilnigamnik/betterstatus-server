export function failedCronJobEmail(
  jobName: string,
  workspaceName: string,
  failedAt: string,
  errorMessage: string,
  jobLogsLink: string
) {
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
              color: #cc0000;
            }
            h2 {
              font-size: 18px;
              margin-top: 24px;
            }
            p {
              font-size: 16px;
              margin: 12px 0;
            }
            .details {
              background-color: #f8f8f8;
              padding: 16px;
              border: 1px solid #e0e0e0;
              margin-top: 16px;
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
          <h1>⚠️ Cron Job Failed</h1>
          <p>The following cron job in workspace <strong>${workspaceName}</strong> has failed:</p>
  
          <div class="details">
            <p><strong>Job Name:</strong> ${jobName}</p>
            <p><strong>Failed At:</strong> ${failedAt}</p>
            <p><strong>Error Message:</strong><br/> <code>${errorMessage}</code></p>
          </div>
  
          <a href="${jobLogsLink}" class="button">View Logs & Debug</a>
  
          <h2>Keep Things Running</h2>
          <p>Investigate the error and resolve the issue to ensure your systems continue operating smoothly.</p>
  
          <div class="footer">
            <p>Need help? Contact us at <a href="mailto:support@batchbird.co" style="color: #000;">support@batchbird.co</a></p>
            <p>BatchBird is watching your jobs — so you don’t have to.</p>
          </div>
        </body>
      </html>
    `;
}
