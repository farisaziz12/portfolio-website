import { defineType, defineField } from 'sanity';
import { JOB_ROLE_FAMILIES, JOB_TECH_TAGS, JOB_GEO_KINDS, JOB_STATUSES, JOB_PUBLISHED_BASIS } from 'shared/jobs';

/**
 * Hiring radar. This dataset is PUBLIC, so none of these types may hold
 * contact details, submitter identity or private review notes.
 *
 * Every type is liveEdit: scheduled runs write published documents directly,
 * and Studio edits apply immediately. Whether any of it is shown on the site
 * is decided by jobSettings.autoPublish and each role's `approved` flag.
 *
 * Document IDs use hyphens, never dots: dotted IDs are private in a public dataset.
 */

const list = (items: readonly { value: string; title: string }[]) => ({ list: items.map((i) => ({ value: i.value, title: i.title })) });

export const jobCompany = defineType({
  name: 'jobCompany',
  title: 'Hiring: company',
  type: 'document',
  liveEdit: true,
  fields: [
    defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'name', maxLength: 60 }, validation: (r) => r.required() }),
    defineField({ name: 'careersUrl', title: 'Careers page', type: 'url' }),
    defineField({
      name: 'ats',
      title: 'Applicant tracking system',
      type: 'string',
      options: list([
        { value: 'greenhouse', title: 'Greenhouse' },
        { value: 'ashby', title: 'Ashby' },
        { value: 'other', title: 'Other or custom' },
      ]),
    }),
    defineField({ name: 'atsBoard', title: 'ATS board slug', type: 'string', description: 'e.g. the `acme` in boards.greenhouse.io/acme' }),
    defineField({ name: 'oneLiner', title: 'Company one-liner', type: 'string', description: 'Only what a source states. No inferred growth or culture.', validation: (r) => r.max(160) }),
    defineField({ name: 'oneLinerSource', title: 'One-liner source URL', type: 'url' }),
    defineField({ name: 'watchlist', title: 'On the daily watchlist', type: 'boolean', initialValue: true }),
  ],
  orderings: [{ title: 'Name', name: 'name', by: [{ field: 'name', direction: 'asc' }] }],
});

