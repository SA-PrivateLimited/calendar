# Vercel Framework Preset Guide

## What is Framework Preset?

**Framework Preset** in Vercel tells Vercel how to build and deploy your project. It automatically configures:
- Build commands
- Output directories
- Development server settings
- Optimizations specific to that framework

## For Your Project

Since you already have `vercel.json` configured, **the Framework Preset doesn't matter much** - Vercel will use your `vercel.json` configuration instead.

However, here are the options:

### Recommended: **"Other"** or **"Express"**

**Option 1: "Other" (Recommended)**
- ✅ Best for custom serverless functions
- ✅ Vercel will use your `vercel.json` configuration
- ✅ No automatic framework assumptions
- ✅ Full control over build process

**Option 2: "Express"**
- ⚠️ Works but assumes Express.js patterns
- ⚠️ May try to auto-detect Express routes
- ✅ Since you have `vercel.json`, it will override anyway

## Current Setup

Your project uses:
- **Serverless Functions**: `api/index.js` (Vercel serverless)
- **Static Files**: `public/` folder (HTML, CSS, JS)
- **Custom Config**: `vercel.json` (defines routes and builds)

## What Vercel Will Do

With your `vercel.json`:
1. Build serverless function from `api/index.js`
2. Serve static files from `public/` folder
3. Route `/api/*` to serverless function
4. Route `/privacy-policy` to `public/privacy-policy.html`
5. Route `/` to `public/index.html`

## Recommendation

**Select: "Other"**

This tells Vercel:
- "I have custom configuration"
- "Use my vercel.json file"
- "Don't make framework assumptions"

## After Deployment

Once deployed, your app will be available at:
- Main app: `https://your-app.vercel.app/`
- Privacy Policy: `https://your-app.vercel.app/privacy-policy`
- API: `https://your-app.vercel.app/api/calendar/2026`

---

**TL;DR: Choose "Other" - your vercel.json handles everything! 🚀**

