# TinyLink - URL Shortening Service

TinyLink ek full-stack web application hai jo bit.ly jaisa kaam karta hai. Isme aap long URLs ko short links mein convert kar sakte ho, click statistics dekh sakte ho, aur links manage kar sakte ho.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Local Setup (Step by Step)](#local-setup-step-by-step)
- [Database Setup (Neon)](#database-setup-neon)
- [Running the Application](#running-the-application)
- [Testing the Application](#testing-the-application)
- [Deployment (Vercel)](#deployment-vercel)
- [Project Structure](#project-structure)
- [Features Explained](#features-explained)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

TinyLink ek URL shortening service hai jisme ye features hain:

- ✅ Long URLs ko short links mein convert karna
- ✅ Custom short codes (6-8 characters) set karna
- ✅ Click statistics dekhna (total clicks, last clicked time)
- ✅ Links delete karna
- ✅ Search/filter functionality
- ✅ Responsive UI (mobile, tablet, desktop)

---

## 🛠 Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS 4, React Hook Form, Zod
- **Backend:** Fastify 5, Prisma ORM, TypeScript, PostgreSQL (Neon)
- **Tooling:** Prisma Studio, TSX dev runner, npm scripts for each app

---

## 📁 Project Layout

Repo ab do independent apps mein split hai:

- `frontend/` → Next.js dashboard + client-facing UI (port `3000`)
- `backend/` → Fastify + Prisma REST API + redirector (port `4000`)

Har folder ka apna `package.json`, `node_modules`, aur `.env` hai. Setup steps niche dono apps ke liye diye gaye hain.

---

## 📦 Prerequisites

Pehle ye cheezein install honi chahiye:

1. **Node.js** (v18 ya higher)
   - Download: https://nodejs.org/
   - Verify: `node --version`

2. **npm** (Node.js ke saath automatically aata hai)
   - Verify: `npm --version`

3. **Git** (optional, GitHub ke liye)
   - Download: https://git-scm.com/

4. **Neon Account** (free database ke liye)
   - Sign up: https://neon.tech

---

## 🚀 Local Setup (Step by Step)

### Step 1: Project Download/Clone

Agar GitHub se clone kar rahe ho:

```bash
git clone https://github.com/YOUR_USERNAME/tinylink.git
cd tinylink
```

Ya agar already project folder mein ho, to directly next step par jao.

### Step 2: Dependencies Install Karo

Ab alag-alag app folders me packages install karne hain:

```bash
cd backend
npm install

cd ../frontend
npm install
```

Backend install Prisma + Fastify ke packages karega, aur frontend install Next.js related deps.

### Step 3: Environment Variables Setup

Ab dono folders ki env files configure karo.

#### 3.1 Frontend env

```bash
cd frontend
copy env.example .env.local   # Windows
# ya Mac/Linux: cp env.example .env.local
```

`frontend/.env.local` me minimum ye values daalo:

```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
NEXT_PUBLIC_SHORT_LINK_BASE_URL="http://localhost:4000"
```

Prod deploy pe ye URLs ko apne backend/redirect domain se replace karo.

#### 3.2 Backend env

```bash
cd backend
copy env.example .env    # Windows
# ya cp env.example .env
```

`backend/.env` me ye fields update karo:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/dbname?sslmode=require"
PORT=4000
HOST=0.0.0.0
FRONTEND_ORIGIN="http://localhost:3000"
```

`DATABASE_URL` ko Neon se actual value milegi (next section).

### Step 4: Database Setup (Neon)

#### 4.1 Neon Account Banao

1. https://neon.tech par jao
2. "Sign Up" karo (GitHub se sign up kar sakte ho)
3. Login karo

#### 4.2 New Project Create Karo

1. Dashboard par "Create Project" button click karo
2. Project name: `tinylink` (ya kuch bhi)
3. Region: `US East (Ohio)` ya apne paas wala
4. PostgreSQL version: Latest (15 ya 16)
5. "Create Project" click karo

#### 4.3 Connection String Copy Karo

1. Project dashboard par "Connection Details" section dikhega
2. "Connection string" copy karo
   - Format: `postgresql://username:password@host/dbname?sslmode=require`
3. Ye connection string `.env` file mein `DATABASE_URL` ki jagah paste karo

**Example:**
```env
DATABASE_URL="postgresql://neondb_owner:password123@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

#### 4.4 Database Schema Push Karo

Terminal mein ye commands run karo:

```bash
# Backend folder ke andar run karo
cd backend

# Database mein table create karega
npx prisma db push

# Prisma client generate karega (backend ke liye)
npx prisma generate
```

Agar sab sahi hai, to ye message dikhega:
```
✔ Your database is now in sync with your Prisma schema.
```

#### 4.5 Verify Database (Optional)

Database verify karne ke liye backend folder me Prisma Studio chalao:

```bash
cd backend
npx prisma studio
```

Ye browser mein automatically khol jayega (usually `http://localhost:5555`). Yahan aap `Link` table dikhni chahiye (abhi empty hogi).

---

## 🏃 Running the Application

### Backend Server Start Karo

```bash
cd backend
npm run dev
```

Fastify server port `4000` par chalega: http://localhost:4000 (healthcheck: `/healthz`)

### Frontend Server Start Karo

Dusre terminal/tab me:

```bash
cd frontend
npm run dev
```

Next.js dashboard http://localhost:3000 par chalega.

### Browser Mein Open Karo

Browser mein jao: **http://localhost:3000**

Dashboard page dikhni chahiye with:
- Header: "TinyLink Dashboard"
- Left side: Form to create short links
- Right side: Stats cards
- Bottom: Links table (abhi empty)

---

## 🧪 Testing the Application

### 1. Healthcheck Test

Browser mein jao: `http://localhost:3000/healthz`

Response aana chahiye:
```json
{
  "ok": true,
  "version": "1.0"
}
```

### 2. Create Short Link

1. Dashboard par "Destination URL" field mein koi URL daalo:
   - Example: `https://google.com`
2. (Optional) "Custom code" field mein 6-8 characters daalo:
   - Example: `google`
3. "Generate short link" button click karo
4. Success message dikhni chahiye with short link

### 3. Test Redirect

1. Browser mein short link open karo:
   - Example: `http://localhost:3000/google`
2. Original URL par redirect hona chahiye
3. Dashboard par wapas jao → Click count 1 dikhni chahiye

### 4. View Stats

1. Dashboard table mein link ke saamne "Stats" button click karo
   - Ya directly: `http://localhost:3000/code/google`
2. Stats page dikhni chahiye with:
   - Total clicks
   - Last clicked time
   - Created date

### 5. Delete Link

1. Dashboard table mein link ke saamne "Delete" button click karo
2. Confirmation dialog aayega
3. "Delete" confirm karo
4. Link table se remove ho jayega
5. Ab short URL visit karo → 404 error aana chahiye

### 6. Search/Filter

1. Dashboard table ke upar "Search by code or URL" field mein type karo
2. Table automatically filter ho jayega

---

## ☁️ Deployment (Vercel)

### Step 1: GitHub Repository

1. GitHub account login karo
2. New repository banao:
   - Repository name: `tinylink`
   - Public ya Private (apne hisaab se)
   - "Create repository" click karo

3. Local project ko GitHub par push karo:

```bash
# Git initialize (agar pehle se nahi hai)
git init

# Files add karo
git add .

# Commit karo
git commit -m "Initial commit - TinyLink setup"

# GitHub remote add karo (YOUR_USERNAME replace karo)
git remote add origin https://github.com/YOUR_USERNAME/tinylink.git

# Push karo
git branch -M main
git push -u origin main
```

### Step 2: Vercel Account

1. https://vercel.com par jao
2. "Sign Up" karo (GitHub se sign up recommended)
3. Login karo

### Step 3: Vercel Project Create

1. Dashboard par "Add New Project" click karo
2. GitHub repository select karo (`tinylink`)
3. Project settings:
   - **Framework Preset:** Next.js (auto-detect hoga)
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)
   - **Install Command:** `npm install` (default)

### Step 4: Environment Variables

Vercel (frontend) ke liye minimum ye vars add karo:

1. **NEXT_PUBLIC_API_URL**
   - Value: `https://your-backend-domain.com`
   - Ye Fastify backend ka public URL hai (Render/Railway/Neon Functions etc).

2. **NEXT_PUBLIC_SHORT_LINK_BASE_URL**
   - Value: `https://your-short-link-domain.com`
   - Ye wahi domain hai jaha redirect route host ho raha hai (backend).

Backend deploy karte waqt (Railway ya similar) waha pe `DATABASE_URL`, `PORT`, `HOST`, `FRONTEND_ORIGIN` set karo — same values jo `backend/.env` me hain.

### Step 5: Deploy

1. "Deploy" button click karo
2. 2-3 minutes wait karo
3. Deployment complete hone par "Visit" button click karo
4. Live URL mil jayega: `https://tinylink-xxx.vercel.app`

### Step 6: Post-Deployment

1. Live URL par `/healthz` test karo
2. Dashboard test karo
3. Short link create karo
4. Redirect test karo

**Note:** Production database mein schema already push ho chuka hai (Step 4.4), to Vercel automatically Prisma client generate kar lega.

---

## 📁 Project Structure

```
tinylink/
├── backend/
│   ├── env.example               # Backend env template
│   ├── package.json              # Fastify + Prisma deps
│   ├── tsconfig.json             # Backend TS config
│   ├── prisma/
│   │   └── schema.prisma         # Link model definition
│   └── src/
│       ├── env.ts                # dotenv + validation
│       ├── index.ts              # Server entrypoint
│       ├── server.ts             # Fastify builder
│       ├── lib/
│       │   ├── prisma.ts         # Prisma client
│       │   └── generateCode.ts   # Random code helper
│       └── routes/
│           ├── health.ts         # GET /healthz
│           ├── links.ts          # CRUD for links
│           └── redirect.ts       # GET /:code redirect
├── frontend/
│   ├── env.example               # Frontend env template
│   ├── package.json              # Next.js deps
│   ├── next.config.ts
│   ├── tsconfig.json
│   └── src/
│       ├── app/
│       │   ├── code/[code]/page.tsx  # Stats page
│       │   ├── healthz/route.ts      # Frontend healthcheck
│       │   ├── layout.tsx
│       │   ├── page.tsx              # Dashboard page
│       │   ├── types.ts
│       │   └── _components/...
│       └── lib/
│           ├── env.ts             # Frontend env helpers
│           ├── format.ts
│           └── validation.ts      # Zod schemas (client)
├── prisma.config.ts               # Points CLI to backend schema
├── package.json                   # (optional) workspace metadata
└── README.md                      # You are here
```

---

## ✨ Features Explained

### 1. Create Short Links

- Long URL daalo (required)
- Custom code daalo (optional, 6-8 alphanumeric characters)
- Agar custom code nahi diya, to automatically random code generate hoga
- Duplicate codes allowed nahi hain (409 error)

### 2. Dashboard

- Sabhi links ki table
- Search/filter by code ya URL
- Copy button (short link clipboard mein copy)
- Delete button
- Stats button (individual link stats page)

### 3. Redirect

- `/:code` URL visit karo
- Original URL par redirect (302)
- Click count automatically increment
- Last clicked time update

### 4. Stats Page

- Individual link ka detailed view
- Total clicks
- Last clicked time
- Created date
- Updated date

### 5. Delete Link

- Link delete karne par:
  - Table se remove
  - Database se delete
  - Short URL ab 404 return karega

---

## 🔌 API Endpoints

### Public Endpoints

| Method | Path | Description | Response |
|--------|------|-------------|----------|
| GET | `/healthz` | Healthcheck | `200 { ok: true, version: "1.0" }` |
| GET | `/:code` | Redirect to original URL | `302` (redirect) or `404` |
| GET | `/code/:code` | Stats page (HTML) | `200` (HTML) or `404` |

### API Endpoints

Backend base URL (local): **http://localhost:4000**

| Method | Path | Description | Request Body | Response |
|--------|------|-------------|--------------|----------|
| GET | `/links` | List all links | - | `200 SerializedLink[]` |
| POST | `/links` | Create link | `{ url: string, code?: string }` | `201 SerializedLink` or `409` |
| GET | `/links/:code` | Get link stats | - | `200 SerializedLink` or `404` |
| DELETE | `/links/:code` | Delete link | - | `200 { ok: true }` or `404` |

**Link Object:**
```typescript
{
  id: string;
  code: string;              // 6-8 alphanumeric characters
  url: string;               // Original URL
  totalClicks: number;       // Click count
  lastClickedAt: string | null;  // ISO date string
  createdAt: string;         // ISO date string
  updatedAt: string;         // ISO date string
}
```

---

## 🔧 Troubleshooting

### Problem: `@prisma/client did not initialize yet`

**Solution:**
```bash
npx prisma generate
```

### Problem: Database connection error

**Check:**
1. `.env` file mein `DATABASE_URL` sahi hai?
2. Neon database active hai?
3. Connection string mein special characters properly escaped hain?

**Solution:**
- Connection string ko quotes mein wrap karo: `"postgresql://..."`
- Neon dashboard se fresh connection string copy karo

### Problem: `npm install` fails

**Solution:**
```bash
# Cache clear karo
npm cache clean --force

# Node modules delete karo
rm -rf node_modules package-lock.json

# Phir se install karo
npm install
```

### Problem: Build fails on Vercel

**Check:**
1. Environment variables properly set hain?
2. `DATABASE_URL` production database ka hai?
3. Build logs mein koi error hai?

**Solution:**
- Vercel project settings → Environment Variables check karo
- Build logs dekh kar specific error fix karo

### Problem: Redirect not working

**Check:**
1. Link database mein exist karti hai?
2. Code sahi hai? (6-8 alphanumeric characters)
3. URL properly formatted hai?

**Solution:**
- Prisma Studio mein check karo: `npx prisma studio`
- Link delete karke phir se create karo

### Problem: Click count not updating

**Check:**
1. Database connection working hai?
2. Redirect route properly hit ho raha hai?

**Solution:**
- Browser console mein errors check karo
- Network tab mein redirect request verify karo

---

## 📝 Additional Notes

### Code Validation

- Short codes must be 6-8 alphanumeric characters: `[A-Za-z0-9]{6,8}`
- URLs must be valid HTTP/HTTPS URLs
- Custom codes are globally unique

### Database

- PostgreSQL database required
- Neon free tier sufficient hai (512 MB storage)
- Prisma ORM use karta hai for database operations

### Security

- `.env` file ko `.gitignore` mein add karo (already added)
- Production mein strong passwords use karo
- Connection strings ko publicly share mat karo

---

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Neon Documentation](https://neon.tech/docs)
- [Vercel Documentation](https://vercel.com/docs)

---

## 📄 License

This project is created for educational/assessment purposes.

---

## 🤝 Support

Agar koi problem aaye ya question ho, to:

1. Error message properly read karo
2. Troubleshooting section check karo
3. GitHub issues mein search karo
4. Documentation refer karo

**Happy Coding! 🚀**
