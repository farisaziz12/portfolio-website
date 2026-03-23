import {
  Body, Container, Head, Heading, Html, Link, Preview,
  Section, Text, Button, Hr,
} from '@react-email/components'
import * as React from 'react'
import * as s from './styles'

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
          <Section style={s.terminalHeader}>
            <Text style={s.terminalDots}>● ● ●</Text>
            <Text style={s.terminalText}>$ echo "Welcome aboard"</Text>
            <Text style={s.terminalOutput}>Subscription confirmed.</Text>
          </Section>

          <Section style={s.content}>
            <Heading style={s.heading}>You're on the list</Heading>

            {name && <Text style={s.paragraph}>Hey {name},</Text>}

            <Text style={s.paragraph}>
              Thanks for subscribing! I'll reach out when I'm speaking at a conference near you.
            </Text>

            <Text style={s.paragraph}>
              <strong style={{ color: '#f8fafc' }}>What to expect:</strong>
            </Text>
            <Text style={s.paragraph}>
              Occasional updates about upcoming workshops, conference talks, and new content. No spam — ever.
            </Text>

            <Section style={s.buttonSection}>
              <Button style={s.primaryButton} href="https://faziz-dev.com/workshops">Browse Workshops</Button>
            </Section>

            <Hr style={s.divider} />
            <Text style={s.signature}>— Faris Aziz</Text>
            <Text style={s.signatureLink}>
              <Link href="https://faziz-dev.com" style={s.link}>faziz-dev.com</Link>
            </Text>
          </Section>

          <Section style={s.footer}>
            <Text style={s.footerText}>You received this because you subscribed at faziz-dev.com.</Text>
            <Text style={s.footerText}><Link href="{{{unsubscribe_url}}}" style={s.link}>Unsubscribe</Link></Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default GeneralSubscribeConfirmEmail
