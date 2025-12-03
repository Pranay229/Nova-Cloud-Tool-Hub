# 🚀 Deployment Guide - Nova Developer Tools

## Overview

This guide covers deploying the Nova Developer Tools application with proper security hardening for production environments.

---

## 📋 Pre-Deployment Checklist

### Required Setup

- [*] Firebase project created
- [ ] Google OAuth credentials configured
- [ ] Domain name registered (if using custom domain)
- [ ] SSL/TLS certificate ready (most hosts provide free)
- [ ] Environment variables prepared

---

## 🏗️ Deployment Options

### Option 1: Vercel (Recommended)

**Why Vercel?**
- Automatic HTTPS
- Edge network (global CDN)
- Zero configuration
- Built-in security headers support
- Free tier available

**Steps:**

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Configure Project**
   Create `vercel.json`:
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "framework": "vite",
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ],
     "headers": [
       {
         "source": "/(.*)",
         "headers": [
           {
             "key": "Strict-Transport-Security",
             "value": "max-age=31536000; includeSubDomains; preload"
           },
           {
             "key": "X-Frame-Options",
             "value": "DENY"
           },
           {
             "key": "X-Content-Type-Options",
             "value": "nosniff"
           },
           {
             "key": "Referrer-Policy",
             "value": "strict-origin-when-cross-origin"
           },
           {
             "key": "Permissions-Policy",
             "value": "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()"
           }
         ]
       }
     ]
   }
   ```

4. **Set Environment Variables**
   ```bash
   vercel env add VITE_FIREBASE_API_KEY
   vercel env add VITE_FIREBASE_AUTH_DOMAIN
   vercel env add VITE_FIREBASE_PROJECT_ID
   vercel env add VITE_FIREBASE_STORAGE_BUCKET
   vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID
   vercel env add VITE_FIREBASE_APP_ID
   ```

5. **Deploy**
   ```bash
   vercel --prod
   ```

---

### Option 2: Netlify

**Steps:**

1. **Install Netlify CLI**
   ```bash
   npm i -g netlify-cli
   ```

2. **Login**
   ```bash
   netlify login
   ```

3. **Configure Project**
   Create `netlify.toml`:
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200

   [[headers]]
     for = "/*"
     [headers.values]
       Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"
       X-Frame-Options = "DENY"
       X-Content-Type-Options = "nosniff"
       Referrer-Policy = "strict-origin-when-cross-origin"
       Permissions-Policy = "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()"
   ```

4. **Deploy**
   ```bash
   netlify deploy --prod
   ```

---

### Option 3: Cloudflare Pages

**Steps:**

1. **Connect GitHub Repository**
   - Go to Cloudflare Dashboard
   - Pages → Create a project
   - Connect GitHub repo

2. **Configure Build**
   ```
   Build command: npm run build
   Build output: dist
   ```

3. **Set Environment Variables**
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

4. **Deploy**
   - Automatic on git push

**Cloudflare Benefits:**
- Built-in DDoS protection
- Global CDN
- Web Application Firewall (WAF)
- Free SSL

---

## 🔐 Environment Configuration

### Production Environment Variables

Create `.env.production`:
```bash
VITE_FIREBASE_API_KEY=your-production-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=000000000000
VITE_FIREBASE_APP_ID=1:000000000000:web:abcdef123456
VITE_ENVIRONMENT=production
```

**⚠️ Security Notes:**
- Never commit `.env` files
- Use platform-specific secret management
- Rotate keys quarterly
- Use different keys for dev/prod

---

## 🌐 Domain Configuration

### Custom Domain Setup

1. **Add Domain to Hosting Platform**
   - Vercel: Project Settings → Domains
   - Netlify: Site Settings → Domain Management
   - Cloudflare: Automatic if using Cloudflare DNS

2. **Configure DNS**
   ```
   Type: A
   Name: @
   Value: [Platform IP or CNAME]
   ```

3. **Enable SSL**
   - Most platforms auto-provision Let's Encrypt
   - Verify HTTPS works before proceeding

4. **Update Firebase Authentication**
   - Go to Firebase Console
   - Authentication → Settings → Authorized domains
   - Add your production domain

5. **Update Google OAuth**
   - Google Cloud Console
   - Add production domain to authorized origins
   - Add `https://yourdomain.com` to redirect URIs

---

## 🔒 Post-Deployment Security

### 1. Test Security Headers

```bash
curl -I https://yourdomain.com
```

