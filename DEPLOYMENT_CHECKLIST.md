# 🚀 Step-by-Step Deployment Checklist

## Phase 1: Preparation (Local)

### 1.1 Verify Everything Works Locally

- [ ] Start Backend: `cd Backend && node server.js`
- [ ] Start Frontend: `cd Frontend && npm run dev`
- [ ] Test invoice generation
- [ ] Download sample PDF
- [ ] Check no console errors

### 1.2 Setup GitHub Repository

```bash
# In your project root
git init
git add .
git commit -m "Initial commit - ready for deployment"
git branch -M main

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

**Verify:**
- [ ] Repository exists on GitHub
- [ ] All files are pushed
- [ ] Main branch is default

---

## Phase 2: Backend Deployment on Render

### 2.1 Create Render Account

- [ ] Go to https://render.com
- [ ] Sign up with GitHub account
- [ ] Authorize GitHub access
- [ ] Verify email

### 2.2 Deploy Backend Service

**Steps in Render Dashboard:**

1. Click "New +" → "Web Service"
2. Choose your GitHub repository
3. Select Backend folder (if in subfolder)
4. Fill in Configuration:
   ```
   Name: lineless-api
   Environment: Node
   Region: Free tier default
   Build Command: npm install
   Start Command: npm start
   Plan: Free
   ```
5. Click "Create Web Service"

**Wait for deployment** (2-5 minutes)

### 2.3 Configure Environment Variables

In Render Dashboard → Your Service → Environment:

```
PORT = 10000
NODE_ENV = production
FRONTEND_URL = https://your-frontend.vercel.app
SELLER_STATE = Karnataka
```

**Don't know Vercel URL yet?** Add it later after frontend deployment.

### 2.4 Verify Backend Deployment

Once deployed, test endpoints:

```bash
# Get your backend URL from Render dashboard
# Example: https://lineless-api.onrender.com

# Test root endpoint
curl https://lineless-api.onrender.com/

# Test health check
curl https://lineless-api.onrender.com/api/health
```

**Expected Responses:**
- Root: `{"message":"Invoice Generation API","version":"1.0.0"}`
- Health: `{"status":"Backend is running successfully"}`

**Save your Backend URL:**
```
Backend URL: https://lineless-api.onrender.com
```

---

## Phase 3: Frontend Deployment on Vercel

### 3.1 Create Vercel Account

- [ ] Go to https://vercel.com
- [ ] Sign up with GitHub account
- [ ] Authorize GitHub access

### 3.2 Deploy Frontend Project

**Steps in Vercel Dashboard:**

1. Click "Add New..." → "Project"
2. Choose your GitHub repository
3. Fill in Configuration:
   ```
   Project Name: lineless-frontend
   Framework: Vite
   Root Directory: ./Frontend
   Build Command: npm run build
   Output Directory: dist
   ```
4. Click "Deploy"

**Wait for deployment** (1-3 minutes)

### 3.3 Configure Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables:

Add new variable:
```
Name: VITE_API_URL
Value: https://lineless-api.onrender.com/api
Production: ✓ (checked)
```

Click "Save and Deploy"

**Vercel will redeploy with new env variables**

### 3.4 Get Your Frontend URL

After deployment:
```
Frontend URL: https://lineless-frontend.vercel.app
```

**Save this URL** - you need it for backend CORS

---

## Phase 4: Update Backend CORS

### 4.1 Update Environment Variable on Render

Go back to Render Dashboard → Your Backend Service → Environment:

Update:
```
FRONTEND_URL = https://lineless-frontend.vercel.app
```

Save and Render will redeploy automatically.

### 4.2 Verify Redeployment

Wait for Render to redeploy (1-2 minutes)

Check service status shows "Live" and green

---

## Phase 5: Testing Production

### 5.1 Test Frontend

1. Open `https://lineless-frontend.vercel.app`
2. Check page loads (no 404)
3. Check no console errors

**In Browser DevTools (F12):**
```javascript
// Check what API URL is being used
console.log('API URL:', import.meta.env.VITE_API_URL);
```

### 5.2 Test Invoice Generation

1. Go to Setup Flow / Business Enquiry
2. Fill in form:
   ```
   Organization Name: Test Organization
   Type: Government
   State: Karnataka
   Daily Footfall: 500
   Counters: 10
   Plan: Basic
   Support: Standard
   Billing: Monthly
   ```
3. Click "Submit Business Enquiry"
4. Should see estimation

### 5.3 Test PDF Download

1. On results page, click "Download PDF Estimate"
2. PDF should download to your computer
3. Open PDF and verify content

### 5.4 Check Network Requests

In Browser DevTools → Network tab:

1. Filter by "XHR" (XMLHttpRequest)
2. Submit form
3. Should see POST to `/api/invoices/institutional`
4. Status should be 200 (success)

### 5.5 Verify No CORS Errors

In Browser Console:
- Should see no red CORS errors
- Should see: `[API Client] Using API URL: https://lineless-api.onrender.com/api`

---

## Phase 6: Troubleshooting

### Issue: CORS Error

