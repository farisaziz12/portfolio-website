// Shared V3 email chrome: brand band + wordmark header, signature, footer.
// Every template uses these so the emails read like the site.
import { Link, Section, Text, Hr } from '@react-email/components'
import * as React from 'react'
import * as s from './styles'

/** Blue edge + yellow band (table cells: gradients aren't email-safe), wordmark, label. */
export function EmailHeader({ label }: { label: string }) {
  return (
    <Section>
      <table role="presentation" cellPadding={0} cellSpacing={0} style={s.band}>
        <tbody>
          <tr>
            <td style={s.bandBlue}>&nbsp;</td>
            <td style={s.bandYellow}>&nbsp;</td>
          </tr>
        </tbody>
      </table>
      <Text style={{ margin: '0' }}>
        <Link href="https://faziz-dev.com" style={s.wordmark}>Faris Aziz</Link>
      </Text>
      <Text style={s.headerLabel}>{label}</Text>
    </Section>
  )
}

/** "– Faris" + site link, above the footer. */
export function EmailSignature({ name = 'Faris' }: { name?: string }) {
  return (
    <>
      <Hr style={s.divider} />
      <Text style={s.signature}>– {name}</Text>
      <Text style={s.signatureLink}>
        <Link href="https://faziz-dev.com" style={s.link}>faziz-dev.com</Link>
      </Text>
    </>
  )
}

/** Why you got this, plus an unsubscribe link for audience emails. */
export function EmailFooter({ reason, unsubscribe = false }: { reason: string; unsubscribe?: boolean }) {
  return (
    <Section style={s.footer}>
      <Text style={s.footerText}>{reason}</Text>
      {unsubscribe && (
        <Text style={s.footerText}>
          <Link href="{{{unsubscribe_url}}}" style={s.link}>Unsubscribe</Link>
        </Text>
      )}
    </Section>
  )
}
