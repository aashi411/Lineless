# Deployment Guide: Vercel (Frontend) + Render (Backend)

## 📋 Overview

This guide covers deploying your LineLess invoice system across two platforms:
- **Frontend** → Vercel (optimal for React/Vite apps)
- **Backend** → Render (Node.js hosting)

---

## 🎯 Prerequisites

Before starting, ensure you have:
- [ ] GitHub account (required for both Vercel and Render)
- [ ] Git initialized in your project
- [ ] Code pushed to GitHub repository
- [ ] Vercel account (free tier available)
- [ ] Render account (free tier available)

---

## 📊 Deployment Architecture

```
┌─────────────────┐
│   Your Domain   │
└────────┬────────┘
         │
    ┌────┴────┐
    │          │
┌───▼──┐  ┌───▼──┐
│Vercel│  │Render│
│  FE  │  │  BE  │
└──────┘  └──────┘

Vercel:    https://your-app.vercel.app
Render:    https://your-api.onrender.com
```

---

## PART 1: BACKEND DEPLOYMENT ON RENDER

### Step 1: Push Backend to GitHub

```bash
cd Backend
git add .
git commit -m "Initial backend commit"
git push origin main
```

**Note:** Ensure your Backend folder is in your GitHub repo.

### Step 2: Prepare Backend for Render

Create/Update these files in Backend folder:

#### A. Create `.env.production`
```env
PORT=10000
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
```

#### B. Update `package.json`
Ensure scripts section looks like:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js"
  }
}
```

#### C. Create `render.yaml` (optional but recommended)
In Backend root directory:
```yaml
services:
  - type: web
    name: lineless-api
    env: node
    plan: free
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: PORT
        value: 10000
      - key: NODE_ENV
        value: production
      - key: FRONTEND_URL
        value: https://your-frontend.vercel.app
```

### Step 3: Deploy on Render

1. **Go to** → [render.com](https://render.com)
2. **Sign up/Login** with GitHub account
3. **Click** → "New +" → "Web Service"
4. **Connect Repository**:
   - Select your GitHub repo
   - Authorize if needed
5. **Configure Service**:
   - **Name**: `lineless-api` (or your choice)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid if needed)

6. **Add Environment Variables** (click "Advanced"):
   ```
   PORT=10000
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

7. **Click Deploy**
   - Render will install dependencies
   - Build and start your server
   - Take 2-5 minutes first time

8. **Get Your Backend URL**:
   - After deployment succeeds
   - Copy the URL: `https://lineless-api.onrender.com` (example)
   - **Save this URL** - you'll need it for frontend

### Step 4: Verify Backend Deployment

Test your backend:
```bash
curl https://lineless-api.onrender.com/

# Should return:
# {"message":"Invoice Generation API","version":"1.0.0"}

curl https://lineless-api.onrender.com/api/health

# Should return:
# {"status":"Backend is running successfully"}
```

---

## PART 2: FRONTEND DEPLOYMENT ON VERCEL

### Step 1: Update Frontend Environment Variables

#### A. Create `.env.production`
In Frontend folder:
```env
VITE_API_URL=https://lineless-api.onrender.com/api
```

#### B. Update `.env.local` (for local development)
```env
VITE_API_URL=http://localhost:5000/api
```

#### C. Update `Frontend/services/api.ts`
Replace the hardcoded URL with environment variable:

```typescript
import axios from 'axios';

// Get API URL from environment, fallback to production
const API_URL = import.meta.env.VITE_API_URL || 'https://lineless-api.onrender.com/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// ... rest of the file
```

#### D. Create/Update `vite.config.ts`
Ensure it looks like this:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {}
  }
})
```

### Step 2: Push Frontend to GitHub

```bash
cd Frontend
git add .
git commit -m "Update for production deployment"
git push origin main
```

### Step 3: Deploy on Vercel

1. **Go to** → [vercel.com](https://vercel.com)
2. **Sign up/Login** with GitHub
3. **Click** → "Add New..." → "Project"
4. **Import Repository**:
   - Select your GitHub repo
   - Authorize if needed

5. **Configure Project**:
   - **Project Name**: `lineless-frontend` (or your choice)
   - **Framework**: Vite
   - **Root Directory**: `./Frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

6. **Add Environment Variables**:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://lineless-api.onrender.com/api`
   - Click "Add"

7. **Click Deploy**
   - Vercel will build your project
   - Takes 1-3 minutes
   - Auto-deploys on git push

