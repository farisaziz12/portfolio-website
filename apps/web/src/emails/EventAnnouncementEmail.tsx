import {
  Body, Container, Head, Heading, Html, Link, Preview,
  Section, Text, Button, Hr,
} from '@react-email/components'
import * as React from 'react'
import * as s from './styles'

interface Props {
  eventTitle: string
  conference: string
  date: string
  city?: string
  country?: string
  slug: string
  personalNote?: string
}

export function EventAnnouncementEmail({
  eventTitle, conference, date, city, country, slug, personalNote,
}: Props) {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  })
  const location = [city, country].filter(Boolean).join(', ')

  return (
    <Html>
      <Head />
      <Preview>New event: {eventTitle} at {conference}</Preview>
      <Body style={s.body}>
        <Container style={s.container}>
          <Section style={s.terminalHeader}>
            <Text style={s.terminalDots}>● ● ●</Text>
            <Text style={s.terminalText}>$ echo "New event announced!"</Text>
            <Text style={s.terminalOutput}>Event confirmed. Details below.</Text>
          </Section>

          <Section style={s.content}>
            <Heading style={s.heading}>{eventTitle}</Heading>

            <Text style={s.paragraph}>
              <strong style={{ color: '#f8fafc' }}>{conference}</strong>
              <br />
              {formattedDate}
              {location && <><br />{location}</>}
            </Text>

            {personalNote && (
              <Text style={s.paragraph}>{personalNote}</Text>
            )}

            <Section style={s.buttonSection}>
              <Button style={s.primaryButton} href={`https://faziz-dev.com/events/${slug}`}>
                View Event Details
              </Button>
            </Section>

            <Section style={s.buttonSection}>
              <Button style={s.secondaryButton} href="https://faziz-dev.com/events">
                All Upcoming Events
              </Button>
            </Section>

            <Hr style={s.divider} />
            <Text style={s.signature}>— Faris Aziz</Text>
            <Text style={s.signatureLink}>
              <Link href="https://faziz-dev.com" style={s.link}>faziz-dev.com</Link>
            </Text>
          </Section>

          <Section style={s.footer}>
            <Text style={s.footerText}>
              You received this because you subscribed at faziz-dev.com.
            </Text>
            <Text style={s.footerText}>
              <Link href="{{{unsubscribe_url}}}" style={s.link}>Unsubscribe</Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default EventAnnouncementEmail
