import {
  Body, Container, Head, Heading, Html, Link, Preview,
  Section, Text, Button, Hr,
} from '@react-email/components'
import * as React from 'react'
import * as s from './styles'

interface Props {
  name: string
  event: string
  workshopTitle: string
  repoUrl: string
  attendUrl: string
}

export function WorkshopWelcomeEmail({ name, event, workshopTitle, repoUrl, attendUrl }: Props) {
  return (
    <Html>
      <Head />
      <Preview>You're in — {workshopTitle} materials</Preview>
      <Body style={s.body}>
        <Container style={s.container}>
          <Section style={s.terminalHeader}>
            <Text style={s.terminalDots}>● ● ●</Text>
            <Text style={s.terminalText}>$ npm run workshop --session="{event}"</Text>
            <Text style={s.terminalOutput}>Session initialized. Welcome aboard.</Text>
          </Section>

          <Section style={s.content}>
            <Heading style={s.heading}>Welcome to {event}</Heading>

            {name && <Text style={s.paragraph}>Hey {name},</Text>}

            <Text style={s.paragraph}>
              Thanks for joining! Here are your workshop materials and resources.
            </Text>

            {repoUrl && (
              <Section style={s.buttonSection}>
                <Button style={s.primaryButton} href={repoUrl}>Open GitHub Repo</Button>
              </Section>
            )}

            <Section style={s.buttonSection}>
              <Button style={s.secondaryButton} href={attendUrl}>Back to Workshop Materials</Button>
            </Section>

            <Hr style={s.divider} />
            <Text style={s.signature}>— Faris Aziz</Text>
            <Text style={s.signatureLink}>
              <Link href="https://faziz-dev.com" style={s.link}>faziz-dev.com</Link>
            </Text>
          </Section>

          <Section style={s.footer}>
            <Text style={s.footerText}>You received this because you signed up at a workshop session.</Text>
            <Text style={s.footerText}><Link href="{{{unsubscribe_url}}}" style={s.link}>Unsubscribe</Link></Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default WorkshopWelcomeEmail
