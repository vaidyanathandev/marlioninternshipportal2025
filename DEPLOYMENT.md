# Marlion Winter Internship 2025 Platform - Deployment Guide

Complete production deployment guide for DigitalOcean App Platform.

## 📋 Prerequisites

- DigitalOcean account
- GitHub repository connected
- Convex account (deployed)
- Clerk account (configured)

## 🏗️ Architecture Overview

This is a Turborepo monorepo with:
- **apps/user** - Student-facing app (Port 3000 → 8080 in prod)
- **apps/admin** - Admin dashboard (Port 3001 → 8080 in prod)
- **packages/** - Shared UI, types, configs
- **convex/** - Backend (deployed separately)

## 🚀 Step-by-Step Deployment

### 1. Deploy Convex Backend

```bash
# From project root
cd convex
npx convex deploy --prod

# Save the production URL (e.g., https://your-prod.convex.cloud)
```

Update production URL in:
- `apps/user/.env.local`
- `apps/admin/.env.local`

### 2. Configure Clerk for Production

In Clerk Dashboard (https://dashboard.clerk.com):

1. **Add Production Domains:**
   - Go to Settings → Domains
   - Add your DigitalOcean app URLs:
     - `marlion-student-app.ondigitalocean.app`
     - `marlion-admin-app.ondigitalocean.app`

2. **Update Redirect URLs:**
   - Allowed redirect URLs: `https://marlion-student-app.ondigitalocean.app/*`
   - Allowed redirect URLs: `https://marlion-admin-app.ondigitalocean.app/*`

3. **Note your production keys** (if different from test)

### 3. Create DigitalOcean App - Student App

#### Via DigitalOcean Console (Manual):

1. Go to: https://cloud.digitalocean.com/apps
2. Click "Create App"
3. **Source:**
   - GitHub Repository: `vaidyanathandev/marlioninternshipportal2025`
   - Branch: `main` (or your production branch)
   - Source Directory: `/`

4. **Build Settings:**
   ```yaml
   Name: marlion-student-app
   Region: Bangalore (BLR1)
   Build Command: cd apps/user && npm install && npm run build
   Run Command: cd apps/user && npm start
   HTTP Port: 8080
   Environment: Node.js 18.x
   Instance Size: Basic ($5/month)
   ```

5. **Environment Variables:**
   ```bash
   # Convex
   CONVEX_DEPLOYMENT=https://your-prod-deployment.convex.cloud
   NEXT_PUBLIC_CONVEX_URL=https://your-prod-deployment.convex.cloud

   # Clerk
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_c3VubnktZ3JpZmZvbi00MC5jbGVyay5hY2NvdW50cy5kZXYk
   CLERK_SECRET_KEY=sk_test_acdXitSZOOfSU9AwXHUnUDHLcTowTI5H0T8naYR3cw
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/interview

   # App
   NODE_ENV=production
   NEXT_PUBLIC_APP_URL=https://marlion-student-app.ondigitalocean.app
   ```

6. **Custom Domain (Optional):**
   - Add custom domain: `internship.marliontech.com`
   - Configure DNS CNAME: `marlion-student-app.ondigitalocean.app`

7. Click **"Create Resources"**

#### Via App Spec YAML (Infrastructure as Code):

Create `.do/student-app.yaml`:

```yaml
name: marlion-student-app
region: blr

services:
  - name: student
    github:
      repo: vaidyanathandev/marlioninternshipportal2025
      branch: main
      deploy_on_push: true
    source_dir: /
    build_command: cd apps/user && npm install && npm run build
    run_command: cd apps/user && npm start
    http_port: 8080
    instance_count: 1
    instance_size_slug: basic-xxs
    routes:
      - path: /
    envs:
      - key: CONVEX_DEPLOYMENT
        value: https://your-prod.convex.cloud
      - key: NEXT_PUBLIC_CONVEX_URL
        value: https://your-prod.convex.cloud
      - key: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
        value: pk_test_c3VubnktZ3JpZmZvbi00MC5jbGVyay5hY2NvdW50cy5kZXYk
      - key: CLERK_SECRET_KEY
        value: sk_test_acdXitSZOOfSU9AwXHUnUDHLcTowTI5H0T8naYR3cw
        type: SECRET
      - key: NODE_ENV
        value: production
      - key: NEXT_PUBLIC_APP_URL
        value: https://marlion-student-app.ondigitalocean.app
```

Deploy:
```bash
doctl apps create --spec .do/student-app.yaml
```

### 4. Create DigitalOcean App - Admin App

Repeat the same process as Student App with these changes:

**Build/Run Commands:**
```bash
Build: cd apps/admin && npm install && npm run build
Run: cd apps/admin && npm start
```

**Environment Variables:**
```bash
# Same as student app, plus:
ADMIN_EMAILS=admin@marliontech.com,social@marliontech.com
NEXT_PUBLIC_APP_URL=https://marlion-admin-app.ondigitalocean.app
```

**Custom Domain (Optional):**
- `admin.marliontech.com`

### 5. Configure Environment in Convex

In Convex Dashboard:
1. Go to Settings → Environment Variables
2. Add:
   ```
   DO_AI_API_KEY=sk-do--LMZmnIi-nmJHmVUJTs3p0RyTkQeArAcfoCdCLtFaXMRnPX-AkgIow7QMC
   ```

### 6. Verify Deployment

**Student App:**
```bash
curl https://marlion-student-app.ondigitalocean.app/api/health
# Should return 200 OK
```

**Admin App:**
```bash
curl https://marlion-admin-app.ondigitalocean.app/api/health
# Should return 200 OK
```

**Test Full Flow:**
1. Visit student app → Register
2. Complete interview
3. Login to admin → Review interview
4. Select student → Download offer letter
5. Student completes bootcamp → Download certificate

## 📊 Monitoring & Logs

### View Logs:

```bash
# Install doctl CLI
brew install doctl  # macOS
snap install doctl  # Linux

# Authenticate
doctl auth init

# View student app logs
doctl apps logs <student-app-id> --type=run --follow

# View admin app logs
doctl apps logs <admin-app-id> --type=run --follow
```

### Health Endpoints:

Add these to each app for monitoring:

**apps/user/app/api/health/route.ts:**
```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    app: 'student',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
}
```

**apps/admin/app/api/health/route.ts:**
```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    app: 'admin',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
}
```

## 🔄 CI/CD Setup

### GitHub Actions (Optional):

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to DigitalOcean

on:
  push:
    branches: [main]

jobs:
  deploy-student:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install doctl
        uses: digitalocean/action-doctl@v2
        with:
          token: ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }}

      - name: Deploy Student App
        run: doctl apps create-deployment ${{ secrets.STUDENT_APP_ID }} --wait

  deploy-admin:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install doctl
        uses: digitalocean/action-doctl@v2
        with:
          token: ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }}

      - name: Deploy Admin App
        run: doctl apps create-deployment ${{ secrets.ADMIN_APP_ID }} --wait
```

**GitHub Secrets:**
- `DIGITALOCEAN_ACCESS_TOKEN`: From DO Settings → API
- `STUDENT_APP_ID`: Student app UUID from DO dashboard
- `ADMIN_APP_ID`: Admin app UUID from DO dashboard

## 💰 Cost Estimation

**DigitalOcean:**
- Student App: $5/month (Basic tier)
- Admin App: $5/month (Basic tier)
- **Total: $10/month**

**Convex:**
- Free tier: 1GB storage, 1M function calls/month
- Pro tier (if needed): $25/month

**DigitalOcean AI:**
- Pay-per-token: ~$0.0001 per 1K tokens
- Estimated: $10-50/month (depends on usage)

**Total Monthly Cost: ~$20-85/month**

## 🔧 Troubleshooting

### Build Fails:

**Error: Module not found**
```bash
# Ensure all dependencies are in package.json
npm install
turbo run build
```

**Error: Next.js cache issues**
```bash
# Clear .next folders
rm -rf apps/user/.next
rm -rf apps/admin/.next
npm run build
```

### Convex Connection Error:

```bash
# Verify environment variable
echo $NEXT_PUBLIC_CONVEX_URL
# Should match production URL

# Test Convex deployment
npx convex dev  # Should connect successfully
```

### Clerk Authentication Issues:

1. Check redirect URLs in Clerk dashboard
2. Verify NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is set
3. Clear browser cookies and retry

### App Crashes:

```bash
# Check logs
doctl apps logs <app-id> --type=run

# Common issues:
# - Missing environment variable
# - Port mismatch (must be 8080)
# - Build command incorrect
```

## 📚 Additional Resources

- **DigitalOcean Docs:** https://docs.digitalocean.com/products/app-platform/
- **Convex Docs:** https://docs.convex.dev/
- **Clerk Docs:** https://clerk.com/docs
- **Next.js Deployment:** https://nextjs.org/docs/deployment

## 🎉 Success Checklist

- [ ] Convex deployed to production
- [ ] Student app deployed and accessible
- [ ] Admin app deployed and accessible
- [ ] Clerk authentication working
- [ ] All environment variables set correctly
- [ ] SSL certificates active (green padlock)
- [ ] Health endpoints returning 200 OK
- [ ] Test registration flow end-to-end
- [ ] Test admin features
- [ ] Mobile responsive on real devices
- [ ] CI/CD pipeline configured (optional)

## 📞 Support

For deployment issues:
- **DigitalOcean:** https://www.digitalocean.com/support
- **Convex:** https://convex.dev/community
- **Project Issues:** https://github.com/vaidyanathandev/marlioninternshipportal2025/issues

---

**Deployed by:** Marlion Technologies
**Last Updated:** November 2025
