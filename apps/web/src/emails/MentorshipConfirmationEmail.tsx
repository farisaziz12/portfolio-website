import { Body, Container, Head, Heading, Html, Preview, Section, Text } from '@react-email/components'
import * as React from 'react'
import * as s from './styles'
import { EmailFooter, EmailHeader, EmailSignature } from './parts'

interface Props {
  name?: string
  /** Speaker profile → Reply time ("two working days"). */
  replyTime?: string
}

export function MentorshipConfirmationEmail({ name, replyTime = 'two working days' }: Props) {
  return (
    <Html>
      <Head />
      <Preview>{`Thanks · I'll reply within ${replyTime}`}</Preview>
      <Body style={s.body}>
        <Container style={s.container}>
          <EmailHeader label="Inquiry received" />

          <Section style={s.content}>
            <Heading style={s.heading}>Thanks, got it</Heading>

            {name && <Text style={s.paragraph}>Hey {name},</Text>}

            <Text style={s.paragraph}>
              Your mentorship inquiry just landed in my inbox. I'll read it and reply within
              <strong style={{ color: s.inkStrong }}> {replyTime}</strong>.
            </Text>

            <Text style={s.paragraph}>
              If we're a fit, I'll come back with a plan for how often we meet, what we focus on and the first session.
              I'll also suggest a short discovery call to check we get on before either of us commits.
            </Text>

            <Text style={s.paragraph}>
              Until then, send anything else that'd help me understand where you are:
              code samples, a recent project, the specific situation that prompted this.
            </Text>

            <EmailSignature />
          </Section>

          <EmailFooter reason={"You received this because you submitted a mentorship inquiry at faziz-dev.com."} />
        </Container>
      </Body>
    </Html>
  )
}

export default MentorshipConfirmationEmail
