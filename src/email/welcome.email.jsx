import React from 'react';

import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

export function WelcomeEmail({ name }) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to BetterStatus</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto max-w-[600px] rounded border border-solid border-neutral-200 px-10 py-5">
            <Section className="mt-8">
              <Img src={'https://assets.betterstatus.co/icon.png'} height="32" alt="BetterStatus" />
            </Section>
            <Heading className="mx-0 my-7 p-0 text-xl font-semibold text-black">
              Welcome {name || 'to BetterStatus'}!
            </Heading>
            <Text className="mb-8 text-sm leading-6 text-gray-600">
              Thank you for signing up for BetterStatus! You can now start monitoring your services,
              creating status pages, and keeping your users informed about your system's health.
            </Text>

            <Hr />

            <Heading className="mx-0 my-6 p-0 text-lg font-semibold text-black">
              Getting started
            </Heading>

            <Text className="mb-4 text-sm leading-6 text-gray-600">
              <strong className="font-medium text-black">1. Add your first monitor</strong>:{' '}
              <Link
                href="https://betterstatus.co/docs/monitors"
                className="font-semibold text-black underline underline-offset-4"
              >
                Set up monitoring
              </Link>{' '}
              for your websites, APIs, and services to track their uptime and performance.
            </Text>

            <Text className="mb-4 text-sm leading-6 text-gray-600">
              <strong className="font-medium text-black">2. Create a status page</strong>: Build a{' '}
              <Link
                href="https://betterstatus.co/docs/status-pages"
                className="font-semibold text-black underline underline-offset-4"
              >
                public status page
              </Link>{' '}
              to keep your users informed about service incidents and maintenance.
            </Text>

            <Text className="mb-4 text-sm leading-6 text-gray-600">
              <strong className="font-medium text-black">3. Set up notifications</strong>: Configure{' '}
              <Link
                href="https://betterstatus.co/docs/notifications"
                className="font-semibold text-black underline underline-offset-4"
              >
                alert notifications
              </Link>{' '}
              to get notified immediately when your services go down.
            </Text>

            <Text className="mb-8 text-sm leading-6 text-gray-600">
              <strong className="font-medium text-black">4. Explore the API</strong>:{' '}
              <Link
                href="https://betterstatus.co/docs/api"
                className="font-semibold text-black underline underline-offset-4"
              >
                Check out our docs
              </Link>{' '}
              for programmatic monitoring and status page management.
            </Text>

            <Section className="mb-8">
              <Link
                className="rounded-lg bg-black px-6 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href="https://app.betterstatus.co"
              >
                Go to your dashboard
              </Link>
            </Section>

            <Hr />

            <Section>
              <Text className="text-xs text-gray-400 text-center">
                © {new Date().getFullYear()} BetterStatus Technologies. All rights reserved.
              </Text>

              <Text className="text-xs text-gray-400 text-center">
                You received this email because you signed up for BetterStatus.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
