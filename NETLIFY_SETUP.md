# Netlify Deployment Setup Guide

## Setting Up Environment Variables in Netlify

Your Firebase environment variables need to be configured in Netlify's dashboard. The `.env` file is only for local development and is not deployed to Netlify.

### Step 1: Get Your Firebase Credentials

You already have these values:
```
VITE_FIREBASE_API_KEY=AIzaSyCDX9kn_Fq0GHic0qsqf-ck1ezGRgon08U
VITE_FIREBASE_AUTH_DOMAIN=nova-cloud-stack-tool-s-hub.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=nova-cloud-stack-tool-s-hub
VITE_FIREBASE_STORAGE_BUCKET=nova-cloud-stack-tool-s-hub.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=432063360106
VITE_FIREBASE_APP_ID=1:432063360106:web:83feddd4c9c1ec6d3fae13
VITE_FIREBASE_MEASUREMENT_ID=G-31MEHF5NR4
```

### Step 2: Add Environment Variables in Netlify

**Option A: Using Netlify Dashboard (Recommended)**

1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Select your site
3. Go to **Site configuration** → **Environment variables** (or **Site settings** → **Build & deploy** → **Environment**)
4. Click **Add a variable** and add each variable:

   | Variable Name | Value |
   |--------------|-------|
   | `VITE_FIREBASE_API_KEY` | `AIzaSyCDX9kn_Fq0GHic0qsqf-ck1ezGRgon08U` |
   | `VITE_FIREBASE_AUTH_DOMAIN` | `nova-cloud-stack-tool-s-hub.firebaseapp.com` |
   | `VITE_FIREBASE_PROJECT_ID` | `nova-cloud-stack-tool-s-hub` |
   | `VITE_FIREBASE_STORAGE_BUCKET` | `nova-cloud-stack-tool-s-hub.firebasestorage.app` |
   | `VITE_FIREBASE_MESSAGING_SENDER_ID` | `432063360106` |
   | `VITE_FIREBASE_APP_ID` | `1:432063360106:web:83feddd4c9c1ec6d3fae13` |
   | `VITE_FIREBASE_MEASUREMENT_ID` | `G-31MEHF5NR4` (optional) |

5. Set the scope to **All scopes** (or select Production, Deploy previews, and Branch deploys separately)
6. Click **Save**
7. **Trigger a new deploy** (go to **Deploys** → **Trigger deploy** → **Deploy site**)

**Option B: Using Netlify CLI**

```bash
# Install Netlify CLI if not already installed
npm i -g netlify-cli

# Login to Netlify
netlify login

# Link your site (if not already linked)
netlify link

# Add environment variables
netlify env:set VITE_FIREBASE_API_KEY "AIzaSyCDX9kn_Fq0GHic0qsqf-ck1ezGRgon08U"
netlify env:set VITE_FIREBASE_AUTH_DOMAIN "nova-cloud-stack-tool-s-hub.firebaseapp.com"
netlify env:set VITE_FIREBASE_PROJECT_ID "nova-cloud-stack-tool-s-hub"
netlify env:set VITE_FIREBASE_STORAGE_BUCKET "nova-cloud-stack-tool-s-hub.firebasestorage.app"
netlify env:set VITE_FIREBASE_MESSAGING_SENDER_ID "432063360106"
netlify env:set VITE_FIREBASE_APP_ID "1:432063360106:web:83feddd4c9c1ec6d3fae13"

# Redeploy
netlify deploy --prod
```

### Step 3: Verify Deployment

After adding the environment variables and redeploying:

1. Check the deployment logs in Netlify dashboard
2. Visit your deployed site
3. The error should be gone and Firebase should work

### Important Notes

- Environment variables are **case-sensitive**
- Make sure to add them for **All scopes** or at least Production
- After adding variables, you **must trigger a new deploy** for changes to take effect
- Never commit your `.env` file to Git (it should be in `.gitignore`)

### Troubleshooting

If you still see the error after adding variables:

1. **Check variable names** - They must start with `VITE_` for Vite to expose them
2. **Redeploy** - Environment variables only apply to new deployments
3. **Check deployment logs** - Look for any build errors
4. **Verify values** - Make sure there are no extra spaces or quotes
5. **Check scope** - Make sure variables are set for the correct environment (Production/Preview)

### Netlify Configuration

Your `netlify.toml` is already configured correctly with:
- Build command: `npm run build`
- Publish directory: `dist`
- Redirect rules for SPA routing
- Security headers

