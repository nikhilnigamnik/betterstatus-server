export function monthlyUpdateEmail(
  workspaceName: string,
  uptime: number,
  downtime: number,
  incidents: number,
  cronJobsTriggered: number,
  dashboardLink: string
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
            }
            h2 {
              font-size: 18px;
              margin-top: 24px;
            }
            p {
              font-size: 16px;
              margin: 12px 0;
            }
            .stat {
              font-size: 16px;
              margin: 8px 0;
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
          <h1>Monthly Update for <strong>${workspaceName}</strong></h1>
          <p>Here's how your workspace performed this month:</p>
  
          <div class="stats">
            <p class="stat">✅ Uptime: <strong>${uptime}%</strong></p>
            <p class="stat">❌ Downtime: <strong>${downtime} minutes</strong></p>
            <p class="stat">🚨 Incidents Reported: <strong>${incidents}</strong></p>
            <p class="stat">⏱️ Cron Jobs Triggered: <strong>${cronJobsTriggered}</strong></p>
          </div>
  
          <a href="${dashboardLink}" class="button">View Dashboard</a>
  
          <h2>Stay Ahead of Outages</h2>
          <p>Proactive monitoring and reliable alerts help your team stay focused and informed. Let us know how we can improve your experience.</p>
  
          <div class="footer">
            <p>Have questions? Reach out at <a href="mailto:support@betterstatus.co" style="color: #000;">support@betterstatus.co</a></p>
            <p>Keep building. We'll keep watching.</p>
          </div>
        </body>
      </html>
    `;
}
