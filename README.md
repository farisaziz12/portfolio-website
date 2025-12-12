# faziz-dev.com

Personal portfolio and speaker platform for Faris Aziz - Staff Software Engineer, Conference Speaker & Workshop Instructor.

## Tech Stack

- **Frontend**: [Astro](https://astro.build/) 5.x with React islands
- **CMS**: [Sanity](https://www.sanity.io/) v3 with custom schemas
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom design tokens
- **Monorepo**: pnpm workspaces

## Project Structure

```
/
├── apps/
│   ├── web/                 # Astro website
│   │   ├── src/
│   │   │   ├── components/  # Astro & React components
│   │   │   ├── layouts/     # Page layouts
│   │   │   ├── lib/sanity/  # Sanity client & queries
│   │   │   ├── pages/       # Astro pages
│   │   │   └── styles/      # Global styles
│   │   └── public/          # Static assets
│   └── studio/              # Sanity Studio
│       ├── schemas/         # Content schemas
│       └── desk/            # Desk structure
├── packages/
│   └── shared/              # Shared types & utilities
├── scripts/
│   └── migrate-content.ts   # Content migration script
└── .migration-data/         # Backup of original content
```

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+
- Sanity account (for CMS)

### Installation

```bash
# Clone the repository
git clone https://github.com/farisaziz12/portfolio-website.git
cd portfolio-website

# Install dependencies
pnpm install

# Set up environment variables
cp apps/web/.env.example apps/web/.env
cp apps/studio/.env.example apps/studio/.env
# Edit .env files with your Sanity credentials
```

### Development

```bash
# Start all apps (web + studio)
pnpm dev

# Start only the website
pnpm web

# Start only Sanity Studio
pnpm studio
```

### Building

```bash
# Build all apps
pnpm build

# Build only the website
pnpm --filter web build
```

## Environment Variables

### apps/web/.env

```env
PUBLIC_SANITY_PROJECT_ID=your_project_id
PUBLIC_SANITY_DATASET=production
```

### apps/studio/.env

```env
SANITY_STUDIO_PROJECT_ID=your_project_id
SANITY_STUDIO_DATASET=production
```

### Root (for migration script)

```env
SANITY_PROJECT_ID=your_project_id
SANITY_DATASET=production
SANITY_API_TOKEN=your_write_token
```

## Content Migration

To migrate content from the backup JSON files to Sanity:

```bash
# Set environment variables
export SANITY_PROJECT_ID=your_project_id
export SANITY_DATASET=production
export SANITY_API_TOKEN=your_write_token

# Run migration
pnpm migrate
```

See [CONTENT_GUIDE.md](./CONTENT_GUIDE.md) for detailed content management instructions.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home page with hero, stats, upcoming events |
| `/speaking` | Speaking overview with upcoming/past events |
| `/events` | All events archive |
| `/events/[slug]` | Individual event detail |
| `/talks` | Available talks index |
| `/talks/[slug]` | Talk detail with event history |
| `/workshops` | Workshops index |
| `/workshops/[slug]` | Workshop detail |
| `/invite` | Speaker kit for event organizers |
| `/about` | About page with work experience |
| `/projects` | Projects portfolio |
| `/projects/[slug]` | Project detail |
| `/media` | Photo/video gallery |
| `/blog` | External posts & podcasts |
| `/rss.xml` | RSS feed |

## Sanity Schemas

| Schema | Description |
|--------|-------------|
| `talk` | Canonical talk topics |
| `event` | Speaking event occurrences |
| `workshop` | Workshop offerings |
| `project` | Portfolio projects |
| `company` | Work experience |
| `media` | Gallery photos/videos |
| `testimonial` | Social proof quotes |
| `externalPost` | External articles/podcasts |
| `page` | Editable pages |
| `speakerProfile` | Speaker kit singleton |

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set the root directory to `apps/web`
3. Add environment variables in Vercel dashboard
4. Deploy!

### Sanity Studio

```bash
cd apps/studio
npx sanity deploy
```

## License

MIT
