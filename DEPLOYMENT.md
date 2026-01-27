# RouteCare Deployment Guide

## GitHub Setup

### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Click "New repository" or go to https://github.com/new
3. Repository settings:
   - **Repository name**: `routecare-nemt` (or your preferred name)
   - **Description**: "RouteCare NEMT Dispatch System - Monorepo"
   - **Visibility**: Choose Private or Public
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Click "Create repository"

### Step 2: Push Code to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
git remote add origin https://github.com/YOUR_USERNAME/routecare-nemt.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username and `routecare-nemt` with your chosen repository name.

---

## Vercel Deployment

### Prerequisites
- GitHub account (already set up above)
- Vercel account (free tier works perfectly)

### Deploy Dispatcher App

1. **Go to Vercel**: https://vercel.com/new
2. **Import Git Repository**:
   - Click "Import Git Repository"
   - Select your GitHub account
   - Choose the `routecare-nemt` repository
3. **Configure Project**:
   - **Project Name**: `routecare-dispatcher`
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/dispatcher` ← **IMPORTANT**
   - **Build Command**: Leave default (`npm run build`)
   - **Output Directory**: Leave default (`.next`)
   - **Install Command**: `cd ../.. && npm install` ← **IMPORTANT for monorepo**
4. **Environment Variables**: None needed for now (using mock data)
5. **Deploy**: Click "Deploy"

### Deploy Driver App

1. **Return to Vercel Dashboard**: https://vercel.com/new
2. **Import the Same Repository** again
3. **Configure Project**:
   - **Project Name**: `routecare-driver`
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/driver` ← **IMPORTANT**
   - **Build Command**: Leave default (`npm run build`)
   - **Output Directory**: Leave default (`.next`)
   - **Install Command**: `cd ../.. && npm install` ← **IMPORTANT for monorepo**
4. **Deploy**: Click "Deploy"

---

## After Deployment

### Your Live URLs

Once deployed, you'll get two URLs:
- **Dispatcher App**: `https://routecare-dispatcher.vercel.app`
- **Driver App**: `https://routecare-driver.vercel.app`

### Custom Domains (Optional)

If you have a custom domain:
1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add your domain (e.g., `dispatcher.routecare.com`, `driver.routecare.com`)
4. Follow DNS configuration instructions

---

## Troubleshooting

### Build Fails with "Cannot find module '@routecare/shared'"

**Solution**: Make sure the Install Command is set to `cd ../.. && npm install`

This ensures npm installs workspace dependencies from the monorepo root.

### TypeScript Errors During Build

**Solution**: Vercel uses strict TypeScript checking. Run locally first:
```bash
npm run type-check
```

Fix any errors before deploying.

### Different Behavior on Vercel vs Local

**Solution**:
- Vercel uses production builds (`npm run build`)
- Local uses development mode (`npm run dev`)
- Test production build locally:
```bash
npm run build --workspace=dispatcher
cd apps/dispatcher && npm start
```

---

## Continuous Deployment

Once connected to GitHub, Vercel automatically:
- ✅ Deploys on every push to `main` branch
- ✅ Creates preview deployments for pull requests
- ✅ Runs build checks before deployment

---

## Monitoring

### View Deployments
- Dispatcher: https://vercel.com/YOUR_USERNAME/routecare-dispatcher
- Driver: https://vercel.com/YOUR_USERNAME/routecare-driver

### Analytics (Free)
Vercel provides:
- Web vitals (performance metrics)
- Traffic analytics
- Error logs
- Build logs

---

## Next Steps

Once deployed:
1. ✅ Test both apps on Vercel URLs
2. ✅ Share URLs with team/stakeholders
3. 🔜 Add backend API (Phase 1-8)
4. 🔜 Replace mock data with real API calls
5. 🔜 Add authentication
6. 🔜 Configure environment variables for production

---

## Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Monorepo Guide**: https://vercel.com/docs/monorepos
