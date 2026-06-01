import {
  Body, Container, Head, Heading, Html, Link, Preview,
  Section, Text, Hr,
} from '@react-email/components'
import * as React from 'react'
import * as s from './styles'

interface Props {
  name?: string
  event?: string
}

export function InviteConfirmationEmail({ name, event }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Thanks — I'll reply within two days</Preview>
      <Body style={s.body}>
        <Container style={s.container}>
          <Section style={s.terminalHeader}>
            <Text style={s.terminalDots}>● ● ●</Text>
            <Text style={s.terminalText}>$ ack speaking-invite</Text>
            <Text style={s.terminalOutput}>Invite received. Reviewing now.</Text>
          </Section>

          <Section style={s.content}>
            <Heading style={s.heading}>Thanks — got it</Heading>

            {name && <Text style={s.paragraph}>Hey {name},</Text>}

            <Text style={s.paragraph}>
              Your invitation{event ? ` for ${event}` : ''} just landed in my inbox.
              I'll review the details and reply within <strong style={{ color: '#f8fafc' }}>two business days</strong> — usually faster.
            </Text>

            <Text style={s.paragraph}>
              If it's a good fit, I'll come back with a yes (or a thoughtful no) plus a few practical questions
              about your audience and format so I can tailor the talk to your room.
            </Text>

            <Hr style={s.divider} />
            <Text style={s.signature}>— Faris</Text>
            <Text style={s.signatureLink}>
              <Link href="https://faziz-dev.com" style={s.link}>faziz-dev.com</Link>
            </Text>
          </Section>

          <Section style={s.footer}>
            <Text style={s.footerText}>You received this because you submitted a speaking invitation at faziz-dev.com.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default InviteConfirmationEmail