export const jobRole = defineType({
  name: 'jobRole',
  title: 'Hiring: role',
  type: 'document',
  liveEdit: true,
  groups: [
    { name: 'listing', title: 'Listing', default: true },
    { name: 'verify', title: 'Verification' },
    { name: 'sources', title: 'Sources' },
    { name: 'overrides', title: 'Manual corrections' },
  ],
  fields: [
    defineField({ name: 'companyId', title: 'Company slug', type: 'string', group: 'listing', validation: (r) => r.required() }),
    defineField({ name: 'company', type: 'reference', to: [{ type: 'jobCompany' }], group: 'listing' }),
    defineField({ name: 'title', type: 'string', group: 'listing', validation: (r) => r.required() }),
    defineField({ name: 'team', type: 'string', group: 'listing' }),
    defineField({ name: 'families', title: 'Role family', type: 'array', of: [{ type: 'string' }], options: list(JOB_ROLE_FAMILIES), group: 'listing' }),
    defineField({ name: 'tech', title: 'Technology', type: 'array', of: [{ type: 'string' }], options: list(JOB_TECH_TAGS), group: 'listing' }),
    defineField({ name: 'geoKind', title: 'Geography', type: 'string', options: list(JOB_GEO_KINDS), group: 'listing' }),
    defineField({ name: 'locationText', title: 'Location, as listed', type: 'string', group: 'listing' }),
    defineField({ name: 'city', title: 'City (hybrid)', type: 'string', group: 'listing' }),
    defineField({ name: 'attendance', title: 'Office attendance requirement', type: 'string', group: 'listing' }),
    defineField({
      name: 'eligibleCountries',
      title: 'Eligible countries (ISO codes)',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Copy from the listing. "EMEA" alone does not make CH eligible.',
      group: 'listing',
    }),
    defineField({ name: 'eligibilityEvidence', title: 'Eligibility evidence (short quote)', type: 'text', rows: 2, group: 'listing' }),
    defineField({ name: 'summary', title: 'Factual one-liner', type: 'string', description: 'Source-supported only.', validation: (r) => r.max(200), group: 'listing' }),

    defineField({ name: 'status', type: 'string', options: list(JOB_STATUSES), initialValue: 'pending', group: 'verify', validation: (r) => r.required() }),
    defineField({ name: 'approved', title: 'Approved for the site', type: 'boolean', initialValue: false, description: 'Counts when automatic public updates are off.', group: 'verify' }),
    defineField({ name: 'firstSeenAt', type: 'datetime', readOnly: true, group: 'verify', validation: (r) => r.required() }),
    defineField({ name: 'publishedAt', title: 'Posted at (source)', type: 'datetime', group: 'verify' }),
    defineField({ name: 'publishedBasis', title: 'What the posted date means', type: 'string', options: list(JOB_PUBLISHED_BASIS), initialValue: 'unknown', group: 'verify' }),
    defineField({ name: 'lastVerifiedAt', title: 'Last verified open', type: 'datetime', group: 'verify' }),
    defineField({ name: 'lastCheckedAt', title: 'Last checked (any outcome)', type: 'datetime', group: 'verify' }),
    defineField({ name: 'inconclusiveChecks', type: 'number', readOnly: true, group: 'verify' }),
    defineField({ name: 'closedEvidence', title: 'Why it was closed', type: 'text', rows: 2, group: 'verify' }),
    defineField({ name: 'matchUncertain', title: 'Possible duplicate: review', type: 'boolean', group: 'verify' }),
    defineField({
      name: 'publications',
      title: 'Publication history',
      type: 'array',
      group: 'verify',
      of: [
        {
          type: 'object',
          name: 'publication',
          fields: [
            { name: 'channel', type: 'string', description: 'edition:2026-W45 or site' },
            { name: 'publishedAt', type: 'datetime' },
            { name: 'editionId', type: 'string' },
          ],
        },
      ],
    }),

    defineField({ name: 'sourceKey', title: 'Stable source key', type: 'string', readOnly: true, group: 'sources', validation: (r) => r.required() }),
    defineField({ name: 'applyUrl', title: 'Application URL (canonical)', type: 'url', group: 'sources', validation: (r) => r.required() }),
    defineField({ name: 'discoveryUrls', title: 'Other places it was found', type: 'array', of: [{ type: 'url' }], group: 'sources' }),

    defineField({
      name: 'overrides',
      title: 'Manual corrections (survive refreshes)',
      type: 'object',
      group: 'overrides',
      fields: [
        { name: 'title', type: 'string' },
        { name: 'team', type: 'string' },
        { name: 'locationText', type: 'string' },
        { name: 'geoKind', type: 'string', options: list(JOB_GEO_KINDS) },
        { name: 'eligibleCountries', type: 'array', of: [{ type: 'string' }] },
        { name: 'hidden', title: 'Hide from the site', type: 'boolean' },
      ],
    }),
  ],
  orderings: [{ title: 'Newest first', name: 'firstSeen', by: [{ field: 'firstSeenAt', direction: 'desc' }] }],
});

export const jobLead = defineType({
  name: 'jobLead',
  title: 'Hiring: submitted lead',
  type: 'document',
  liveEdit: true,
  description: 'A public job URL to look at. Never store who sent it or any private note here.',
  fields: [
    defineField({ name: 'url', type: 'url', validation: (r) => r.required() }),
    defineField({ name: 'state', type: 'string', options: list([{ value: 'new', title: 'New' }, { value: 'processed', title: 'Processed' }, { value: 'rejected', title: 'Rejected' }]), initialValue: 'new' }),
    defineField({ name: 'roleId', title: 'Resulting role', type: 'string', readOnly: true }),
    defineField({ name: 'outcome', title: 'Outcome (public-safe)', type: 'string' }),
  ],
});

