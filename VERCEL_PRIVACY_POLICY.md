# Privacy Policy URL for Vercel Deployment

## ✅ Privacy Policy Setup

The privacy policy is now configured to be served via Vercel without affecting Android builds.

## 📁 File Location

**Privacy Policy File:**
```
public/privacy-policy.html
```

This file is in the `public/` folder, which is served as static content by Vercel. It is **NOT** included in Android builds since the `android/` folder is separate.

## 🌐 Vercel URL Paths

After deploying to Vercel, your privacy policy will be accessible at:

**Primary URL:**
```
https://your-app.vercel.app/privacy-policy
```

**Alternate URL:**
```
https://your-app.vercel.app/privacy-policy.html
```

## 📤 For Google Play Console

When adding the Privacy Policy URL in Google Play Console:

1. Go to **Policy** → **App content** → **Privacy Policy**
2. Enter the URL:
   ```
   https://your-app.vercel.app/privacy-policy
   ```
3. Click **Save**

## ✅ Android Build Impact

**No Impact on Android Build:**
- ✅ Privacy policy is in `public/` folder (web assets)
- ✅ Android build uses `android/` folder (separate)
- ✅ `.vercelignore` excludes privacy policy from Vercel build (not needed)
- ✅ Android Gradle build doesn't include `public/` folder
- ✅ No changes to Android manifest or build files

## 🔧 Vercel Configuration

The `vercel.json` file is configured to:
- Serve `/privacy-policy` → `/public/privacy-policy.html`
- Serve `/privacy-policy.html` → `/public/privacy-policy.html`
- Route all other requests to `/public/` folder

## 📝 Deployment Steps

1. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```
   Or push to GitHub (if connected to Vercel)

2. **Get Your Vercel URL:**
   - Check Vercel dashboard
   - Or use: `vercel ls` to see deployments

3. **Update Play Console:**
   - Use: `https://your-app.vercel.app/privacy-policy`

## 🔍 Testing

After deployment, test the privacy policy URL:
```bash
curl https://your-app.vercel.app/privacy-policy
```

Should return HTML content (200 OK).

---

**Privacy Policy is ready for Play Store! 🚀**

