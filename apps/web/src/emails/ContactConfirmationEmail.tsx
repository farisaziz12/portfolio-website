import {
  Body, Container, Head, Heading, Html, Link, Preview,
  Section, Text, Hr,
} from '@react-email/components'
import * as React from 'react'
import * as s from './styles'

interface Props {
  name?: string
}

export function ContactConfirmationEmail({ name }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Thanks · I'll reply within two days</Preview>
      <Body style={s.body}>
        <Container style={s.container}>
          <Section style={s.terminalHeader}>
            <Text style={s.terminalDots}>● ● ●</Text>
            <Text style={s.terminalText}>$ ack contact-message</Text>
            <Text style={s.terminalOutput}>Message received. Reading through.</Text>
          </Section>

          <Section style={s.content}>
            <Heading style={s.heading}>Thanks, got it</Heading>

            {name && <Text style={s.paragraph}>Hey {name},</Text>}

            <Text style={s.paragraph}>
              Your message just landed in my inbox. I read everything myself and I'll reply within
              <strong style={{ color: s.inkStrong }}> two business days</strong>.
            </Text>

            <Text style={s.paragraph}>
              If it's time-sensitive, mention that in a follow-up. Otherwise, talk soon.
            </Text>

            <Hr style={s.divider} />
            <Text style={s.signature}>– Faris</Text>
            <Text style={s.signatureLink}>
              <Link href="https://faziz-dev.com" style={s.link}>faziz-dev.com</Link>
            </Text>
          </Section>

          <Section style={s.footer}>
            <Text style={s.footerText}>You received this because you sent a message via faziz-dev.com/contact.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default ContactConfirmationEmail
