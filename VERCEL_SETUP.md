# Vercel Deployment Setup Guide

## Setting Up Environment Variables in Vercel

Your Firebase environment variables need to be configured in Vercel's dashboard. The `.env` file is only for local development and is not deployed to Vercel.

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

### Step 2: Add Environment Variables in Vercel

**Option A: Using Vercel Dashboard (Recommended)**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable one by one:

   | Variable Name | Value |
   |--------------|-------|
   | `VITE_FIREBASE_API_KEY` | `AIzaSyCDX9kn_Fq0GHic0qsqf-ck1ezGRgon08U` |
   | `VITE_FIREBASE_AUTH_DOMAIN` | `nova-cloud-stack-tool-s-hub.firebaseapp.com` |
   | `VITE_FIREBASE_PROJECT_ID` | `nova-cloud-stack-tool-s-hub` |
   | `VITE_FIREBASE_STORAGE_BUCKET` | `nova-cloud-stack-tool-s-hub.firebasestorage.app` |
   | `VITE_FIREBASE_MESSAGING_SENDER_ID` | `432063360106` |
   | `VITE_FIREBASE_APP_ID` | `1:432063360106:web:83feddd4c9c1ec6d3fae13` |
   | `VITE_FIREBASE_MEASUREMENT_ID` | `G-31MEHF5NR4` (optional) |

5. Set the environment to **Production**, **Preview**, and **Development** for each variable
6. Click **Save**
7. **Redeploy** your project (go to Deployments → click the three dots → Redeploy)

**Option B: Using Vercel CLI**

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Add environment variables
vercel env add VITE_FIREBASE_API_KEY production
# Paste: AIzaSyCDX9kn_Fq0GHic0qsqf-ck1ezGRgon08U

vercel env add VITE_FIREBASE_AUTH_DOMAIN production
# Paste: nova-cloud-stack-tool-s-hub.firebaseapp.com

vercel env add VITE_FIREBASE_PROJECT_ID production
# Paste: nova-cloud-stack-tool-s-hub

vercel env add VITE_FIREBASE_STORAGE_BUCKET production
# Paste: nova-cloud-stack-tool-s-hub.firebasestorage.app

vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID production
# Paste: 432063360106

vercel env add VITE_FIREBASE_APP_ID production
# Paste: 1:432063360106:web:83feddd4c9c1ec6d3fae13

# Redeploy
vercel --prod
```

### Step 3: Verify Deployment

After adding the environment variables and redeploying:

1. Check the deployment logs in Vercel dashboard
2. Visit your deployed site
3. The error should be gone and Firebase should work

### Important Notes

- Environment variables are **case-sensitive**
- Make sure to add them for **Production**, **Preview**, and **Development** environments
- After adding variables, you **must redeploy** for changes to take effect
- Never commit your `.env` file to Git (it should be in `.gitignore`)

### Troubleshooting

If you still see the error after adding variables:

1. **Check variable names** - They must start with `VITE_` for Vite to expose them
2. **Redeploy** - Environment variables only apply to new deployments
3. **Check deployment logs** - Look for any build errors
4. **Verify values** - Make sure there are no extra spaces or quotes

