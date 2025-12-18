# Vercel Root Directory Guide

## What is Root Directory?

**Root Directory** tells Vercel where your project's main files are located. It's the base directory from which Vercel will:
- Look for `vercel.json`
- Find `package.json`
- Build serverless functions from `api/` folder
- Serve static files from `public/` folder

## For Your Project

**Root Directory should be: `./`** (or leave it empty/default)

### Why `./`?

Your project structure is:
```
Calendar/
├── vercel.json          ← Configuration file (at root)
├── package.json         ← Dependencies (at root)
├── api/
│   └── index.js         ← Serverless function
├── public/
│   ├── index.html       ← Main app
│   ├── privacy-policy.html
│   ├── css/
│   └── js/
├── src/                 ← Source code
└── android/             ← Android app (ignored by Vercel)
```

Since all your Vercel-related files (`vercel.json`, `api/`, `public/`) are at the **root level** of your repository, the root directory should be `./` (current directory).

## What `./` Means

- `./` = Current directory (root of your repository)
- This is the **default** and **correct** setting for your project

## Alternative Scenarios

If your project was structured differently:

**Example 1: Monorepo**
```
repo/
├── frontend/
│   ├── vercel.json
│   ├── public/
│   └── package.json
└── backend/
```
→ Root Directory: `./frontend`

**Example 2: Nested Project**
```
repo/
└── apps/
    └── calendar/
        ├── vercel.json
        └── public/
```
→ Root Directory: `./apps/calendar`

## For Your Project: Keep It As `./`

✅ **Root Directory: `./`** (or empty/default)

This is correct because:
- `vercel.json` is at root
- `api/` folder is at root
- `public/` folder is at root
- `package.json` is at root

## Verification

After deployment, Vercel will:
1. ✅ Find `vercel.json` at root
2. ✅ Build `api/index.js` as serverless function
3. ✅ Serve files from `public/` folder
4. ✅ Use `package.json` for dependencies

---

**TL;DR: Keep Root Directory as `./` (default) - it's correct for your project structure! 🚀**

