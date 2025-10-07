# Riqueza Electric - Vercel Deployment Guide

## 🚀 Frontend Deployment (Next.js)

### 1. Connect to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "New Project"
3. Import your `riqueza-frontend` repository
4. Vercel will auto-detect Next.js framework

### 2. Environment Variables
Set these in Vercel dashboard under Project Settings → Environment Variables:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app
NEXT_PUBLIC_TWILIO_ACCOUNT_SID=your_twilio_account_sid
NEXT_PUBLIC_TWILIO_AUTH_TOKEN=your_twilio_auth_token
NEXT_PUBLIC_TWILIO_PHONE_NUMBER=+1234567890
```

### 3. Build Settings
- **Framework Preset**: Next.js
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

## 🔧 Backend Deployment (Node.js)

### 1. Connect Backend to Vercel
1. Create a new Vercel project
2. Import your `riqueza-backend` repository
3. Select "Other" as framework

### 2. Backend Environment Variables
Set these in Vercel dashboard:

```
DB_NAME=riqueza
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=your_database_host
DB_PORT=5432
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.vercel.app
JWT_SECRET=your_super_secret_jwt_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

### 3. Build Settings for Backend
- **Framework Preset**: Other
- **Root Directory**: `./`
- **Build Command**: `npm run build`
- **Output Directory**: `./`
- **Install Command**: `npm install`

## 📊 Database Setup

### Option 1: Use Existing Database
If you have a PostgreSQL database:
1. Update the environment variables with your database credentials
2. The app will connect automatically

### Option 2: Create New Database
1. Use services like:
   - **Neon** (recommended for Vercel)
   - **Supabase**
   - **Railway**
   - **PlanetScale**

2. Get connection details and update environment variables

## 🔄 Deployment Steps

1. **Deploy Backend First**
   - Deploy `riqueza-backend` to Vercel
   - Note the backend URL (e.g., `https://riqueza-backend.vercel.app`)

2. **Deploy Frontend**
   - Deploy `riqueza-frontend` to Vercel
   - Set `NEXT_PUBLIC_API_URL` to your backend URL

3. **Update URLs**
   - Update backend's `FRONTEND_URL` to your frontend URL
   - Redeploy both if needed

## 🎯 Final URLs
- **Frontend**: `https://riqueza-frontend.vercel.app`
- **Backend**: `https://riqueza-backend.vercel.app`

## 🛠️ Troubleshooting

### Common Issues:
1. **CORS Errors**: Ensure backend has correct `FRONTEND_URL`
2. **Database Connection**: Check database credentials
3. **Environment Variables**: Verify all variables are set correctly
4. **Build Failures**: Check Node.js version compatibility

### Support:
- Check Vercel logs in dashboard
- Verify environment variables
- Test API endpoints manually
