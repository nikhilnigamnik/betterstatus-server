import React from 'react';

import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { styles } from './style';

const baseUrl = 'https://betterstatus.co';

export const WelcomeEmail = ({ name }) => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>Welcome to BetterStatus</Preview>
      <Container style={container}>
        <Section style={box}>
          <Img src={`https://assets.betterstatus.co/icon.png`} width="50" alt="BetterStatus" />
          <Hr style={styles.hr} />
          <Text style={styles.paragraph}>Hello {name},</Text>
          <Text style={styles.paragraph}>
            Welcome to BetterStatus! We're excited to have you on board and can't wait to help you
            monitor your services.
          </Text>
          <Button style={styles.button} href="https://betterstatus.co">
            Get Started
          </Button>
          <Hr style={styles.hr} />
          <Text style={styles.paragraph}>
            If you need any help, feel free to reach out at{' '}
            <Link style={styles.anchor} href="mailto:support@betterstatus.co">
              support@betterstatus.co
            </Link>
            .
          </Text>
          <Text style={styles.paragraph}>
            Best regards,
            <br />
            The BetterStatus Team
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '"Bricolage Grotesque", -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
};

const box = {
  padding: '0 48px',
};
