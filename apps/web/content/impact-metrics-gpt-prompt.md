# Impact Metrics Content Generator - GPT Prompt

Copy and paste this entire document into GPT, then provide your raw data/achievements at the end.

---

## Context

I need to create content for an Interactive Impact Explorer on my portfolio website. The data will be stored in Sanity CMS using a specific schema structure called `impactMetricV2`.

## Schema Structure

Each metric must have the following fields:

### Required Fields
- **title**: Internal title (max 100 chars)
- **slug**: URL-friendly version of title (auto-generated from title)
- **domain**: One of: `community`, `product`, `leadership`, `speaking`
- **headlineNumber**: The main numeric value (e.g., 50000, 3.1, 98)
- **label**: Short label shown with number (max 50 chars, e.g., "Community Members")
- **outcomesBlock**: What changed, why it mattered
- **howBlock**: What I did, approach, constraints
- **proofBlock**: Links to evidence

### Optional Fields
- **unit**: How to format the number. Options:
  - `number` (plain)
  - `k` (thousands, shows "50K")
  - `m` (millions, shows "2.1M")
  - `percent` (shows "98%")
  - `x` (multiplier, shows "3.1x")
  - `chf` / `eur` / `usd` (currency)
  - `rating` (shows "4.8/5")
- **prefix**: Symbol before number (e.g., "+", "~", ">")
- **timeWindow**: Time period (max 30 chars, e.g., "Jan-Sep 2025", "Since 2022")
- **delta**: Growth indicator (e.g., "+32%", "3.1x", "↑50%")
- **contextNote**: One factual sentence explaining the metric (max 200 chars)
- **confidenceSource**: Data source (e.g., "Stripe dashboard", "Meetup.com analytics")
- **story**: Expandable narrative (120-180 words, ~600-1000 chars)
- **actionLinks**: 1-3 links at end of story
- **featured**: Boolean - show in hero section
- **highlightStrip**: Boolean - show in top 3 quick stats
- **order**: Display order (lower = first)
- **highlightColor**: `indigo`, `violet`, `emerald`, `amber`, `pink`, `blue`

### Lens Block Structure

Each lens block needs:
```json
{
  "headline": "Short headline (max 80 chars)",
  "body": "1-3 short paragraphs or bullet points"
}
```

For **proofBlock**, also include items array:
```json
{
  "headline": "See the evidence",
  "items": [
    {
      "type": "link|image|logo|quote|metricSource",
      "label": "Display text",
      "url": "https://...",
      "tag": "Optional tag like 'Talk' or 'GitHub'"
    }
  ]
}
```

### Action Link Types
- `talk` - Link to a talk
- `blog` - Link to blog post
- `project` - Link to project
- `service` - Link to service page
- `booking` - Link to booking/calendar
- `external` - External link

## Output Format

Generate a JSON array of metrics. Here's the exact structure:

```json
[
  {
    "title": "Community Members Reached",
    "slug": "community-members-reached",
    "domain": "community",
    "headlineNumber": 50000,
    "unit": "number",
    "prefix": null,
    "label": "Community Members",
    "timeWindow": "Since 2022",
    "delta": "+32%",
    "contextNote": "Total unique members across React Zurich and mentorship platforms.",
    "confidenceSource": "Meetup.com analytics",
    "outcomesBlock": {
      "headline": "Built a thriving developer community",
      "body": "Grew React Zurich from 0 to 5,000+ members, establishing it as the largest React meetup in Switzerland. The community serves as a talent pipeline for local tech companies."
    },
    "howBlock": {
      "headline": "Consistent events + quality content",
      "body": "Organized 50+ events over 3 years. Focused on hands-on workshops over passive talks. Partnered with companies for venues while keeping events free."
    },
    "proofBlock": {
      "headline": "See the numbers",
      "items": [
        {
          "type": "link",
          "label": "React Zurich Meetup",
          "url": "https://meetup.com/react-zurich",
          "tag": "Meetup"
        },
        {
          "type": "link",
          "label": "Event photos",
          "url": "/media",
          "tag": "Gallery"
        }
      ]
    },
    "story": "What started as a small gathering in a co-working space has grown into Switzerland's most active React community. Beyond the numbers, the real impact is in the connections—developers who found jobs through our network, startups that found their first engineers, and the knowledge shared across hundreds of sessions. Every event teaches me something new about what developers need.",
    "actionLinks": [
      {
        "type": "external",
        "label": "Join React Zurich",
        "url": "https://meetup.com/react-zurich"
      },
      {
        "type": "booking",
        "label": "Book me for your meetup",
        "url": "https://cal.com/farisaziz12/discovery-call"
      }
    ],
    "featured": true,
    "highlightStrip": true,
    "order": 10,
    "highlightColor": "violet"
  }
]
```

## Domain Guidelines

### Community (violet)
Metrics about: meetup growth, community engagement, members helped, events organized, volunteer speakers recruited

### Product / Monetization (emerald)
Metrics about: revenue impact, conversion improvements, checkout optimization, payment processing, business outcomes

### Engineering Leadership (amber)
Metrics about: team velocity, code review improvements, developer experience, process improvements, technical debt reduction

### Speaking (blue)
Metrics about: talks delivered, countries visited, audience ratings, conference appearances, workshop attendees

## Writing Guidelines

1. **Be specific**: Use exact numbers, not ranges
2. **Be factual**: Context notes should be plain English, non-marketing
3. **Show don't tell**: Proof items should link to verifiable sources
4. **Keep it concise**: Stories are 120-180 words max
5. **Focus on outcomes**: Lead with what changed, not what you did
6. **Time-bound where possible**: Include time windows for context

## Your Task

Based on the raw data I provide below, generate a complete JSON array of `impactMetricV2` documents following the schema above.

For each achievement/metric I give you:
1. Categorize it into the correct domain
2. Extract the key number and choose appropriate formatting
3. Write compelling but factual lens content
4. Suggest relevant proof items and action links
5. Determine if it should be featured or in highlight strip

---

## MY RAW DATA / ACHIEVEMENTS

[Paste your achievements, numbers, and context here. Be as detailed as possible - include:]

- The specific numbers/metrics
- Time periods
- Context about how you achieved it
- Any links to proof (talks, repos, articles, dashboards)
- What domain it relates to
- Whether it's a "headline" achievement or supporting metric

Example format:
```
- Grew React Zurich meetup to 5000+ members over 3 years
- Organized 60+ events since 2022
- Spoke at 60+ conferences in 12+ countries
- Improved checkout conversion by 32% at [Company] in Q2 2024
- Reduced payment processing time from 3s to under 1s
- Team velocity increased 2.4x after process changes
- 98% audience recommendation rate from speaker feedback
```
