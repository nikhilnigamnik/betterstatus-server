export function downtimeDetectedEmail(
  workspaceName: string,
  serviceName: string,
  url: string,
  statusCode: number,
  checkedFrom: string,
  detectedAt: string,
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
              color: #cc0000;
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
          <h1>🚨 Downtime Detected</h1>
          <p><strong>${serviceName}</strong> in <strong>${workspaceName}</strong> appears to be down.</p>
  
          <div class="details">
            <p><strong>🕒 Detected At:</strong> ${detectedAt}</p>
            <p><strong>🔗 URL:</strong> <a href="${url}" style="color:#000;">${url}</a></p>
            <p><strong>📍 Checked From:</strong> ${checkedFrom}</p>
            <p><strong>⚠️ Response Code:</strong> ${statusCode}</p>
          </div>
  
          <a href="${incidentLink}" class="button">View Incident Details</a>
  
          <p>We'll continue monitoring and alert you when the service is back online.</p>
  
          <div class="footer">
            <p>Need help? Contact us at <a href="mailto:support@batchbird.co" style="color: #000;">support@batchbird.co</a></p>
            <p>Stay resilient. We'll handle the rest.</p>
          </div>
        </body>
      </html>
    `;
}