Verify headers:
- Strict-Transport-Security
- X-Frame-Options
- X-Content-Type-Options
- Content-Security-Policy

### 2. Run Security Scan

Use [Mozilla Observatory](https://observatory.mozilla.org):
```
https://observatory.mozilla.org/analyze/yourdomain.com
```

Target score: A+ or A

### 3. Test SSL Configuration

Use [SSL Labs](https://www.ssllabs.com/ssltest/):
```
https://www.ssllabs.com/ssltest/analyze.html?d=yourdomain.com
```

Target score: A or higher

### 4. Verify OAuth Flow

1. Visit your domain
2. Click "Sign in with Google"
3. Complete OAuth flow
4. Verify redirect back to your domain
5. Verify user appears in Firebase Authentication users list

---

## 📊 Monitoring Setup

### Firebase Monitoring

1. **Auth Monitoring**
   - Firebase Console → Authentication
   - Monitor failed logins/OAuth events

2. **Database Monitoring**
   - Firebase Console → Firestore
   - Review read/write usage and indexes

3. **Cloud Functions / API Analytics (if used)**
   - Firebase Console → Functions
   - Track invocation counts and error rates

### External Monitoring (Optional)

**Uptime Monitoring:**
- [UptimeRobot](https://uptimerobot.com/)
- [Pingdom](https://www.pingdom.com/)

**Error Tracking:**
- [Sentry](https://sentry.io/)
- Configure in production only

---

## 🔄 CI/CD Setup

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
          VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}
          VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}
          VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID }}

      - name: Deploy to Vercel
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

**Required Secrets:**
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VERCEL_TOKEN` (or platform-specific token)

---

## 🐛 Troubleshooting

### OAuth Redirect Issues

**Problem:** Google OAuth redirects to wrong URL

**Solution:**
1. Ensure your domain is listed under Firebase Authentication → Authorized domains
2. Verify Google Console has correct redirect URIs
3. Clear browser cache
4. Check for trailing slashes

### CORS Errors

**Problem:** API requests blocked by CORS

**Solution:**
1. Configure Firebase Hosting/Functions to send correct CORS headers
2. Verify request URLs use HTTPS
3. Check Firebase project configuration and env variables

### Build Failures

**Problem:** Build fails with environment errors

**Solution:**
1. Verify all required env vars are set
2. Check env var names (VITE_ prefix required)
3. Rebuild after env changes

### Security Header Not Applied

**Problem:** Security headers missing in production

**Solution:**
1. Verify `_headers` file in public folder
2. Check platform-specific configuration
3. Clear CDN cache
4. Test with curl, not browser cache

---

## 📈 Performance Optimization

### Build Optimization

Already configured in `vite.config.ts`:
- Code splitting
- Tree shaking
- Minification
- Gzip compression

### CDN Configuration

All recommended platforms provide:
- Global edge network
- Automatic caching
- Image optimization
- HTTP/2 support

### Database Optimization

- RLS policies are indexed
- Connection pooling (Supabase default)
- Query optimization via Supabase Dashboard

---

## 🔐 Security Maintenance

### Monthly Tasks

- [ ] Review Firebase auth logs for suspicious activity
- [ ] Check Firestore/Functions usage dashboards
- [ ] Update npm dependencies
- [ ] Review user feedback

### Quarterly Tasks

- [ ] Rotate Firebase API keys/service accounts
- [ ] Update Google OAuth credentials
- [ ] Run security audit
- [ ] Review and update Firestore security rules
- [ ] Test disaster recovery

### Annual Tasks

- [ ] Full security assessment
- [ ] Penetration testing
- [ ] Review and update documentation
- [ ] Backup and disaster recovery drill

---

## 📞 Support

### Production Issues

1. Check Firebase Status Dashboard for service status
2. Review application logs
3. Check monitoring dashboards
4. Contact support if needed

### Emergency Contacts

- **Firebase Support**: firebase.google.com/support
- **Vercel Support**: vercel.com/support
- **Security Issues**: See SECURITY.md

---

## ✅ Launch Checklist

Before going live:

- [ ] All tests passing
- [ ] Security headers verified
- [ ] SSL certificate active
- [ ] Google OAuth configured
- [ ] Database backups enabled
- [ ] Monitoring enabled
- [ ] Error tracking configured
- [ ] Custom domain configured
- [ ] DNS propagated
- [ ] All environment variables set
- [ ] Documentation updated
- [ ] Team notified

---

**Last Updated**: 2024
**Version**: 1.0.0
