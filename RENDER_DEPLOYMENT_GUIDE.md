# 🚀 Backend Deployment Guide - Render

## ✅ Pre-Deployment Checklist

All code is ready! Now follow these steps:

---

## Step 1: MongoDB Atlas Setup (Free Tier)

1. **Visit**: https://cloud.mongodb.com
2. **Sign up** (if not already)
3. **Create Cluster**:
   - Choose **FREE tier** (M0)
   - Region: Choose closest to you
   - Cluster Name: `jobportal`
4. **Create Database User**:
   - Username: `jobportal-admin`
   - Password: (save this!)
5. **Network Access**:
   - Click "Add IP Address"
   - Choose **"Allow Access from Anywhere"** (0.0.0.0/0)
6. **Get Connection String**:
   - Click **Connect** → **Connect your application**
   - Copy the connection string:
   ```
   mongodb+srv://jobportal-admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - Replace `<password>` with your actual password
   - Change database name: Add `/jobportal` before the `?`
   ```
   mongodb+srv://jobportal-admin:yourpassword@cluster0.xxxxx.mongodb.net/jobportal?retryWrites=true&w=majority
   ```

---

## Step 2: Cloudinary Setup (Free Tier - for image uploads)

1. **Visit**: https://cloudinary.com
2. **Sign up** (free tier)
3. **Dashboard**:
   - Copy **Cloud Name**
   - Copy **API Key**
   - Copy **API Secret**

---

## Step 3: Push Code to GitHub

```bash
cd "c:\Users\DELLL\Desktop\job portal"

# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Backend ready for deployment"

# Create repo on GitHub and push
git remote add origin https://github.com/your-username/job-portal.git
git branch -M main
git push -u origin main
```

---

## Step 4: Deploy to Render

### Option A: Using render.yaml (Automatic)

1. **Visit**: https://render.com
2. **Sign up** with GitHub
3. Click **"New +"** → **"Blueprint"**
4. **Connect Repository**: Select your `job-portal` repo
5. Render will auto-detect `render.yaml`
6. **Add Environment Variables** (when prompted):
   ```
   MONG_URI = mongodb+srv://jobportal-admin:yourpassword@cluster0.xxxxx.mongodb.net/jobportal?retryWrites=true&w=majority
   SECRET_KEY = your_super_secret_jwt_key_12345
   CLOUD_NAME = your_cloudinary_cloud_name
   API_KEY = your_cloudinary_api_key
   API_SECRET = your_cloudinary_api_secret
   ```
7. Click **"Apply"**

### Option B: Manual Setup

1. **Visit**: https://render.com
2. **Sign up** with GitHub
3. Click **"New +"** → **"Web Service"**
4. **Connect Repository**: Select your `job-portal` repo
5. **Settings**:
   ```
   Name: job-portal-backend
   Region: Singapore (or closest)
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```
6. **Environment Variables**:
   ```
   PORT = 8000
   NODE_ENV = production
   MONG_URI = mongodb+srv://...
   SECRET_KEY = your_super_secret_jwt_key
   CLOUD_NAME = cloudinary_name
   API_KEY = cloudinary_key
   API_SECRET = cloudinary_secret
   ```
7. Click **"Create Web Service"**

---

## Step 5: Get Backend URL

After deployment (takes 3-5 minutes):

**Your Backend URL**: `https://job-portal-backend.onrender.com`

Test it: Visit → `https://job-portal-backend.onrender.com/api/health`

Should see: `"Welcome to the InternshipPortal Backend!"`

---

## Step 6: Update Frontend with Backend URL

### Vercel Dashboard:

1. Visit: https://vercel.com/m-areebs-projects/jobportal/settings/environment-variables
2. **Add/Update Variables**:
   ```
   VITE_API_BASE_URL = https://job-portal-backend.onrender.com
   VITE_SOCKET_URL = https://job-portal-backend.onrender.com
   ```
3. **Redeploy Frontend**:
   ```bash
   cd frontend
   vercel --prod
   ```

---

## Step 7: Test Everything

### Test Backend:
```bash
# Health check
curl https://job-portal-backend.onrender.com/api/health

# Should return: "Welcome to the InternshipPortal Backend!"
```

### Test Frontend:
Visit: https://jobportal-xi-two.vercel.app

---

## Step 8: Run K6 Load Test (Local Machine)

### Local Testing (500 users):
```bash
k6 run load-tests\500-user-test.js
```

### Production Testing (50 users - safe for free tier):
```bash
k6 run -e TARGET=production -e API_URL=https://job-portal-backend.onrender.com load-tests\500-user-test.js
```

⚠️ **Warning**: Do NOT run 500 user test on production free tier - it will crash!

---

## 🎉 Final URLs

- **Frontend (Client Link)**: https://jobportal-xi-two.vercel.app
- **Backend API**: https://job-portal-backend.onrender.com
- **Backend Health**: https://job-portal-backend.onrender.com/api/health

---

## 🔧 Troubleshooting

### Issue 1: CORS Error
**Fix**: Make sure frontend URL is added in backend CORS (already done in code!)

### Issue 2: Database Connection Error
**Fix**: Check MongoDB Atlas:
- Network Access: Allow 0.0.0.0/0
- Connection string is correct
- Password has no special characters that need encoding

### Issue 3: Cold Start (First request takes 15-30 sec)
**Normal**: Render free tier spins down after 15 min inactivity. First request wakes it up.

### Issue 4: Images not uploading
**Fix**: Check Cloudinary credentials in Render environment variables

---

## 📊 Monitor Your App

- **Render Dashboard**: https://dashboard.render.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **MongoDB Atlas**: https://cloud.mongodb.com

---

## 🎯 Next Steps

1. ✅ Backend deployed on Render
2. ✅ Frontend deployed on Vercel
3. ✅ Database on MongoDB Atlas
4. ✅ Images on Cloudinary
5. ✅ K6 load testing ready

**Give the frontend link to your client**: https://jobportal-xi-two.vercel.app

---

## 💡 Free Tier Limits

- **Render**: 750 hours/month, spins down after 15 min
- **Vercel**: Unlimited for hobby projects
- **MongoDB Atlas**: 512MB storage
- **Cloudinary**: 25 credits/month

Need more? Upgrade to paid tiers later!
