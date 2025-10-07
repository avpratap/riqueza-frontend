# Riqueza Electric - Frontend Setup

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy `env.example` to `.env.local`:

```bash
cp env.example .env.local
```

Then edit `.env.local` with your values:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Important**: 
- `.env.local` is gitignored (your secrets stay safe)
- `env.example` is committed (shows what variables are needed)
- **NO hardcoded credentials in code!**

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```

## 📦 Deployment

### Vercel Deployment
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = Your backend API URL
4. Deploy!

## 🔧 Configuration

All API URLs use the `NEXT_PUBLIC_API_URL` environment variable:
- **Local**: `http://localhost:5000/api`
- **Production**: Set in Vercel environment variables

**No hardcoded URLs in code!** ✅

