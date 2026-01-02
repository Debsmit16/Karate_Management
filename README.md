# Karate Tournament Management System (KTMS)

A mobile-first, responsive web application for managing WKF-style karate tournaments from local to national levels.

## Features

### Core Principles (PRD Section 2)
- **Single Source of Truth**: One official result table for all dashboards
- **Automatic Calculation**: System calculates all scores, winners, and rankings
- **Role-Based Authority**: Strict permissions for Admin, Referee, and Coach roles
- **Transparency**: Same data visible to all authorized users

### User Roles

#### Admin / Tournament Committee (PRD Section 3.1)
- Create and manage tournaments
- Create, modify, merge, or delete categories
- Configure scoring rules and team championship settings
- Approve and override results

#### Referee / Judge (PRD Section 3.2)
- Enter Kata scores (5 or 7 judges)
- Control Kumite scoring (points, penalties, timer)
- End matches and finalize results
- Cannot edit categories or modify finalized results

#### Coach (PRD Section 3.3)
- Create and manage their dojo/team
- Add students/athletes
- Track matches, scores, medals, and team rankings (read-only)
- View official results synchronized in real-time

### Scoring Systems

#### Kata Scoring (PRD Section 5)
- Configurable: 5 or 7 judges
- Automatic calculation: removes highest and lowest scores, sums remaining
- Real-time score updates
- Role-based visibility (judges see input only, coaches see final score)

#### Kumite Scoring (PRD Section 6)
- Point system: Yuko (1), Waza-ari (2), Ippon (3)
- Match timer with age-based duration
- Automatic win conditions:
  - 8-point lead
  - Time up (higher score wins)
  - Senshu (first score advantage) if enabled
  - Disqualification handling

### Team Championship (PRD Section 8)
- Optional per tournament
- Configurable point values (default: Gold=3, Silver=2, Bronze=1)
- Real-time team leaderboard
- Auto-calculation of team points
- Tie-break logic: more gold → more silver → more bronze

### Official Results (PRD Section 7)
- Single official result table per category
- Automatic medal assignment (Gold, Silver, Bronze)
- Auto-synchronization across all dashboards
- Status tracking: pending, official, corrected

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for mobile-first responsive design
- **Zustand** for state management
- **React Router** for navigation
- **date-fns** for date formatting

### Backend & Database
- **Supabase** for backend-as-a-service
  - PostgreSQL database
  - Real-time subscriptions
  - Row Level Security (RLS)
  - Authentication & authorization
  - RESTful API auto-generated

## Getting Started

### Quick Start (10 minutes)

See [QUICK_START.md](./QUICK_START.md) for a step-by-step guide.

### Prerequisites
- Node.js 18+ and npm/yarn
- A Supabase account (free tier available)

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up Supabase**:
   - Create a project at [supabase.com](https://supabase.com)
   - Get your API keys from Settings → API
   - Run database migrations (see [DEPLOYMENT.md](./DEPLOYMENT.md))

3. **Configure environment**:
   ```bash
   cp env.example .env
   # Edit .env with your Supabase credentials
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```

The application will be available at `http://localhost:3000`

### Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions including:
- Vercel deployment
- Netlify deployment
- Self-hosting options
- Environment variable configuration

## Mobile-First Design

The application is built with a mobile-first approach:
- Base styles optimized for mobile devices
- Responsive breakpoints: `sm:` (640px+), `lg:` (1024px+)
- Touch-friendly buttons and inputs
- Optimized layouts for small screens
- Progressive enhancement for larger screens

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx
│   └── TeamLeaderboard.tsx
├── pages/              # Page components
│   ├── Login.tsx
│   ├── AdminDashboard.tsx
│   ├── RefereeDashboard.tsx
│   ├── CoachDashboard.tsx
│   ├── TournamentDetail.tsx
│   ├── CategoryDetail.tsx
│   └── MatchScoring.tsx
├── store/              # State management
│   ├── useStore.ts     # Legacy in-memory store (for reference)
│   ├── useSupabaseStore.ts  # Supabase-backed store
│   └── useAuthStore.ts      # Authentication store
├── lib/                # External library configurations
│   ├── supabase.ts     # Supabase client
│   └── database.types.ts # Database type definitions
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   ├── scoring.ts
│   └── results.ts
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── index.css           # Global styles (Tailwind)

supabase/
└── migrations/          # Database migrations
    ├── 001_initial_schema.sql
    ├── 002_rls_policies.sql
    └── 003_functions_and_triggers.sql
```

## PRD Compliance

This implementation strictly follows the Product Requirements Document (PRD):
- All features from PRD Sections 1-14 are implemented
- Role-based permissions enforced
- Automatic calculations as specified
- Single source of truth for results
- Mobile-first responsive design

## Future Enhancements (Out of Scope - PRD Section 13)

- Video judging
- AI judging
- Season-long rankings
- Athlete health analytics

## Database Schema

The application uses PostgreSQL via Supabase with the following main tables:

- **users**: User accounts with roles (admin, referee, coach)
- **tournaments**: Tournament information
- **categories**: Competition categories
- **athletes**: Athlete profiles
- **teams**: Dojo/club teams
- **matches**: Match records
- **kata_scores**: Kata scoring data
- **kumite_matches**: Kumite match data
- **official_results**: Single source of truth for results (PRD Section 7)
- **tournament_rules**: Tournament configuration

All tables have Row Level Security (RLS) enabled to enforce role-based access control.

## Security

- **Row Level Security (RLS)**: Database-level access control
- **Role-based permissions**: Enforced at database and application level
- **Secure authentication**: Supabase Auth with JWT tokens
- **Environment variables**: Sensitive data stored securely

## Documentation

- [QUICK_START.md](./QUICK_START.md) - Get started in 10 minutes
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Complete deployment guide
- [prd.md](./prd.md) - Product Requirements Document

## License

This project is for tournament management use.

