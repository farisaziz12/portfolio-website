# Impact Metrics - Example Content

This document contains example content for 12 impact metrics across 4 domains. Use this as a reference when creating metrics in Sanity Studio.

---

## Community Domain (3 metrics)

### Metric 1: Community Members
- **Domain**: Community
- **Headline Number**: 50000
- **Unit**: number
- **Label**: Community Members Reached
- **Time Window**: Since 2022
- **Delta**: +32%
- **Context Note**: Total unique members across React Zurich and mentorship platforms.
- **Confidence Source**: Meetup.com analytics + LinkedIn connections

**Outcomes Lens**:
- Headline: Built a thriving developer community
- Body: Grew React Zurich from 0 to 5,000+ members, establishing it as the largest React meetup in Switzerland. The community now serves as a key talent pipeline for local tech companies.

**How Lens**:
- Headline: Consistent events + quality content
- Body: Organized 50+ events over 3 years. Focused on hands-on workshops, not just talks. Partnered with companies for venues and sponsorships while keeping events free.

**Proof Lens**:
- Headline: See the numbers
- Items:
  - Type: link, Label: React Zurich Meetup, URL: https://meetup.com/react-zurich, Tag: Meetup
  - Type: link, Label: Event photos gallery, URL: /media, Tag: Gallery
  - Type: metricSource, Label: Meetup.com analytics dashboard, Source Note: Internal

**Story**: What started as a small gathering of React enthusiasts in a co-working space has grown into Switzerland's most active React community. Beyond the numbers, the real impact is in the connections formed—developers who found jobs through our network, startups that found their first engineers, and the knowledge shared across hundreds of sessions.

**Action Links**:
- Type: talk, Label: Watch community talk, URL: /talks/building-developer-communities
- Type: booking, Label: Book me for your meetup, URL: https://cal.com/farisaziz12/discovery-call

---

### Metric 2: Events Organized
- **Domain**: Community
- **Headline Number**: 60
- **Unit**: number
- **Prefix**: +
- **Label**: Events Organized
- **Time Window**: 2022-2024
- **Delta**: 20/year
- **Context Note**: Meetups, workshops, and hackathons across Switzerland and online.
- **Confidence Source**: Event calendars + Meetup.com

**Outcomes Lens**:
- Headline: Consistent community touchpoints
- Body: Regular events keep the community engaged and growing. Each event averages 50-80 attendees with high repeat attendance.

**How Lens**:
- Headline: Scalable event playbook
- Body: Developed a repeatable format: 30-min talk + 15-min Q&A + networking. Recruited volunteer speakers and coordinated with venue sponsors quarterly.

**Proof Lens**:
- Items:
  - Type: link, Label: Past events list, URL: /events, Tag: Events
  - Type: quote, Quote: "Best organized tech meetup in Zurich", Quote Author: Attendee feedback

---

### Metric 3: Speaker Satisfaction
- **Domain**: Community
- **Headline Number**: 4.8
- **Unit**: rating
- **Label**: Speaker Satisfaction
- **Time Window**: Last 12 months
- **Context Note**: Average rating from post-event speaker surveys.
- **Confidence Source**: Google Forms surveys

**Outcomes Lens**:
- Headline: Speakers want to return
- Body: High satisfaction means we attract quality speakers. 85% of speakers would present again.

**How Lens**:
- Headline: Speaker experience focus
- Body: Pre-event briefings, professional A/V setup, social media promotion, and post-event thank you gifts.

---

## Product / Monetization Domain (3 metrics)

### Metric 4: Revenue Impact
- **Domain**: Product
- **Headline Number**: 2.1
- **Unit**: m
- **Prefix**: CHF
- **Label**: Revenue Impact
- **Time Window**: Jan-Sep 2025
- **Delta**: +45%
- **Context Note**: Total revenue influenced through payment system optimizations and checkout improvements.
- **Confidence Source**: Stripe dashboard

**Outcomes Lens**:
- Headline: Direct bottom-line impact
- Body: Payment optimization work directly contributed to 45% revenue growth. Reduced cart abandonment and improved conversion rates across checkout flows.

