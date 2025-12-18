# Privacy Policy Deployment Guide

## ✅ Privacy Policy File Ready

**File Location**: `PRIVACY_POLICY.html`

## 🌐 Deployment Options

### Option 1: Deploy to Vercel (Recommended - Already Using)

1. **Commit and Push to GitHub**:
   ```bash
   git add PRIVACY_POLICY.html vercel.json
   git commit -m "Add privacy policy page"
   git push origin main
   ```

2. **Vercel will auto-deploy** or manually deploy:
   ```bash
   vercel --prod
   ```

3. **Your Privacy Policy URL will be**:
   ```
   https://your-app-name.vercel.app/privacy-policy
   ```
   or
   ```
   https://your-app-name.vercel.app/privacy-policy.html
   ```

### Option 2: GitHub Pages (Free & Easy)

1. **Create a new repository** (or use existing):
   ```bash
   git init
   git add PRIVACY_POLICY.html
   git commit -m "Add privacy policy"
   git remote add origin https://github.com/yourusername/privacy-policy.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Select source branch (main)
   - Your URL: `https://yourusername.github.io/privacy-policy/PRIVACY_POLICY.html`

3. **Or rename to index.html** for cleaner URL:
   ```bash
   cp PRIVACY_POLICY.html index.html
   git add index.html
   git commit -m "Add index.html"
   git push
   ```
   URL: `https://yourusername.github.io/privacy-policy/`

### Option 3: Netlify (Drag & Drop)

1. Go to https://netlify.com
2. Sign up/login
3. Drag and drop `PRIVACY_POLICY.html`
4. Get your URL: `https://random-name.netlify.app/PRIVACY_POLICY.html`
5. Rename file to `index.html` for cleaner URL

### Option 4: Your Website (SA-privateLimited.com)

1. Upload `PRIVACY_POLICY.html` to your website
2. Accessible at: `https://SA-privateLimited.com/privacy-policy.html`
3. Or create subdomain: `https://privacy.SA-privateLimited.com`

## 📤 Add to Google Play Console

1. Go to **Google Play Console**
2. Select your app: **Hindu Panchang Calendar**
3. Navigate to: **Policy** → **App content** → **Data safety**
4. Scroll to **"Privacy policy"** section
5. Click **"Go to Privacy policy"**
6. Enter your Privacy Policy URL (must be HTTPS)
7. Click **Save**

## ✅ Required Format

- **Must be HTTPS** (not HTTP)
- **Publicly accessible** (no login required)
- **Direct link** to the privacy policy page
- **Valid HTML** page

## 🔗 Example URLs

- ✅ `https://your-app.vercel.app/privacy-policy`
- ✅ `https://yourusername.github.io/privacy-policy/`
- ✅ `https://SA-privateLimited.com/privacy-policy.html`
- ❌ `http://your-site.com/privacy-policy` (HTTP not allowed)
- ❌ `file:///path/to/PRIVACY_POLICY.html` (file:// not allowed)

## 📝 Quick Vercel Deployment

If using Vercel:

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Deploy
cd /Users/sandeepgupta/Desktop/playStore/Calendar
vercel --prod

# Your privacy policy will be at:
# https://your-app.vercel.app/privacy-policy
```

## ✅ Verification Checklist

- [ ] Privacy Policy HTML file exists
- [ ] File is hosted on HTTPS URL
- [ ] URL is publicly accessible
- [ ] URL added to Google Play Console
- [ ] Privacy Policy displays correctly in browser
- [ ] All contact information is correct

---

**Once deployed, add the HTTPS URL to Google Play Console! 🚀**

