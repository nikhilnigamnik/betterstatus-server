export function newFeatureAnnouncementEmail(
  featureName: string,
  shortDescription: string,
  keyBenefits: string[],
  ctaLink: string
) {
  const benefitsList = keyBenefits.map((b) => `<li>${b}</li>`).join("");

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
            ul {
              margin-top: 8px;
              margin-left: 20px;
            }
            li {
              font-size: 16px;
              margin-bottom: 6px;
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
          <h1>🚀 Introducing: ${featureName}</h1>
          <p>${shortDescription}</p>
  
          <h2>What you can do with it:</h2>
          <ul>
            ${benefitsList}
          </ul>
  
          <a href="${ctaLink}" class="button">Try ${featureName} Now</a>
  
          <div class="footer">
            <p>Questions or feedback? Reach out at <a href="mailto:support@betterstatus.co" style="color:#000;">support@betterstatus.co</a></p>
            <p>Thanks for building with betterstatus 🚀</p>
          </div>
        </body>
      </html>
    `;
}