8. **Get Your Frontend URL**:
   - After deployment succeeds
   - Example: `https://lineless-frontend.vercel.app`
   - **Save this URL**

### Step 4: Update CORS on Backend

Now that you have your Vercel URL, update backend CORS:

#### Update `Backend/server.js`:
```javascript
import express from 'express';
import cors from 'cors';

const app = express();

// Configure CORS with your actual Vercel URL
const allowedOrigins = [
  'http://localhost:5173',           // Local development
  'http://localhost:3000',           // Alt local dev
  'https://your-frontend.vercel.app' // Production (replace with actual URL)
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// ... rest of config
```

#### Or simpler (allow all in production):
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

#### Push updated backend:
```bash
cd Backend
git add server.js
git commit -m "Update CORS for production"
git push origin main
```

**Render will auto-redeploy** on git push!

### Step 5: Test Production Setup

1. **Go to** your frontend URL: `https://lineless-frontend.vercel.app`
2. **Navigate to** Setup Flow
3. **Fill out form** and submit
4. **Should see** estimation calculated
5. **Click Download** → Should download PDF

---

## 📝 Environment Variables Summary

### Backend (Render) - `.env.production`
```env
# Server
PORT=10000
NODE_ENV=production

# Frontend URL (for CORS)
FRONTEND_URL=https://lineless-frontend.vercel.app

# Optional
SELLER_STATE=Karnataka
```

### Frontend (Vercel) - Environment Variables
```env
VITE_API_URL=https://lineless-api.onrender.com/api
```

### File Locations
```
Backend/
├── .env.production          ← Add this
├── .env.example             ← Keep for reference
└── server.js                ← Update CORS

Frontend/
├── .env.production          ← Add this
├── .env.local               ← Local dev
├── services/api.ts          ← Update to use env var
└── vite.config.ts           ← Ensure proper config
```

---

## 🔧 Detailed Configuration Changes

### Change 1: Frontend API Service

**Before (Local):**
```typescript
export const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 30000,
});
```

**After (Production-Ready):**
```typescript
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://lineless-api.onrender.com/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});
```

### Change 2: Backend CORS Configuration

**Before:**
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

**After (More Robust):**
```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL || ''
].filter(url => url); // Remove empty strings

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS Not Allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
```

### Change 3: Backend package.json

Ensure you have:
```json
{
  "type": "module",
  "engines": {
    "node": "18.x"
  },
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "pdfkit": "^0.13.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "uuid": "^9.0.1"
  }
}
```

---

## 🔗 Environment Variable Reference

### What Each Variable Does

| Variable | Platform | Purpose | Example |
|----------|----------|---------|---------|
| `VITE_API_URL` | Frontend | Backend API endpoint | `https://lineless-api.onrender.com/api` |
| `PORT` | Backend | Server port (Render: 10000) | `10000` |
| `NODE_ENV` | Backend | Environment mode | `production` |
| `FRONTEND_URL` | Backend | Frontend URL (CORS) | `https://lineless-frontend.vercel.app` |
| `SELLER_STATE` | Backend | For GST calculation | `Karnataka` |

### Local Development Environment

Create `Backend/.env.local`:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
SELLER_STATE=Karnataka
```

Create `Frontend/.env.local`:
```env
VITE_API_URL=http://localhost:5000/api
```

### Production Environment

Create `Backend/.env.production`:
```env
PORT=10000
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
SELLER_STATE=Karnataka
```

Vercel Environment Variables (in Vercel dashboard):
```
VITE_API_URL=https://your-api.onrender.com/api
```

---

## 🚀 Complete Deployment Checklist

### Backend (Render)

- [ ] Backend code pushed to GitHub
- [ ] `.env.production` created with correct values
- [ ] `server.js` CORS configured for Vercel URL
- [ ] `package.json` has proper scripts
- [ ] Created Render account
- [ ] Connected GitHub repository
- [ ] Created new Web Service
- [ ] Added environment variables in Render dashboard
- [ ] Deployment successful
- [ ] Health check endpoint working
- [ ] **Saved Backend URL** (e.g., `https://lineless-api.onrender.com`)

### Frontend (Vercel)

- [ ] Frontend code pushed to GitHub
- [ ] `api.ts` uses `import.meta.env.VITE_API_URL`
- [ ] `.env.production` created
- [ ] `vite.config.ts` properly configured
- [ ] Created Vercel account
- [ ] Connected GitHub repository
- [ ] Set Root Directory to `./Frontend`
- [ ] Set Build Command to `npm run build`
- [ ] Set Output Directory to `dist`
- [ ] Added `VITE_API_URL` environment variable
- [ ] Deployment successful
- [ ] Frontend loads without errors
- [ ] **Saved Frontend URL** (e.g., `https://lineless-frontend.vercel.app`)

