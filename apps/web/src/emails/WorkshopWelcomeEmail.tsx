import { Body, Container, Head, Heading, Html, Preview, Section, Text, Button } from '@react-email/components'
import * as React from 'react'
import * as s from './styles'
import { EmailFooter, EmailHeader, EmailSignature } from './parts'

interface Props {
  name: string
  event: string
  workshopTitle: string
  repoUrl?: string
  attendUrl: string
}

export function WorkshopWelcomeEmail({ name, event, workshopTitle, repoUrl, attendUrl }: Props) {
  return (
    <Html>
      <Head />
      <Preview>You're in: {workshopTitle} materials</Preview>
      <Body style={s.body}>
        <Container style={s.container}>
          <EmailHeader label="Workshop · you're in" />

          <Section style={s.content}>
            <Heading style={s.heading}>Welcome to {event}</Heading>

            {name && <Text style={s.paragraph}>Hey {name},</Text>}

            <Text style={s.paragraph}>
              Thanks for joining. Here are the materials and resources for the workshop.
            </Text>

            {repoUrl && (
              <Section style={s.buttonSection}>
                <Button style={s.primaryButton} href={repoUrl}>Open the repo</Button>
              </Section>
            )}

            <Section style={s.buttonSection}>
              <Button style={s.secondaryButton} href={attendUrl}>Back to the materials</Button>
            </Section>

            <EmailSignature />
          </Section>

          <EmailFooter reason={"You received this because you signed up at a workshop session."} unsubscribe />
        </Container>
      </Body>
    </Html>
  )
}

export default WorkshopWelcomeEmail
