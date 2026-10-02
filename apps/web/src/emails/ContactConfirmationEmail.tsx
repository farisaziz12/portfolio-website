import { Body, Container, Head, Heading, Html, Preview, Section, Text } from '@react-email/components'
import * as React from 'react'
import * as s from './styles'
import { EmailFooter, EmailHeader, EmailSignature } from './parts'

interface Props {
  name?: string
  /** Speaker profile → Reply time ("two working days"). */
  replyTime?: string
}

export function ContactConfirmationEmail({ name, replyTime = 'two working days' }: Props) {
  return (
    <Html>
      <Head />
      <Preview>{`Thanks · I'll reply within ${replyTime}`}</Preview>
      <Body style={s.body}>
        <Container style={s.container}>
          <EmailHeader label="Message received" />

          <Section style={s.content}>
            <Heading style={s.heading}>Thanks, got it</Heading>

            {name && <Text style={s.paragraph}>Hey {name},</Text>}

            <Text style={s.paragraph}>
              Your message just landed in my inbox. I read everything myself and I'll reply within
              <strong style={{ color: s.inkStrong }}> {replyTime}</strong>.
            </Text>

            <Text style={s.paragraph}>
              If it's time-sensitive, mention that in a follow-up. Otherwise, talk soon.
            </Text>

            <EmailSignature />
          </Section>

          <EmailFooter reason={"You received this because you sent a message via faziz-dev.com/contact."} />
        </Container>
      </Body>
    </Html>
  )
}

export default ContactConfirmationEmail