```
Error: Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
1. Get exact Frontend URL from Vercel
2. Go to Render Dashboard
3. Update FRONTEND_URL environment variable
4. Wait for redeployment (shows "In Progress" then "Live")
5. Refresh frontend page

### Issue: 404 on Frontend

```
Cannot GET /
```

**Solution:**
1. Check Root Directory is `./Frontend` in Vercel
2. Check Build Command is `npm run build`
3. Check Vercel build logs for errors
4. Redeploy: Click "Redeploy" in Vercel dashboard

### Issue: API 404

```
POST /api/invoices/institutional 404
```

**Solution:**
1. Verify Backend URL in VITE_API_URL
2. Test: `curl https://lineless-api.onrender.com/api/health`
3. Check Render service is "Live" (green status)
4. Check Render logs for errors

### Issue: PDF Won't Download

**Solution:**
1. Check browser console for errors
2. Check Render logs for PDF generation errors
3. Test API directly:
   ```bash
   curl -X POST https://lineless-api.onrender.com/api/invoices/institutional \
     -H "Content-Type: application/json" \
     -d '{...json data...}'
   ```

### Issue: Frontend Blank/White Page

**Solution:**
1. Open DevTools (F12)
2. Check Console for errors
3. Check Network tab for failed requests
4. Verify VITE_API_URL is set in Vercel
5. Redeploy frontend: Click "Redeploy" button

---

## Phase 7: Final Verification Checklist

### Backend Checklist
- [ ] Render shows "Live" status
- [ ] Health check works: `curl https://your-api.onrender.com/api/health`
- [ ] Root endpoint works: `curl https://your-api.onrender.com/`
- [ ] Logs show no errors
- [ ] FRONTEND_URL matches Vercel URL

### Frontend Checklist
- [ ] Vercel shows "Ready" status
- [ ] Page loads without 404
- [ ] Console shows no errors
- [ ] API URL is correct in console
- [ ] VITE_API_URL environment variable set

### Integration Checklist
- [ ] Form submission works
- [ ] API request succeeds (200 status)
- [ ] Estimation displays correctly
- [ ] PDF downloads successfully
- [ ] No CORS errors in console
- [ ] Numbers are accurate

---

## Phase 8: Going Live

### Share Your URLs

After verification:

```
🔗 Frontend: https://lineless-frontend.vercel.app
🔗 Backend: https://lineless-api.onrender.com
```

These are now accessible to anyone!

### Enable Auto-Redeploy (Both Platforms)

**Vercel:** Already enabled by default - redeployment on git push

**Render:** Already enabled by default - redeployment on git push

### Keep Logs Clean

Monitor logs regularly:
- Render Dashboard → Logs
- Vercel Dashboard → Logs

---

## Phase 9: Future Updates

### Update Backend Code

```bash
cd Backend
# Make changes to files
git add .
git commit -m "Fix: update API response"
git push origin main
# Render auto-deploys!
```

### Update Frontend Code

```bash
cd Frontend
# Make changes to files
git add .
git commit -m "Feat: add new UI element"
git push origin main
# Vercel auto-deploys!
```

### Update Environment Variables

**For Backend:**
1. Go to Render Dashboard
2. Settings → Environment Variables
3. Update value
4. Save (auto-redeployment)

**For Frontend:**
1. Go to Vercel Dashboard
2. Settings → Environment Variables
3. Update value
4. Redeploy required - click "Redeploy"

---

## 📊 Expected Performance

### Render Free Tier
- Spins down after 15 mins inactivity
- Takes 30 seconds to spin up
- Suitable for low-traffic applications
- Consider upgrading for production use

### Vercel Free Tier
- Fully featured
- No cold starts
- Suitable for production
- Unlimited deployments

---

## 🔐 Security Checklist

- [ ] No sensitive keys in code
- [ ] .env files in .gitignore
- [ ] Environment variables set in dashboards (not code)
- [ ] CORS properly configured
- [ ] Only allowing necessary origins
- [ ] No console.log of sensitive data

---

## 📱 Testing on Different Devices

### Desktop Browser
1. Open frontend URL
2. Test all functionality
3. Check responsive design

### Mobile Browser
1. Open frontend URL on phone
2. Form should be usable
3. Download functionality works

### API Testing Tools

Use Postman or similar to test:
```
POST https://lineless-api.onrender.com/api/invoices/institutional
Headers:
  Content-Type: application/json
Body:
{
  "organizationName": "Test",
  "organizationType": "government",
  "plan_type": "basic",
  "service_locations": 1,
  "counters_per_location": 10,
  "monthly_volume_per_location": 11000,
  "usage_fee_per_transaction": 1.5,
  "support_level": "standard",
  "billing_cycle": "monthly",
  "state": "Karnataka"
}
```

---

## ✅ Deployment Complete!

When all phases pass:

✅ Frontend deployed on Vercel  
✅ Backend deployed on Render  
✅ CORS properly configured  
✅ Environment variables set  
✅ All tests passing  
✅ PDF download working  
✅ Ready for production use  

---

## 📞 Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **Render Docs:** https://render.com/docs
- **Vite Docs:** https://vitejs.dev
- **Express Docs:** https://expressjs.com

---

**Deployment Date:** January 17, 2026  
**Status:** Ready for Production  
**Version:** 1.0
