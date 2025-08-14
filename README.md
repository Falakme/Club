# The Falak Club

A modern web application for club, event, and project management, built with React, TypeScript, Vite, and Tailwind CSS.

## Features
- User authentication and profile management
- Admin dashboard for managing users, events, and projects
- Event RSVP and upcoming events listing
- Project showcase and submission
- Achievement tracking
- Mobile-friendly navigation

## Tech Stack
- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS, PostCSS
- **Backend/DB:** Supabase (see `src/lib/supabase.ts`)

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Lint
```bash
npm run lint
```

## Project Structure
```
project/
├── src/
│   ├── components/         # Reusable React components
│   ├── pages/              # Page components (routing)
│   ├── lib/                # Supabase client and utilities
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── public/                 # Static assets
├── index.html              # HTML template
├── package.json            # Project metadata and scripts
├── tailwind.config.js      # Tailwind CSS config
├── vite.config.ts          # Vite config
└── setup.sql               # Database setup (for Supabase)
```

## Database
- The `setup.sql` file contains the schema for Supabase/Postgres setup.

## Environment Variables
Create a `.env` file in the root with your Supabase credentials:
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## License
MIT