**How Lens**:
- Headline: Data-driven optimization
- Body: Analyzed 6 months of checkout data. Identified 3 key drop-off points. Implemented A/B tests for each. Rolled out winning variants.

**Proof Lens**:
- Items:
  - Type: link, Label: Payment systems talk, URL: /talks/orchestrating-millions-reactive-payments, Tag: Talk
  - Type: metricSource, Label: Stripe analytics, Source Note: Client dashboard (NDA)

**Story**: At [Client], the checkout flow was losing 40% of users before payment. Through systematic analysis and targeted improvements—better error handling, clearer pricing, optimized form fields—we recovered significant revenue. The approach is now documented as the company's payment best practices.

**Action Links**:
- Type: talk, Label: Watch the talk, URL: /talks/orchestrating-millions-reactive-payments
- Type: service, Label: Hire for payments consulting, URL: /consulting

---

### Metric 5: Conversion Rate Improvement
- **Domain**: Product
- **Headline Number**: 32
- **Unit**: percent
- **Prefix**: +
- **Label**: Checkout Conversion Lift
- **Time Window**: Q2 2024
- **Context Note**: Improvement in checkout completion rate after payment flow optimization.
- **Confidence Source**: A/B test results

**Outcomes Lens**:
- Headline: More users completing purchases
- Body: 1 in 3 previously lost users now converts. Impact compounds over millions of transactions.

**How Lens**:
- Headline: Micro-optimizations at scale
- Body: Reduced form fields from 12 to 6. Added real-time validation. Implemented smart defaults. Removed unnecessary confirmation steps.

---

### Metric 6: Payment Processing Speed
- **Domain**: Product
- **Headline Number**: 3.1
- **Unit**: x
- **Label**: Faster Payment Processing
- **Time Window**: 2024
- **Context Note**: Reduction in average payment confirmation time through async architecture.
- **Confidence Source**: APM metrics

**Outcomes Lens**:
- Headline: Users see confirmation faster
- Body: From 3+ seconds to under 1 second. Reduced timeout-related failures by 60%.

**How Lens**:
- Headline: Async + optimistic UI
- Body: Moved payment confirmation to background jobs. Showed optimistic UI immediately. Added retry logic with exponential backoff.

---

## Engineering Leadership Domain (3 metrics)

### Metric 7: Team Velocity
- **Domain**: Leadership
- **Headline Number**: 2.4
- **Unit**: x
- **Label**: Team Velocity Increase
- **Time Window**: 6 months
- **Delta**: From baseline
- **Context Note**: Story points delivered per sprint after process improvements.
- **Confidence Source**: Jira analytics

**Outcomes Lens**:
- Headline: Team ships faster
- Body: More than doubled delivery capacity without adding headcount. Reduced cycle time from 2 weeks to 4 days.

**How Lens**:
- Headline: Process + tooling + culture
- Body: Introduced trunk-based development. Automated PR reviews. Reduced meeting overhead. Empowered engineers to make decisions.

**Proof Lens**:
- Items:
  - Type: link, Label: Engineering velocity talk, URL: /talks/engineering-without-safety-net, Tag: Talk
  - Type: quote, Quote: "Faris transformed how we ship software", Quote Author: Engineering Director

**Story**: When I joined the team, deploys happened once every two weeks after extensive QA cycles. Fear of breaking things slowed everything down. By introducing feature flags, automated testing, and a culture of small, reversible changes, we unlocked continuous deployment. The team went from dreading releases to shipping multiple times daily.

**Action Links**:
- Type: service, Label: Engineering consulting, URL: /consulting
- Type: talk, Label: Watch related talk, URL: /talks/engineering-without-safety-net

---

### Metric 8: Code Review Time
- **Domain**: Leadership
- **Headline Number**: 75
- **Unit**: percent
- **Label**: Faster Code Reviews
- **Time Window**: 2024
- **Context Note**: Reduction in average PR review time through process improvements.
- **Confidence Source**: GitHub analytics

**Outcomes Lens**:
- Headline: Unblocked developers
- Body: PRs now reviewed within 4 hours on average. Previously 2+ days.

**How Lens**:
- Headline: Review culture + automation
- Body: Established review SLAs. Added automated checks. Created review guidelines. Rotated review duty.

