export function WelcomeEmail({ name }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to BetterStatus</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #ffffff;
            color: #000000;
            line-height: 1.6;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 32px 16px;
            text-align: center;
        }
        
        .logo {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            margin: 0 auto 24px;
            display: block;
        }
        
        .heading {
            font-size: 20px;
            font-weight: 600;
            color: #171717;
            margin: 0 0 16px 0;
        }
        
        .description {
            font-size: 16px;
            color: #737373;
            margin: 0 0 24px 0;
            max-width: 400px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .button-container {
            margin-bottom: 32px;
        }
        
        .button {
            display: inline-block;
            padding: 12px 32px;
            text-decoration: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            margin: 0 8px;
        }
        
        .button-primary {
            background-color: #f97316;
            color: #ffffff;
        }
        
        .button-secondary {
            background-color: #f5f5f5;
            color: #262626;
        }
        
        .help-text {
            font-size: 14px;
            color: #737373;
            margin: 0 0 8px 0;
        }
        
        .email-link {
            color: #2563eb;
            text-decoration: none;
            font-size: 14px;
            margin-bottom: 16px;
            display: inline-block;
        }
        
        .footer-text {
            font-size: 12px;
            color: #a3a3a3;
            margin: 4px 0;
        }
        
        @media only screen and (max-width: 600px) {
            .container {
                padding: 24px 16px;
            }
            
            .button {
                display: block;
                margin: 8px auto;
                max-width: 200px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <img 
            src="https://assets.betterstatus.co/better-status-logo.webp" 
            alt="BetterStatus Logo" 
            class="logo"
            width="80" 
            height="80"
        />
        
        <h1 class="heading">Welcome to BetterStatus, ${name}!</h1>
        
        <p class="description">
            Thank you for joining BetterStatus! We're excited to help you create beautiful
            status pages and monitor your services with professional-grade uptime tracking.
        </p>
        
        <div class="button-container">
            <a href="https://app.betterstatus.com/dashboard" class="button button-primary">
                Go to Dashboard
            </a>
            <a href="https://docs.betterstatus.com/getting-started" class="button button-secondary">
                View Documentation
            </a>
        </div>
        
        <p class="help-text">Need help? We're here for you!</p>
        <a href="mailto:hello@betterstatus.com" class="email-link">
            hello@betterstatus.com
        </a>
        
        <p class="footer-text">© 2024 BetterStatus Technologies. All rights reserved.</p>
        <p class="footer-text">You received this email because you signed up for BetterStatus.</p>
    </div>
</body>
</html>
  `;
}
