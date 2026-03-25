# wepps — Personal Portfolio

A clean, mobile-first portfolio website for showcasing web apps and attracting clients.
Built with Next.js 15, Firebase, and Tailwind CSS. Deployed on Vercel.

**Replace "wepps" with your final company name when you decide on it.**

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, `src/` directory) |
| Language | TypeScript |
| Styling | Tailwind CSS + CSS variables |
| Database | Firebase Firestore |
| File Storage | Firebase Storage |
| Hosting | Vercel |
| Version control | GitHub |
| Editor | VS Code |

---

## Project structure

```
wepps/
├── src/
│   ├── app/
│   │   ├── admin/          ← Admin dashboard (password protected)
│   │   ├── about/          ← About page
│   │   ├── contact/        ← Contact form
│   │   ├── services/       ← Services page
│   │   ├── api/
│   │   │   ├── contact/    ← Saves inquiries to Firestore
│   │   │   └── projects/   ← Projects API (future use)
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx        ← Home / portfolio grid
│   ├── components/
│   │   ├── Navbar.tsx
│   │   └── ProjectCard.tsx
│   └── lib/
│       └── firebase.ts     ← All Firebase CRUD + types
├── firestore.rules
├── storage.rules
├── .env.local.example
└── README.md
```

---

## Step-by-step setup

### Step 1 — Prerequisites

Make sure you have these installed:

- **Node.js v18+** → https://nodejs.org (download LTS)
- **Git** → https://git-scm.com
- **VS Code** → https://code.visualstudio.com

Verify in your terminal:
```bash
node -v    # should show v18 or higher
git --version
```

---

### Step 2 — Create your GitHub repository

1. Go to https://github.com and sign in
2. Click **New repository**
3. Name it `wepps` (or your chosen name)
4. Set it to **Private**
5. Do NOT initialize with README (we already have files)
6. Click **Create repository**
7. Copy the repository URL (e.g. `https://github.com/YourName/wepps.git`)

---

### Step 3 — Open the project in VS Code

1. Unzip the downloaded project folder
2. Open VS Code
3. Go to **File → Open Folder** and select the `wepps` folder
4. Open the integrated terminal: **Terminal → New Terminal**

---

### Step 4 — Set up Firebase

1. Go to https://console.firebase.google.com
2. Click **Add project**, name it `wepps`, click through the setup
3. On the project overview, click **< />** (Web app) to add a web app
4. Name it `wepps-web`, click **Register app**
5. Copy the `firebaseConfig` values — you will need them in Step 6

**Enable Firestore:**
1. In Firebase Console → **Build → Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (we'll tighten rules later)
4. Select a region close to you → **Enable**

**Enable Storage:**
1. In Firebase Console → **Build → Storage**
2. Click **Get started**
3. Choose **Start in test mode** → **Done**

---

### Step 5 — Set up environment variables

In VS Code terminal, run:
```bash
cp .env.local.example .env.local
```

Then open `.env.local` and fill in your values:

```env
# From your Firebase project settings:
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Choose any password you want for the admin dashboard:
NEXT_PUBLIC_ADMIN_PASSWORD=your_secret_password_here
```

**Important:** `.env.local` is in `.gitignore` — it will NEVER be pushed to GitHub. Keep it safe.

---

### Step 6 — Install dependencies and run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

You should see the portfolio home page.
Visit http://localhost:3000/admin to access the admin dashboard.

---

### Step 7 — Push to GitHub

In VS Code terminal:

```bash
git init
git add .
git commit -m "Initial commit — wepps portfolio"
git branch -M main
git remote add origin https://github.com/YourName/wepps.git
git push -u origin main
```

Replace the URL with your actual GitHub repo URL from Step 2.

---

### Step 8 — Deploy on Vercel

1. Go to https://vercel.com and sign in (use your GitHub account)
2. Click **Add New → Project**
3. Click **Import** next to your `wepps` repository
4. Vercel auto-detects Next.js — no build settings needed
5. Click **Environment Variables** and add ALL variables from your `.env.local`:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_ADMIN_PASSWORD`
6. Click **Deploy**

Every `git push` to `main` after this will automatically redeploy. ✓

---

### Step 9 — Add your first app to the portfolio

1. Visit `https://your-site.vercel.app/admin`
2. Enter your admin password
3. Click **+ Add app**
4. Fill in: name, description, live URL, upload a screenshot
5. Set status to **Live**
6. Click **Add app**

It appears instantly on the public portfolio. 🎉

---

## Daily workflow (after initial setup)

```bash
# Make changes in VS Code
git add .
git commit -m "Describe what you changed"
git push
# Vercel deploys automatically — live in ~30 seconds
```

---

## Admin dashboard

**URL:** `/admin`  
**Password:** set via `NEXT_PUBLIC_ADMIN_PASSWORD` in your environment variables

Features:
- Add, edit, delete portfolio apps
- Upload screenshots (stored in Firebase Storage)
- Set apps as Live or Draft
- Control display order
- View all contact form inquiries
- Mark inquiries as read
- Reply directly by email

---

## Updating the company name

When you decide on your final name, do a find-and-replace in VS Code:
1. Press **Ctrl+Shift+H** (Windows) or **Cmd+Shift+H** (Mac)
2. Search for `wepps`
3. Replace with your new name
4. Files to update: `layout.tsx`, `page.tsx`, `Navbar.tsx`, `AdminPage`, `globals.css`
5. Also update `package.json` → `"name"` field
6. Push to GitHub → Vercel redeploys

---

## Firestore security (before going public)

Once you've confirmed everything works, update Firestore rules in the Firebase Console
(Build → Firestore → Rules) to match `firestore.rules` in this project.

This prevents unauthorized writes to your projects collection from the browser.

---

## Placeholder name tracking

Names considered so far:
- `wepps` ← current placeholder
- `Buildr Studio`
- `Pixlit`
- `AppForge`

Update this list as you brainstorm.