---

### Metric 9: Developer Experience Score
- **Domain**: Leadership
- **Headline Number**: 87
- **Unit**: percent
- **Label**: Developer Satisfaction
- **Time Window**: Q4 2024
- **Context Note**: Team satisfaction with development workflow and tooling.
- **Confidence Source**: Anonymous surveys

**Outcomes Lens**:
- Headline: Engineers enjoy their work
- Body: High satisfaction correlates with retention and quality. Team attrition dropped to near zero.

**How Lens**:
- Headline: Listen and act
- Body: Quarterly DX surveys. Acted on top 3 pain points each quarter. Transparent communication about tradeoffs.

---

## Speaking Domain (3 metrics)

### Metric 10: Talks Delivered
- **Domain**: Speaking
- **Headline Number**: 60
- **Unit**: number
- **Prefix**: +
- **Label**: Talks Delivered
- **Time Window**: Since 2022
- **Delta**: Growing
- **Context Note**: Conference talks, meetups, and workshops across 12+ countries.
- **Confidence Source**: Personal records

**Outcomes Lens**:
- Headline: Knowledge shared globally
- Body: Reached thousands of developers with practical, actionable content. Topics range from React performance to payment systems.

**How Lens**:
- Headline: Say yes, then prepare
- Body: Built a talk pipeline by accepting CFPs early. Refined each talk through multiple deliveries. Gathered feedback systematically.

**Proof Lens**:
- Items:
  - Type: link, Label: All talks, URL: /talks, Tag: Talks
  - Type: link, Label: Speaking reel, URL: /media, Tag: Video
  - Type: link, Label: Upcoming events, URL: /events, Tag: Events

**Story**: Public speaking wasn't natural for me. The first talk was terrifying—25 people, hands shaking, forgetting half my points. But each talk got easier. Now, 60+ talks later, speaking is how I give back to the community that helped me grow. Every audience teaches me something new.

**Action Links**:
- Type: booking, Label: Book me to speak, URL: /invite
- Type: external, Label: View all talks, URL: /talks

---

### Metric 11: Countries Visited
- **Domain**: Speaking
- **Headline Number**: 12
- **Unit**: number
- **Prefix**: +
- **Label**: Countries
- **Time Window**: Speaking career
- **Context Note**: Countries where I've delivered talks or workshops.
- **Confidence Source**: Travel records

**Outcomes Lens**:
- Headline: Global perspective
- Body: Speaking internationally means exposure to diverse engineering cultures and approaches.

**How Lens**:
- Headline: Conference circuit
- Body: Applied to international conferences. Built relationships with organizers. Offered unique topics.

---

### Metric 12: Audience Recommendation Rate
- **Domain**: Speaking
- **Headline Number**: 98
- **Unit**: percent
- **Label**: Would Recommend
- **Time Window**: Last 20 talks
- **Context Note**: Percentage of attendees who would recommend my talks to colleagues.
- **Confidence Source**: Post-talk surveys

**Outcomes Lens**:
- Headline: Talks that resonate
- Body: High recommendation rate means content lands. Leads to repeat invitations and referrals.

**How Lens**:
- Headline: Practical over theoretical
- Body: Every talk includes working code. Focus on "you can do this Monday" takeaways. Tell stories, not just facts.

**Proof Lens**:
- Items:
  - Type: quote, Quote: "Most practical React talk I've attended this year", Quote Author: React Summit attendee
  - Type: link, Label: Speaker feedback, URL: /appreciation, Tag: Testimonials

---

## Usage Notes

### In Sanity Studio:
1. Go to Impact > Impact Metrics (Enhanced) > All Metrics
2. Click "+ New" to create a new metric
3. Fill in the Main fields first (title, domain, number, label)
4. Add Lens Content for all three lenses (required)
5. Add Story and Action Links in the Story tab
6. Set Display settings (featured, order, color)

### Tips:
- Keep context notes under 200 characters
- Stories should be 120-180 words
- Include 2-3 action links maximum
- All three lens blocks are required (even if brief)
- Use specific numbers, not ranges
- Time windows should be consistent format