### Post-Deployment

- [ ] Test invoice generation from Vercel frontend
- [ ] Download PDF works
- [ ] No CORS errors in browser console
- [ ] Backend API responds to requests
- [ ] GST calculations correct
- [ ] Both services communicate properly

---

## 🐛 Troubleshooting

### CORS Error: "Access to XMLHttpRequest blocked"

**Cause:** Frontend URL not in backend CORS config

**Solution:**
1. Get your actual Vercel URL
2. Update `FRONTEND_URL` in Render dashboard
3. Update allowed origins in `server.js`
4. Redeploy backend (git push)

### 404 Error: API endpoint not found

**Cause:** Wrong API URL in frontend

**Solution:**
1. Check `VITE_API_URL` in Vercel environment variables
2. Ensure it's correct: `https://your-api.onrender.com/api`
3. Verify backend is running: visit URL in browser
4. Redeploy frontend

### PDF Download Fails

**Cause:** Backend can't generate PDF

**Solution:**
1. Check Render logs for errors
2. Ensure pdfkit is installed: `npm ls pdfkit`
3. Test endpoint directly: `curl https://your-api.onrender.com/api/health`

### Blank Page on Vercel

**Cause:** Build issues or missing environment variables

**Solution:**
1. Check Vercel build logs
2. Ensure `VITE_API_URL` is set
3. Check `vite.config.ts` is correct
4. Local build working? `npm run build`

### Render says "Application failed to start"

**Cause:** Dependency issues or wrong start command

**Solution:**
1. Check Render logs
2. Verify `package.json` has `"start": "node server.js"`
3. Ensure all dependencies listed
4. Test locally: `node server.js`

---

## 📈 Performance Tips

### Frontend (Vercel)
- Image optimization enabled by default
- Automatic code splitting
- Edge functions available (paid plans)
- Analytics available in dashboard

### Backend (Render)
- Free tier has 15-minute idle timeout
- Consider paid plan for production
- Database connection: use Render's offerings
- Logging available in dashboard

---

## 🔄 Updating Code

### Update Backend
```bash
cd Backend
git add .
git commit -m "Update message"
git push origin main
# Render auto-deploys on push!
```

### Update Frontend
```bash
cd Frontend
git add .
git commit -m "Update message"
git push origin main
# Vercel auto-deploys on push!
```

---

## 📊 Deployment URLs Example

After successful deployment:

**Frontend:**
```
https://lineless-frontend.vercel.app
https://lineless-frontend-staging.vercel.app (optional preview)
```

**Backend:**
```
https://lineless-api.onrender.com
https://lineless-api.onrender.com/api/health (health check)
https://lineless-api.onrender.com/api/invoices/institutional (API)
```

---

## ✅ Final Verification

After deployment:

1. **Frontend loads:** `https://lineless-frontend.vercel.app`
2. **Backend responds:** `https://lineless-api.onrender.com/api/health`
3. **Form submission works:** Create estimation
4. **PDF downloads:** Click download button
5. **No CORS errors:** Check browser console

---

## 🎯 Summary of Changes Needed

### 1. Backend Changes
- [ ] Add `.env.production` with Render config
- [ ] Update `server.js` CORS with Vercel URL
- [ ] Ensure `package.json` has correct scripts

### 2. Frontend Changes
- [ ] Add `.env.production`
- [ ] Update `api.ts` to use `import.meta.env.VITE_API_URL`
- [ ] Ensure `vite.config.ts` is correct

### 3. GitHub
- [ ] Push all changes to main branch
- [ ] Both platforms will auto-deploy

### 4. Vercel Dashboard
- [ ] Set `VITE_API_URL` environment variable
- [ ] Set Root Directory to `./Frontend`

### 5. Render Dashboard
- [ ] Set `FRONTEND_URL`, `PORT`, `NODE_ENV` variables
- [ ] Ensure auto-deploy from GitHub enabled

---

## 📞 Deployment Support

### Vercel Documentation
- https://vercel.com/docs
- https://vitejs.dev/guide/ssr.html

### Render Documentation
- https://render.com/docs
- https://render.com/docs/deploy-node-express-app

---

**Version:** 1.0  
**Last Updated:** January 17, 2026  
**Status:** Ready for Production Deployment
