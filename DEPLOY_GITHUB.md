# Deploy from GitHub Repository

Your code is now on GitHub: https://github.com/Debsmit16/Karate_Management

## 🚀 Deploy to Vercel (5 minutes)

### Step 1: Go to Vercel

1. Visit: https://vercel.com
2. Sign up/Login (use GitHub - it's easiest)

### Step 2: Import Your Repository

1. Click **"Add New"** → **"Project"**
2. You'll see your repositories listed
3. Find **"Karate_Management"** and click **"Import"**

### Step 3: Configure Project

Vercel will auto-detect:
- ✅ Framework: Vite
- ✅ Build Command: `npm run build`
- ✅ Output Directory: `dist`

**Just click "Deploy"** - the defaults are perfect!

### Step 4: Add Environment Variables (IMPORTANT!)

**Before the first deployment completes**, or right after:

1. In your Vercel project, go to **Settings** → **Environment Variables**
2. Add these two variables:

   **Variable 1:**
   - Name: `VITE_SUPABASE_URL`
   - Value: `https://orokrcisrptwteoqijbs.supabase.co`
   - Environments: ✅ Production, ✅ Preview, ✅ Development

   **Variable 2:**
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yb2tyY2lzcnB0d3Rlb3FpamJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczODMyMDYsImV4cCI6MjA4Mjk1OTIwNn0.QOxvUTrQ-0ZHBjou9L86FIs6dO1C3-_iQ5Ibre6vbVY`
   - Environments: ✅ Production, ✅ Preview, ✅ Development

3. Click **"Save"**

### Step 5: Redeploy (if needed)

If you added env vars after first deploy:
- Go to **Deployments** tab
- Click the **"..."** menu on the latest deployment
- Click **"Redeploy"**

### Step 6: Update Supabase Settings

1. Go to: https://app.supabase.com/project/orokrcisrptwteoqijbs
2. **Settings** → **Authentication** → **URL Configuration**
3. Add your Vercel URL:
   - **Site URL**: `https://your-project.vercel.app` (you'll get this from Vercel)
   - **Redirect URLs**: `https://your-project.vercel.app/**`
4. **Save**

## ✅ Done!

Your app will be live at: `https://your-project.vercel.app`

## 🔄 Future Updates

Every time you push to GitHub:
```bash
git add .
git commit -m "Your commit message"
git push
```

Vercel will **automatically deploy** your changes! 🎉

## 📝 Quick Commands

```bash
# Check status
git status

# Push updates
git add .
git commit -m "Update description"
git push

# View your repo
# https://github.com/Debsmit16/Karate_Management
```

---

**Need help?** Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed troubleshooting.

