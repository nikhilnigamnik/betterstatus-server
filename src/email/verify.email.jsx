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

export function VerifyEmail({ token }) {
  return (
    <Html>
      <Head />
      <Preview>Verify your email address</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto max-w-[600px] rounded border border-solid border-neutral-200 px-10 py-5">
            <Section className="mt-8">
              <Img src="https://assets.betterstatus.co/icon.png" height="32" alt="BetterStatus" />
            </Section>
            <Heading className="mx-0 my-7 p-0 text-xl font-semibold text-black">
              Verify your email address
            </Heading>
            <Text className="mb-8 text-sm leading-6 text-gray-600">
              Thank you for signing up for BetterStatus! Please click the button below to verify
              your email address.
            </Text>
            <Section className="mb-8">
              <Link
                href={`http://localhost:8080/api/auth/verify?token=${token}`}
                className="rounded-lg bg-black px-6 py-3 text-center text-[12px] font-semibold text-white no-underline"
              >
                Verify your email address
              </Link>
            </Section>
            <Hr />
            <Section>
              <Text className="text-xs text-gray-400 text-center">
                © {new Date().getFullYear()} BetterStatus Technologies. All rights reserved.
              </Text>
              <Text className="text-xs text-gray-400 text-center">
                If you did not sign up for BetterStatus, please ignore this email.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
