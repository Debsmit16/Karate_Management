# Deployment Steps - Follow These Instructions

## ✅ What's Already Done

- ✅ Git repository initialized
- ✅ Code committed
- ✅ Vercel configuration file created (`vercel.json`)
- ✅ Vercel CLI installed

## 🚀 Deploy Now (Choose One Method)

### Method 1: Vercel CLI (Fastest - 5 minutes)

**Step 1: Login to Vercel**
```bash
vercel login
```
- Choose "Continue with GitHub" (or your preferred method)
- Complete authentication in browser

**Step 2: Deploy**
```bash
vercel
```
- When prompted:
  - "Set up and deploy?": **Yes**
  - "Which scope?": Select your account
  - "Link to existing project?": **No**
  - "Project name?": `karate-tournament-management` (or press Enter)
  - "Directory?": `./` (press Enter)
  - "Override settings?": **No**

**Step 3: Add Environment Variables**
```bash
vercel env add VITE_SUPABASE_URL
# When prompted, paste: https://orokrcisrptwteoqijbs.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY
# When prompted, paste: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yb2tyY2lzcnB0d3Rlb3FpamJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczODMyMDYsImV4cCI6MjA4Mjk1OTIwNn0.QOxvUTrQ-0ZHBjou9L86FIs6dO1C3-_iQ5Ibre6vbVY

# For each, select: Production, Preview, Development (all three)
```

**Step 4: Deploy to Production**
```bash
vercel --prod
```

**Done!** Your app will be live at: `https://your-project.vercel.app`

---

### Method 2: GitHub + Vercel Dashboard (Recommended for beginners)

**Step 1: Push to GitHub**

1. Create a new repository on GitHub:
   - Go to https://github.com/new
   - Name: `karate-tournament-management`
   - Make it Public or Private
   - **Don't** initialize with README
   - Click "Create repository"

2. Push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/karate-tournament-management.git
   git branch -M main
   git push -u origin main
   ```

**Step 2: Deploy on Vercel**

1. Go to https://vercel.com
2. Sign up/Login (use GitHub)
3. Click "Add New" → "Project"
4. Import your repository
5. Vercel will auto-detect settings (Vite)
6. **Add Environment Variables**:
   - Click "Environment Variables"
   - Add:
     - Name: `VITE_SUPABASE_URL`
     - Value: `https://orokrcisrptwteoqijbs.supabase.co`
     - Select: Production, Preview, Development
   - Add:
     - Name: `VITE_SUPABASE_ANON_KEY`
     - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yb2tyY2lzcnB0d3Rlb3FpamJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczODMyMDYsImV4cCI6MjA4Mjk1OTIwNn0.QOxvUTrQ-0ZHBjou9L86FIs6dO1C3-_iQ5Ibre6vbVY`
     - Select: Production, Preview, Development
7. Click "Deploy"
8. Wait 2-3 minutes

**Done!** Your app will be live!

---

## 🔧 After Deployment

### Update Supabase Settings

1. Go to: https://app.supabase.com/project/orokrcisrptwteoqijbs
2. Settings → Authentication → URL Configuration
3. Add your Vercel URL:
   - **Site URL**: `https://your-project.vercel.app`
   - **Redirect URLs**: `https://your-project.vercel.app/**`
4. Save

### Test Your Deployment

1. Visit your live URL
2. Sign up as an admin user
3. Create a test tournament
4. Verify all features work

---

## 🐛 Troubleshooting

**Build fails?**
- Check Vercel build logs
- Ensure all dependencies are in `package.json`
- Verify environment variables are set correctly

**Authentication not working?**
- Check Supabase redirect URLs
- Verify environment variables in Vercel

**404 errors on routes?**
- `vercel.json` should handle this (already configured)
- If issues persist, check Vite base path

---

## 📝 Quick Commands Reference

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View deployments
vercel ls

# View logs
vercel logs
```

---

**Need more help?** See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed guide.

