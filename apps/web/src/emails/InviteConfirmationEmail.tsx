import { Body, Container, Head, Heading, Html, Link, Preview, Section, Text } from '@react-email/components'
import * as React from 'react'
import * as s from './styles'
import { EmailFooter, EmailHeader, EmailSignature } from './parts'

interface Props {
  name?: string
  event?: string
}

export function InviteConfirmationEmail({ name, event }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Thanks · I'll reply within two days</Preview>
      <Body style={s.body}>
        <Container style={s.container}>
          <EmailHeader label="Invite received" />

          <Section style={s.content}>
            <Heading style={s.heading}>Thanks, got it</Heading>

            {name && <Text style={s.paragraph}>Hey {name},</Text>}

            <Text style={s.paragraph}>
              Your invitation{event ? ` for ${event}` : ''} just landed in my inbox.
              I'll review the details and reply within <strong style={{ color: s.inkStrong }}>two business days</strong>, usually faster.
            </Text>

            <Text style={s.paragraph}>
              If it's a good fit, I'll come back with a yes (or a thoughtful no) plus a few practical questions
              about your audience and format so I can tailor the talk to your room.
            </Text>

            <Text style={s.paragraph}>
              In the meantime, my{' '}
              <Link href="https://faziz-dev.com/press-kit" style={s.link}>press kit</Link>{' '}
              has everything you need to announce the talk: copy-paste bios, high-res headshots,
              and the practical details.
            </Text>

            <EmailSignature />
          </Section>

          <EmailFooter reason={"You received this because you submitted a speaking invitation at faziz-dev.com."} />
        </Container>
      </Body>
    </Html>
  )
}

export default InviteConfirmationEmail
