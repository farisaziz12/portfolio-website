import {
  Body, Container, Head, Heading, Html, Link, Preview,
  Section, Text, Hr,
} from '@react-email/components'
import * as React from 'react'
import * as s from './styles'

interface Props {
  name?: string
}

export function MentorshipConfirmationEmail({ name }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Thanks · I'll reply within two days</Preview>
      <Body style={s.body}>
        <Container style={s.container}>
          <Section style={s.terminalHeader}>
            <Text style={s.terminalDots}>● ● ●</Text>
            <Text style={s.terminalText}>$ ack mentorship-inquiry</Text>
            <Text style={s.terminalOutput}>Inquiry received. Reading through.</Text>
          </Section>

          <Section style={s.content}>
            <Heading style={s.heading}>Thanks, got it</Heading>

            {name && <Text style={s.paragraph}>Hey {name},</Text>}

            <Text style={s.paragraph}>
              Your mentorship inquiry just landed in my inbox. I'll read through it carefully and reply within
              <strong style={{ color: s.inkStrong }}> two business days</strong>.
            </Text>

            <Text style={s.paragraph}>
              If we're a fit, I'll come back with a proposed shape (cadence, focus, first session) and a short
              discovery call to confirm chemistry before either of us commits.
            </Text>

            <Text style={s.paragraph}>
              In the meantime, feel free to send anything else that'd help me understand where you are:
              code samples, a recent project, the specific situation that prompted this.
            </Text>

            <Hr style={s.divider} />
            <Text style={s.signature}>– Faris</Text>
            <Text style={s.signatureLink}>
              <Link href="https://faziz-dev.com" style={s.link}>faziz-dev.com</Link>
            </Text>
          </Section>

          <Section style={s.footer}>
            <Text style={s.footerText}>You received this because you submitted a mentorship inquiry at faziz-dev.com.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default MentorshipConfirmationEmail
