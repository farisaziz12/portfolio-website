import { Body, Container, Head, Heading, Html, Preview, Section, Text, Button } from '@react-email/components'
import * as React from 'react'
import * as s from './styles'
import { EmailFooter, EmailHeader, EmailSignature } from './parts'

interface Props {
  name?: string
}

export function GeneralSubscribeConfirmEmail({ name }: Props) {
  return (
    <Html>
      <Head />
      <Preview>You're on the list</Preview>
      <Body style={s.body}>
        <Container style={s.container}>
          <EmailHeader label={"You're on the list"} />

          <Section style={s.content}>
            <Heading style={s.heading}>You're on the list</Heading>

            {name && <Text style={s.paragraph}>Hey {name},</Text>}

            <Text style={s.paragraph}>
              Thanks for subscribing. I'll email you when I'm speaking at a conference near you.
            </Text>

            <Text style={s.paragraph}>
              <strong style={{ color: s.inkStrong }}>What to expect:</strong>
            </Text>
            <Text style={s.paragraph}>
              Occasional updates about upcoming workshops, conference talks, and new content. No spam, ever.
            </Text>

            <Section style={s.buttonSection}>
              <Button style={s.primaryButton} href="https://faziz-dev.com/workshops">Browse workshops</Button>
            </Section>

            <EmailSignature />
          </Section>

          <EmailFooter reason={"You received this because you subscribed at faziz-dev.com."} unsubscribe />
        </Container>
      </Body>
    </Html>
  )
}

export default GeneralSubscribeConfirmEmail
