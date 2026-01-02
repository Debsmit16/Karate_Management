# Deployment Guide - Karate Tournament Management System

This guide will walk you through setting up Supabase backend, configuring the database, and deploying the application.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Supabase Setup](#supabase-setup)
3. [Database Configuration](#database-configuration)
4. [Local Development Setup](#local-development-setup)
5. [Deployment Options](#deployment-options)
6. [Environment Variables](#environment-variables)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- Node.js 18+ and npm/yarn installed
- A Supabase account (free tier available at [supabase.com](https://supabase.com))
- Git (for version control)
- A deployment platform account (Vercel, Netlify, or similar)

---

## Supabase Setup

### Step 1: Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in:
   - **Organization**: Select or create one
   - **Name**: `karate-tournament-management` (or your preferred name)
   - **Database Password**: Create a strong password (save it securely!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is sufficient for development
4. Click "Create new project"
5. Wait 2-3 minutes for project initialization

### Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

These will be your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

---

## Database Configuration

### Step 3: Run Database Migrations

You have two options to set up the database schema:

#### Option A: Using Supabase SQL Editor (Recommended for beginners)

1. In Supabase dashboard, go to **SQL Editor**
2. Open the file `supabase/migrations/001_initial_schema.sql`
3. Copy the entire contents
4. Paste into the SQL Editor
5. Click "Run" (or press Ctrl+Enter)
6. Repeat for `supabase/migrations/002_rls_policies.sql`
7. Repeat for `supabase/migrations/003_functions_and_triggers.sql`

#### Option B: Using Supabase CLI (Advanced)

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### Step 4: Verify Database Setup

1. Go to **Table Editor** in Supabase dashboard
2. You should see these tables:
   - `users`
   - `teams`
   - `athletes`
   - `tournaments`
   - `categories`
   - `category_participants`
   - `matches`
   - `kata_scores`
   - `kumite_matches`
   - `official_results`
   - `tournament_rules`

### Step 5: Configure Authentication

1. Go to **Authentication** → **Settings** in Supabase dashboard
2. Enable **Email** provider (should be enabled by default)
3. Configure email templates if needed
4. Set **Site URL** to your deployment URL (or `http://localhost:3000` for local dev)

---

## Local Development Setup

### Step 6: Install Dependencies

```bash
npm install
```

### Step 7: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **Important**: Never commit `.env` to Git (it's already in `.gitignore`)

### Step 8: Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Step 9: Create Your First User

1. Open the app in your browser
2. Click "Sign Up"
3. Fill in:
   - Name: Your name
   - Email: Your email
   - Password: (min 6 characters)
   - Role: Select "Admin" for full access
4. Click "Sign Up"
5. Check your email for verification (if email confirmation is enabled)
6. Sign in with your credentials

---

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel offers excellent React/Vite support and free hosting.

#### Steps:

1. **Install Vercel CLI** (optional):
   ```bash
   npm install -g vercel
   ```

2. **Deploy via Vercel Dashboard**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Click "New Project"
   - Import your Git repository
   - Configure:
     - **Framework Preset**: Vite
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Install Command**: `npm install`

3. **Add Environment Variables**:
   - In Vercel project settings → **Environment Variables**
   - Add:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
   - Click "Save"

4. **Deploy**:
   - Vercel will automatically deploy on every push to main branch
   - Or click "Deploy" to deploy immediately

5. **Update Supabase Site URL**:
   - In Supabase dashboard → **Authentication** → **URL Configuration**
   - Add your Vercel URL to **Redirect URLs**

#### Deploy via CLI:

```bash
vercel
```

Follow the prompts and add environment variables when asked.

---

### Option 2: Netlify

#### Steps:

1. Go to [netlify.com](https://netlify.com)
2. Sign up/login
3. Click "Add new site" → "Import an existing project"
4. Connect your Git repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Add environment variables in **Site settings** → **Environment variables**
7. Deploy

---

### Option 3: GitHub Pages

1. Update `vite.config.ts`:
   ```typescript
   export default defineConfig({
     base: '/your-repo-name/',
     // ... rest of config
   })
   ```

2. Install GitHub Pages plugin:
   ```bash
   npm install --save-dev gh-pages
   ```

3. Add to `package.json`:
   ```json
   {
     "scripts": {
       "deploy": "npm run build && gh-pages -d dist"
     }
   }
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

**Note**: GitHub Pages doesn't support server-side environment variables. You'll need to use a different approach for secrets.

---

### Option 4: Self-Hosted (VPS/Server)

1. Build the application:
   ```bash
   npm run build
   ```

2. The `dist` folder contains static files
3. Serve with any static file server:
   - **Nginx**: Configure to serve `dist` folder
   - **Apache**: Point DocumentRoot to `dist`
   - **Node.js**: Use `serve` package:
     ```bash
     npm install -g serve
     serve -s dist -l 3000
     ```

---

## Environment Variables

### Required Variables

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key | Supabase Dashboard → Settings → API |

### Optional Variables

| Variable | Description | When to Use |
|----------|-------------|-------------|
| `VITE_APP_URL` | Your application URL | For email links, redirects |

### Security Notes

- ✅ **Safe to expose**: `VITE_SUPABASE_ANON_KEY` (it's public by design)
- ❌ **Never expose**: Service role key (only for server-side)
- ✅ **Safe**: `VITE_SUPABASE_URL` (public endpoint)

---

## Post-Deployment Checklist

- [ ] Database migrations applied successfully
- [ ] Environment variables configured
- [ ] Authentication working (sign up/sign in)
- [ ] Row Level Security (RLS) policies active
- [ ] Can create tournaments (admin role)
- [ ] Can create categories (admin role)
- [ ] Can score matches (referee role)
- [ ] Can view results (coach role)
- [ ] Supabase redirect URLs updated
- [ ] Email verification configured (optional)

---

## Troubleshooting

### Issue: "Invalid API key" or "Failed to fetch"

**Solution**:
- Verify environment variables are set correctly
- Check Supabase project is active
- Ensure `.env` file exists in project root
- Restart development server after changing `.env`

### Issue: "Row Level Security policy violation"

**Solution**:
- Verify RLS policies are applied (run `002_rls_policies.sql`)
- Check user role in `users` table matches expected role
- Ensure user is authenticated (check Supabase Auth)

### Issue: "Cannot read property of undefined"

**Solution**:
- Check database tables exist
- Verify migrations ran successfully
- Check browser console for detailed errors

### Issue: Authentication not working

**Solution**:
- Check Supabase Authentication settings
- Verify email provider is enabled
- Check Site URL in Supabase matches your app URL
- Clear browser cache and cookies

### Issue: Build fails on deployment

**Solution**:
- Verify all environment variables are set in deployment platform
- Check build logs for specific errors
- Ensure Node.js version is 18+ in deployment settings
- Verify `package.json` scripts are correct

---

## Database Backup & Maintenance

### Backup Database

1. In Supabase dashboard → **Database** → **Backups**
2. Create manual backup before major changes
3. Automatic daily backups available on paid plans

### Monitor Usage

- Supabase Dashboard → **Project Settings** → **Usage**
- Free tier includes:
  - 500 MB database
  - 2 GB bandwidth
  - 50,000 monthly active users

### Scale Up

When you need more resources:
1. Go to Supabase Dashboard → **Settings** → **Billing**
2. Upgrade to Pro plan ($25/month) for:
   - 8 GB database
   - 50 GB bandwidth
   - Better performance

---

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Router Deployment](https://reactrouter.com/en/main/start/deploying)

---

## Support

If you encounter issues:

1. Check Supabase logs: Dashboard → **Logs**
2. Check browser console for errors
3. Review deployment platform logs
4. Verify all steps in this guide were followed

---

## Next Steps

After deployment:

1. **Create admin user**: Sign up with admin role
2. **Configure tournament rules**: Set up default scoring rules
3. **Add teams**: Coaches can create their teams
4. **Test scoring**: Create a test tournament and score matches
5. **Invite users**: Share sign-up link with referees and coaches

---

**Congratulations!** Your Karate Tournament Management System is now live! 🥋

