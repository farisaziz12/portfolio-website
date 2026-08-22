import {
  Body, Container, Head, Heading, Html, Link, Preview,
  Section, Text, Hr,
} from '@react-email/components'
import * as React from 'react'
import * as s from './styles'

interface Props {
  name: string
  email: string
  topic: string
  company?: string
  message: string
}

const dash = '–'

export function ContactAdminEmail({ name, email, topic, company, message }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Contact · {topic} · {name}</Preview>
      <Body style={s.body}>
        <Container style={s.container}>
          <Section style={s.terminalHeader}>
            <Text style={s.terminalDots}>● ● ●</Text>
            <Text style={s.terminalText}>$ ack contact-message</Text>
            <Text style={s.terminalOutput}>New message from {name}.</Text>
          </Section>

          <Section style={s.content}>
            <Text style={s.kicker}>Contact · {topic}</Text>
            <Heading style={s.heading}>{name}</Heading>

            <Text style={s.paragraph}>
              <Link href={`mailto:${email}`} style={s.link}>{email}</Link>
            </Text>

            <table style={s.detailTable}>
              <tbody>
                <tr>
                  <td style={s.detailLabel}>Topic</td>
                  <td style={s.detailValue}>{topic}</td>
                </tr>
                <tr>
                  <td style={s.detailLabel}>Company</td>
                  <td style={s.detailValue}>{company || dash}</td>
                </tr>
              </tbody>
            </table>

            <Text style={s.kicker}>Message</Text>
            <Text style={s.longText}>{message}</Text>

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

export default ContactAdminEmail
