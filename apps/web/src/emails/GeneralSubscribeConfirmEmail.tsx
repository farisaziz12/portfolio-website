import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Button,
  Hr,
} from '@react-email/components'
import * as React from 'react'

interface Props {
  name?: string
}

export function GeneralSubscribeConfirmEmail({ name }: Props) {
  return (
    <Html>
      <Head />
      <Preview>You're on the list 🎉</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={terminalHeader}>
            <Text style={terminalDots}>● ● ●</Text>
            <Text style={terminalText}>$ echo "Welcome aboard"</Text>
            <Text style={terminalOutput}>Subscription confirmed.</Text>
          </Section>

          <Section style={content}>
            <Heading style={heading}>You're on the list 🎉</Heading>

            {name && (
              <Text style={paragraph}>Hey {name},</Text>
            )}

            <Text style={paragraph}>
              Thanks for subscribing! I'll reach out when I'm speaking at a conference near you.
            </Text>

            <Text style={paragraph}>
              <strong style={{ color: '#f8fafc' }}>What to expect:</strong>
            </Text>
            <Text style={paragraph}>
              Occasional updates about upcoming workshops, conference talks, and new content. No spam — ever.
            </Text>

            <Section style={buttonSection}>
              <Button style={primaryButton} href="https://faziz-dev.com/workshops">
                Browse Workshops
              </Button>
            </Section>

            <Hr style={divider} />

            <Text style={signature}>— Faris Aziz</Text>
            <Text style={signatureLink}>
              <Link href="https://faziz-dev.com" style={link}>faziz-dev.com</Link>
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              You received this because you subscribed at faziz-dev.com.
            </Text>
            <Text style={footerText}>
              <Link href="{{{unsubscribe_url}}}" style={link}>Unsubscribe</Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default GeneralSubscribeConfirmEmail

const body = {
  backgroundColor: '#0a0a0a',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  margin: '0',
  padding: '0',
}

const container = {
  maxWidth: '600px',
  margin: '0 auto',
  padding: '40px 20px',
}

const terminalHeader = {
  backgroundColor: '#1e293b',
  borderRadius: '12px',
  padding: '20px 24px',
  marginBottom: '32px',
  border: '1px solid #334155',
}

const terminalDots = {
  color: '#94a3b8',
  fontSize: '10px',
  margin: '0 0 12px 0',
  letterSpacing: '4px',
}

const terminalText = {
  fontFamily: '"JetBrains Mono", monospace',
  color: '#22d3ee',
  fontSize: '14px',
  margin: '0 0 4px 0',
}

const terminalOutput = {
  fontFamily: '"JetBrains Mono", monospace',
  color: '#94a3b8',
  fontSize: '13px',
  margin: '0',
}

const content = {
  padding: '0 4px',
}

const heading = {
  color: '#f8fafc',
  fontSize: '28px',
  fontWeight: '700' as const,
  margin: '0 0 24px 0',
  fontFamily: '"Space Grotesk", Inter, sans-serif',
}

const paragraph = {
  color: '#cbd5e1',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 16px 0',
}

const buttonSection = {
  textAlign: 'center' as const,
  margin: '24px 0',
}

const primaryButton = {
  backgroundColor: '#2563eb',
  color: '#ffffff',
  padding: '14px 32px',
  borderRadius: '8px',
  fontSize: '16px',
  fontWeight: '600' as const,
  textDecoration: 'none',
  display: 'inline-block',
}

const divider = {
  borderColor: '#1e293b',
  margin: '32px 0',
}

const signature = {
  color: '#f8fafc',
  fontSize: '15px',
  fontWeight: '500' as const,
  margin: '0 0 4px 0',
}

const signatureLink = {
  margin: '0',
}

const link = {
  color: '#22d3ee',
  textDecoration: 'underline',
}

const footer = {
  padding: '24px 0 0 0',
}

const footerText = {
  color: '#64748b',
  fontSize: '12px',
  lineHeight: '1.5',
  margin: '0 0 8px 0',
}
