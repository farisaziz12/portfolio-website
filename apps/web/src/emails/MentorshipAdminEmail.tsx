import {
  Body, Container, Head, Heading, Html, Link, Preview,
  Section, Text, Hr,
} from '@react-email/components'
import * as React from 'react'
import * as s from './styles'

interface Props {
  name: string
  email: string
  budgetLine?: string
  timeline?: string
  cadence?: string
  goals: string
  message?: string
}

const dash = '–'

export function MentorshipAdminEmail({
  name, email, budgetLine, timeline, cadence, goals, message,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>Mentorship inquiry · {name}</Preview>
      <Body style={s.body}>
        <Container style={s.container}>
          <Section style={s.terminalHeader}>
            <Text style={s.terminalDots}>● ● ●</Text>
            <Text style={s.terminalText}>$ ack mentorship-inquiry</Text>
            <Text style={s.terminalOutput}>New inquiry from {name}.</Text>
          </Section>

          <Section style={s.content}>
            <Text style={s.kicker}>Mentorship inquiry</Text>
            <Heading style={s.heading}>{name}</Heading>

            <Text style={s.paragraph}>
              <Link href={`mailto:${email}`} style={s.link}>{email}</Link>
            </Text>

            <table style={s.detailTable}>
              <tbody>
                <tr>
                  <td style={s.detailLabel}>Budget</td>
                  <td style={s.detailValue}>{budgetLine || dash}</td>
                </tr>
                <tr>
                  <td style={s.detailLabel}>Timeline</td>
                  <td style={s.detailValue}>{timeline || dash}</td>
                </tr>
                <tr>
                  <td style={s.detailLabel}>Preferred cadence</td>
                  <td style={s.detailValue}>{cadence || dash}</td>
                </tr>
              </tbody>
            </table>

            <Text style={s.kicker}>Goals</Text>
            <Text style={s.longText}>{goals}</Text>

            {message ? (
              <>
                <Text style={{ ...s.kicker, marginTop: '24px' }}>Additional notes</Text>
                <Text style={s.longText}>{message}</Text>
              </>
            ) : null}

            <Hr style={s.divider} />
            <Text style={s.footerText}>
              Reply directly; this email's reply-to is set to the sender.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default MentorshipAdminEmail
