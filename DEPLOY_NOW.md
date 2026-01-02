# Quick Deployment Guide

## Option 1: Deploy to Vercel (Recommended - 5 minutes)

### Step 1: Push to GitHub

1. **Create a GitHub repository**:
   - Go to https://github.com/new
   - Name it: `karate-tournament-management`
   - Make it **Public** or **Private** (your choice)
   - Don't initialize with README
   - Click "Create repository"

2. **Push your code**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/karate-tournament-management.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy on Vercel

1. **Go to Vercel**:
   - Visit https://vercel.com
   - Sign up/Login with GitHub

2. **Import Project**:
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite settings

3. **Configure Environment Variables**:
   - In project settings, go to "Environment Variables"
   - Add these two:
     ```
     VITE_SUPABASE_URL = https://orokrcisrptwteoqijbs.supabase.co
     VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yb2tyY2lzcnB0d3Rlb3FpamJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczODMyMDYsImV4cCI6MjA4Mjk1OTIwNn0.QOxvUTrQ-0ZHBjou9L86FIs6dO1C3-_iQ5Ibre6vbVY
     ```

4. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app will be live at: `https://your-project.vercel.app`

### Step 3: Update Supabase Settings

1. **Go to Supabase Dashboard**:
   - https://app.supabase.com/project/orokrcisrptwteoqijbs
   - Settings → Authentication → URL Configuration

2. **Add your Vercel URL**:
   - Site URL: `https://your-project.vercel.app`
   - Redirect URLs: `https://your-project.vercel.app/**`

3. **Save**

---

## Option 2: Deploy to Netlify

### Step 1: Push to GitHub (same as above)

### Step 2: Deploy on Netlify

1. Go to https://netlify.com
2. Sign up/Login with GitHub
3. Click "Add new site" → "Import an existing project"
4. Select your repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Add environment variables (same as Vercel)
7. Deploy

---

## Option 3: Deploy via Vercel CLI (Alternative)

If you prefer command line:

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name? karate-tournament-management
# - Directory? ./
# - Override settings? No

# Add environment variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY

# Redeploy with env vars
vercel --prod
```

---

## After Deployment

1. ✅ Test your live site
2. ✅ Sign up as admin user
3. ✅ Create a test tournament
4. ✅ Verify all features work

---

## Troubleshooting

**Build fails?**
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify environment variables are set

**Authentication not working?**
- Check Supabase redirect URLs are set correctly
- Verify environment variables in Vercel match your `.env`

**404 errors on routes?**
- Vercel.json should handle this (already configured)
- If issues persist, check Vite base path

---

**Need help?** Check the full [DEPLOYMENT.md](./DEPLOYMENT.md) guide.