export const jobEdition = defineType({
  name: 'jobEdition',
  title: 'Hiring: weekly edition',
  type: 'document',
  liveEdit: true,
  fields: [
    defineField({ name: 'weekId', type: 'string', readOnly: true, description: 'ISO week in Europe/Zurich, e.g. 2026-W45. One edition per week.' }),
    defineField({ name: 'state', type: 'string', options: list([{ value: 'draft', title: 'Drafted' }, { value: 'published', title: 'Published on LinkedIn' }]), initialValue: 'draft', description: 'Drafting is not publishing. Set to published only after you post it.' }),
    defineField({ name: 'publishedAt', type: 'datetime' }),
    defineField({
      name: 'items',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'item',
          fields: [
            { name: 'roleId', type: 'string' },
            { name: 'resurfaced', type: 'boolean' },
            { name: 'ageLabel', type: 'string' },
          ],
        },
      ],
    }),
    defineField({ name: 'draft', title: 'LinkedIn draft', type: 'text', rows: 18 }),
    defineField({ name: 'draftLength', title: 'Draft length (characters)', type: 'number', readOnly: true }),
    defineField({ name: 'uncertainties', type: 'array', of: [{ type: 'string' }] }),
  ],
  orderings: [{ title: 'Newest first', name: 'week', by: [{ field: 'weekId', direction: 'desc' }] }],
});

export const jobRun = defineType({
  name: 'jobRun',
  title: 'Hiring: run summary',
  type: 'document',
  liveEdit: true,
  fields: [
    defineField({ name: 'kind', type: 'string', options: list([{ value: 'daily', title: 'Daily refresh' }, { value: 'weekly', title: 'Sunday edition' }]) }),
    defineField({ name: 'startedAt', type: 'datetime' }),
    defineField({ name: 'finishedAt', type: 'datetime' }),
    defineField({ name: 'counts', type: 'object', fields: [
      { name: 'created', type: 'number' }, { name: 'updated', type: 'number' }, { name: 'verifiedOpen', type: 'number' },
      { name: 'closed', type: 'number' }, { name: 'inconclusive', type: 'number' }, { name: 'flaggedForReview', type: 'number' },
    ] }),
    defineField({ name: 'sourcesChecked', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'failures', title: 'Failures and gaps', type: 'array', of: [{ type: 'string' }], description: 'Anything not covered. A run never claims complete coverage.' }),
    defineField({ name: 'stoppedEarly', title: 'Stopped early (limit reached)', type: 'boolean' }),
  ],
  orderings: [{ title: 'Newest first', name: 'started', by: [{ field: 'startedAt', direction: 'desc' }] }],
});

export const jobSettings = defineType({
  name: 'jobSettings',
  title: 'Hiring: settings',
  type: 'document',
  fields: [
    defineField({
      name: 'autoPublish',
      title: 'Automatic public updates',
      type: 'boolean',
      initialValue: false,
      description: 'Off: only roles you approve individually appear. On: verified, Swiss-eligible roles appear and disappear without approval.',
    }),
    defineField({ name: 'paused', title: 'Pause scheduled runs', type: 'boolean', initialValue: false, description: 'Scheduled tasks read this first and stop if true.' }),
    defineField({ name: 'maxVerificationAgeHours', title: 'Maximum verification age (hours)', type: 'number', initialValue: 72, validation: (r) => r.required().min(12).max(336), description: 'Roles not verified within this window leave the site, even if no run happens.' }),
    defineField({ name: 'dailyVerifyBatch', title: 'Roles verified per daily run', type: 'number', initialValue: 25, validation: (r) => r.min(1).max(100) }),
    defineField({ name: 'enabledFamilies', type: 'array', of: [{ type: 'string' }], options: list(JOB_ROLE_FAMILIES) }),
    defineField({ name: 'enabledGeoKinds', type: 'array', of: [{ type: 'string' }], options: list(JOB_GEO_KINDS) }),
    defineField({ name: 'enabledTech', type: 'array', of: [{ type: 'string' }], options: list(JOB_TECH_TAGS) }),
  ],
});

export const jobTypes = [jobCompany, jobRole, jobLead, jobEdition, jobRun, jobSettings];
