# Quick Start Guide

Get your Karate Tournament Management System running in 10 minutes!

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free at [supabase.com](https://supabase.com))

## Step-by-Step Setup

### 1. Clone/Download the Project

```bash
# If using Git
git clone <your-repo-url>
cd karate-tournament-management

# Or extract the ZIP file
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Supabase Project

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in project details
4. Wait for project to initialize (~2 minutes)

### 4. Get API Keys

1. In Supabase dashboard → **Settings** → **API**
2. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`

### 5. Set Up Database

1. In Supabase dashboard → **SQL Editor**
2. Copy contents of `supabase/migrations/001_initial_schema.sql`
3. Paste and click "Run"
4. Repeat for `002_rls_policies.sql`
5. Repeat for `003_functions_and_triggers.sql`

### 6. Configure Environment

```bash
# Copy example file
cp env.example .env

# Edit .env and add your Supabase credentials
# VITE_SUPABASE_URL=https://xxxxx.supabase.co
# VITE_SUPABASE_ANON_KEY=eyJ...
```

### 7. Start Development Server

```bash
npm run dev
```

### 8. Create Your First User

1. Open `http://localhost:3000`
2. Click "Sign Up"
3. Fill in details (use "Admin" role for full access)
4. Sign in

### 9. Test the System

1. **As Admin**:
   - Create a tournament
   - Create a category
   - Add participants

2. **As Referee**:
   - View assigned matches
   - Score matches

3. **As Coach**:
   - Create a team
   - Add athletes
   - View results

## Common Issues

**"Invalid API key"**
- Check `.env` file exists and has correct values
- Restart dev server after changing `.env`

**"Policy violation"**
- Make sure you ran all 3 SQL migration files
- Check user role in database

**"Cannot connect"**
- Verify Supabase project is active
- Check internet connection
- Verify API keys are correct

## Next Steps

- Read [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
- Check [README.md](./README.md) for feature documentation

## Need Help?

- Check Supabase dashboard → **Logs** for errors
- Review browser console for client-side errors
- Verify all migration files ran successfully

---

**You're all set!** Start managing your karate tournaments! 🥋

