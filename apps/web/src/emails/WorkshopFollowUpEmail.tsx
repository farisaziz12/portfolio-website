import {
  Body, Container, Head, Heading, Html, Link, Preview,
  Section, Text, Button, Hr,
} from '@react-email/components'
import * as React from 'react'
import * as s from './styles'

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
      <Preview>Thanks for joining {event} — quick feedback?</Preview>
      <Body style={s.body}>
        <Container style={s.container}>
          <Section style={s.terminalHeader}>
            <Text style={s.terminalDots}>● ● ●</Text>
            <Text style={s.terminalText}>$ echo "Thanks for attending!"</Text>
            <Text style={s.terminalOutput}>Workshop complete. Feedback appreciated.</Text>
          </Section>

          <Section style={s.content}>
            <Heading style={s.heading}>Thanks for joining {event}</Heading>

            {name && <Text style={s.paragraph}>Hey {name},</Text>}

            <Text style={s.paragraph}>
              I hope you enjoyed the {workshopTitle} session. Your feedback helps me improve future workshops.
            </Text>

            {feedbackUrl && (
              <Section style={s.buttonSection}>
                <Button style={s.primaryButton} href={feedbackUrl}>Share Quick Feedback</Button>
              </Section>
            )}

            <Text style={s.paragraph}>
              <strong style={{ color: '#f8fafc' }}>What's next?</strong>
            </Text>
            <Text style={s.paragraph}>
              Check out my other workshops and upcoming conference appearances.
            </Text>

            <Section style={s.buttonSection}>
              <Button style={s.secondaryButton} href="https://faziz-dev.com/workshops">Browse Workshops</Button>
            </Section>

            <Hr style={s.divider} />
            <Text style={s.signature}>— Faris Aziz</Text>
            <Text style={s.signatureLink}>
              <Link href="https://faziz-dev.com" style={s.link}>faziz-dev.com</Link>
            </Text>
          </Section>

          <Section style={s.footer}>
            <Text style={s.footerText}>You received this because you attended a workshop session.</Text>
            <Text style={s.footerText}><Link href="{{{unsubscribe_url}}}" style={s.link}>Unsubscribe</Link></Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default WorkshopFollowUpEmail
