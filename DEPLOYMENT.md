# 🚀 Deployment Guide - Nova Developer Tools

## Overview

This guide covers deploying the Nova Developer Tools application with proper security hardening for production environments.

---

## 📋 Pre-Deployment Checklist

### Required Setup

- [*] Supabase project created
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
   vercel env add VITE_SUPABASE_URL
   vercel env add VITE_SUPABASE_ANON_KEY
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
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

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
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
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

4. **Update Supabase**
   - Go to Supabase Dashboard
   - Authentication → URL Configuration
   - Update Site URL to your domain

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
5. Check user created in Supabase

---

## 📊 Monitoring Setup

### Supabase Monitoring

1. **Auth Monitoring**
   - Dashboard → Authentication
   - Monitor failed logins
   - Check OAuth success rates

2. **Database Monitoring**
   - Dashboard → Database
   - Check query performance
   - Monitor RLS policy usage

3. **API Analytics**
   - Dashboard → API
   - Track request volumes
   - Monitor error rates

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
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}

      - name: Deploy to Vercel
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

**Required Secrets:**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VERCEL_TOKEN` (or platform-specific token)

---

## 🐛 Troubleshooting

### OAuth Redirect Issues

**Problem:** Google OAuth redirects to wrong URL

**Solution:**
1. Check Supabase Site URL matches your domain
2. Verify Google Console has correct redirect URIs
3. Clear browser cache
4. Check for trailing slashes

### CORS Errors

**Problem:** API requests blocked by CORS

**Solution:**
1. Supabase automatically handles CORS
2. Verify request URLs use HTTPS
3. Check Supabase URL in environment variables

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

- [ ] Review auth logs for suspicious activity
- [ ] Check error rates in Supabase Dashboard
- [ ] Update npm dependencies
- [ ] Review user feedback

### Quarterly Tasks

- [ ] Rotate Supabase API keys
- [ ] Update Google OAuth credentials
- [ ] Run security audit
- [ ] Review and update RLS policies
- [ ] Test disaster recovery

### Annual Tasks

- [ ] Full security assessment
- [ ] Penetration testing
- [ ] Review and update documentation
- [ ] Backup and disaster recovery drill

---

## 📞 Support

### Production Issues

1. Check Supabase Dashboard for service status
2. Review application logs
3. Check monitoring dashboards
4. Contact support if needed

### Emergency Contacts

- **Supabase Support**: support.supabase.com
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
