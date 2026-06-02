import {
  Body, Container, Head, Heading, Html, Link, Preview,
  Section, Text, Hr,
} from '@react-email/components'
import * as React from 'react'
import * as s from './styles'

interface Props {
  name: string
  email: string
  event: string
  date?: string
  location?: string
  format?: string
  size?: string
  message?: string
}

const dash = '—'

export function InviteAdminEmail({
  name, email, event, date, location, format, size, message,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>Speaking invite · {event}</Preview>
      <Body style={s.body}>
        <Container style={s.container}>
          <Section style={s.terminalHeader}>
            <Text style={s.terminalDots}>● ● ●</Text>
            <Text style={s.terminalText}>$ ack speaking-invite</Text>
            <Text style={s.terminalOutput}>New invite from {name}.</Text>
          </Section>

          <Section style={s.content}>
            <Text style={s.kicker}>Speaking invite</Text>
            <Heading style={s.heading}>{event}</Heading>

            <Text style={s.paragraph}>
              From <strong style={{ color: s.inkStrong }}>{name}</strong>{' '}
              &lt;<Link href={`mailto:${email}`} style={s.link}>{email}</Link>&gt;
            </Text>

            <table style={s.detailTable}>
              <tbody>
                <tr>
                  <td style={s.detailLabel}>Date</td>
                  <td style={s.detailValue}>{date || dash}</td>
                </tr>
                <tr>
                  <td style={s.detailLabel}>Location</td>
                  <td style={s.detailValue}>{location || dash}</td>
                </tr>
                <tr>
                  <td style={s.detailLabel}>Format</td>
                  <td style={s.detailValue}>{format || dash}</td>
                </tr>
                <tr>
                  <td style={s.detailLabel}>Audience size</td>
                  <td style={s.detailValue}>{size || dash}</td>
                </tr>
              </tbody>
            </table>

            <Text style={s.kicker}>Message</Text>
            <Text style={s.longText}>{message || '(no additional details)'}</Text>

            <Hr style={s.divider} />
            <Text style={s.footerText}>
              Reply directly — this email's reply-to is set to the sender.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default InviteAdminEmail
