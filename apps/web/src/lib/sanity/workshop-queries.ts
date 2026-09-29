/**
 * GROQ for the workshop delivery tooling (attendee pages, short paths, admin,
 * follow-up/subscribe routes). Site pages read through lib/sanity/v3 instead.
 */
import groq from 'groq';

export const workshopAttendQuery = groq`
  *[_type == "workshopInstance" && token.current == $token][0] {
    _id,
    title,
    event,
    "token": token.current,
    workshopDate,
    accessDurationDays,
    forceClose,
    repoUrl,
    overallFeedbackUrl,
    emailCaptureEnabled,
    sections[] {
      _key,
      emoji,
      title,
      sectionFeedbackUrl
    }
  }
`;

/** One section body for lazy load after schedule click. */
export const workshopAttendSectionQuery = groq`
  *[_type == "workshopInstance" && token.current == $token][0] {
    "section": sections[_key == $sectionKey][0] {
      _key,
      emoji,
      title,
      sectionFeedbackUrl,
      content
    }
  }
`;

export const allWorkshopInstancesQuery = groq`
  *[_type == "workshopInstance"] | order(workshopDate desc) {
    _id, title, event,
    "slug": slug.current, "token": token.current, "shortPath": shortPath.current,
    workshopDate, accessDurationDays, forceClose, repoUrl,
    overallFeedbackUrl, emailCaptureEnabled, resendAudienceId
  }
`;

// Look up a workshopInstance by slug — used by follow-up API (admin supplies slug).
export const workshopInstanceBySlugQuery = groq`
  *[_type == "workshopInstance" && slug.current == $slug][0] {
    _id, title, event, "slug": slug.current, "token": token.current, resendAudienceId
  }
`;

/** Short typeable link: /survive → attend token redirect. */
export const workshopInstanceByShortPathQuery = groq`
  *[_type == "workshopInstance" && shortPath.current == $shortPath][0] {
    "token": token.current, "shortPath": shortPath.current
  }
`;

// Look up by attend token — used by subscribe/session so we never trust audience IDs from the client.
export const workshopInstanceByTokenQuery = groq`
  *[_type == "workshopInstance" && token.current == $token][0] {
    _id, title, event, "slug": slug.current, "token": token.current,
    workshopDate, accessDurationDays, forceClose, resendAudienceId, repoUrl
  }
`;


/** Admin dashboard: the whole profile document. */
export const speakerProfileQuery = groq`
  *[_type == "speakerProfile"] | order(_updatedAt desc)[0] {
    ...
  }
`;

