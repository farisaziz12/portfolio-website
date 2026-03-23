import {
  Body, Container, Head, Heading, Html, Link, Preview,
  Section, Text, Button, Hr,
} from '@react-email/components'
import * as React from 'react'
import * as s from './styles'

interface EventItem {
  title: string
  conference: string
  date: string
  slug: string
  city?: string
  country?: string
}

interface BlogItem {
  title: string
  slug: string
  excerpt?: string
}

interface Props {
  introText?: string
  events: EventItem[]
  posts: BlogItem[]
}

export function DigestEmail({ introText, events, posts }: Props) {
  return (
    <Html>
      <Head />
      <Preview>What's coming up — events, talks, and more</Preview>
      <Body style={s.body}>
        <Container style={s.container}>
          <Section style={s.terminalHeader}>
            <Text style={s.terminalDots}>● ● ●</Text>
            <Text style={s.terminalText}>$ cat updates.log</Text>
            <Text style={s.terminalOutput}>Here's what's new.</Text>
          </Section>

          <Section style={s.content}>
            <Heading style={s.heading}>What's coming up</Heading>

            {introText && <Text style={s.paragraph}>{introText}</Text>}

            {events.length > 0 && (
              <>
                <Text style={sectionTitle}>Upcoming events</Text>
                {events.map((event) => {
                  const date = new Date(event.date).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric',
                  })
                  const location = [event.city, event.country].filter(Boolean).join(', ')
                  return (
                    <Text key={event.slug} style={eventRow}>
                      <strong style={{ color: '#f8fafc' }}>{date}</strong>
                      {' — '}
                      <Link href={`https://faziz-dev.com/events/${event.slug}`} style={s.link}>
                        {event.title}
                      </Link>
                      {' at '}{event.conference}
                      {location && <span style={{ color: '#64748b' }}> · {location}</span>}
                    </Text>
                  )
                })}
              </>
            )}

            {posts.length > 0 && (
              <>
                <Text style={{ ...sectionTitle, marginTop: '32px' }}>Recent posts</Text>
                {posts.map((post) => (
                  <Text key={post.slug} style={eventRow}>
                    <Link href={`https://faziz-dev.com/blog/${post.slug}`} style={s.link}>
                      {post.title}
                    </Link>
                    {post.excerpt && (
                      <span style={{ color: '#64748b' }}> — {post.excerpt}</span>
                    )}
                  </Text>
                ))}
              </>
            )}

            <Section style={s.buttonSection}>
              <Button style={s.primaryButton} href="https://faziz-dev.com/events">
                View Full Schedule
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

export default DigestEmail

const sectionTitle = {
  color: '#94a3b8',
  fontSize: '12px',
  fontWeight: '600' as const,
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
  margin: '0 0 12px 0',
}

const eventRow = {
  color: '#cbd5e1',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 10px 0',
}
