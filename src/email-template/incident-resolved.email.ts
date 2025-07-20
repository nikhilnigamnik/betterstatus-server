export function incidentResolvedEmail(
  workspaceName: string,
  incidentTitle: string,
  resolvedAt: string,
  downtimeDuration: string,
  resolutionNote: string,
  incidentLink: string
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
              color: #008000;
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
          <h1>✅ Incident Resolved</h1>
          <p>The incident <strong>"${incidentTitle}"</strong> in <strong>${workspaceName}</strong> has been resolved.</p>
  
          <div class="details">
            <p><strong>🕒 Resolved At:</strong> ${resolvedAt}</p>
            <p><strong>⏳ Downtime Duration:</strong> ${downtimeDuration}</p>
            <p><strong>📝 Resolution Note:</strong><br/> ${resolutionNote}</p>
          </div>
  
          <a href="${incidentLink}" class="button">View Incident Timeline</a>
  
          <p>Thank you for your patience. We'll continue monitoring to ensure everything remains stable.</p>
  
          <div class="footer">
            <p>Need help? Contact us at <a href="mailto:support@betterstatus.co" style="color: #000;">support@betterstatus.co</a></p>
            <p>betterstatus — reliable alerts, developer-first tools.</p>
          </div>
        </body>
      </html>
    `;
}
