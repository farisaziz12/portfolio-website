import { Body, Container, Head, Heading, Html, Preview, Section, Text, Button } from '@react-email/components'
import * as React from 'react'
import * as s from './styles'
import { EmailFooter, EmailHeader, EmailSignature } from './parts'

interface Props {
  name: string
  workshopTitle: string
  event: string
  feedbackUrl?: string
}

export function WorkshopFollowUpEmail({ name, workshopTitle, event, feedbackUrl }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Thanks for joining {event} · quick feedback?</Preview>
      <Body style={s.body}>
        <Container style={s.container}>
          <EmailHeader label="Workshop · thank you" />

          <Section style={s.content}>
            <Heading style={s.heading}>Thanks for joining {event}</Heading>

            {name && <Text style={s.paragraph}>Hey {name},</Text>}

            <Text style={s.paragraph}>
              I hope you enjoyed the {workshopTitle} session. Your feedback helps me improve future workshops.
            </Text>

            {feedbackUrl && (
              <Section style={s.buttonSection}>
                <Button style={s.primaryButton} href={feedbackUrl}>Share quick feedback</Button>
              </Section>
            )}

            <Text style={s.paragraph}>
              <strong style={{ color: s.inkStrong }}>What's next?</strong>
            </Text>
            <Text style={s.paragraph}>
              Check out my other workshops and upcoming conference appearances.
            </Text>

            <Section style={s.buttonSection}>
              <Button style={s.secondaryButton} href="https://faziz-dev.com/workshops">Browse workshops</Button>
            </Section>

            <EmailSignature />
          </Section>

          <EmailFooter reason={"You received this because you attended a workshop session."} unsubscribe />
        </Container>
      </Body>
    </Html>
  )
}

export default WorkshopFollowUpEmail
