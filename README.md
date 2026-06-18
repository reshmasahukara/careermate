
# CareerMate - AI-Powered Career Acceleration Platform

CareerMate is a complete, production-ready SaaS application designed to help users optimize resumes, analyze ATS match scores, discover jobs, benchmark skill gaps, and follow personalized learning roadmaps.

## 🚀 Key Features

1. **Calculated ATS Scores**: Compares uploaded resumes against target roles, evaluating keyword matching and layout formatting.
2. **AI Resume Analysis**: Audits resume structure, experience metrics, education formats, and active action verbs.
3. **Filterable Job Listings**: Curated job listings filterable by location, salary, experience, remote status, and skills.
4. **Skill Gap Diagnostics**: Double-axis chart comparing required skill levels against current proficiencies.
5. **Interactive Learning Roadmaps**: Week-by-week timelines with checkboxes that dynamically update progress.
6. **Robust Auth State**: Fully integrated NextAuth JWT sessions with built-in sandbox demo configurations.
7. **Print-Ready PDF Reports**: Print/download visual reports designed with custom print styles.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, Framer Motion, Recharts, React Hook Form, Zod.
- **Backend**: Next.js Server Actions and API routes.
- **Database & ORM**: Prisma ORM with connection pooling support.
- **Hosting Target**: Vercel & Neon PostgreSQL.

---

## 💻 Getting Started Locally

### 1. Clone the project
```bash
git clone <repository-url>
cd careermate
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
Create a `.env` file in the root based on `.env.example`:
```bash
cp .env.example .env
```
Fill in the parameters. If you leave `DATABASE_URL` empty, the application **automatically falls back to a high-fidelity local memory database** so you can preview, upload, check, and edit skills instantly with no setup!

### 4. Database Initialization (Only if DATABASE_URL is configured)
```bash
npx prisma db push
```

### 5. Start development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🛠️ Sandbox Demo Mode

For easy evaluation, a demo credentials set is seeded.
On the Login screen, click the **"Use Demo Account"** button or enter:
- **Email**: `alex@example.com`
- **Password**: `password123` (or any password >= 6 characters)

This automatically signs you in as a candidate with uploaded resumes, matching history, bookmarks, and learning paths.

---

## 📦 Database Connection & Neon Guide

CareerMate uses **Prisma** to interface with Neon PostgreSQL.

1. **Database URL**: Sign up on [Neon.tech](https://neon.tech), create a database, and copy the connection string.
2. Add the connection string to `DATABASE_URL` inside your `.env` file. Ensure `?sslmode=require` is appended to the connection string.
3. Run `npx prisma generate` to generate query client types.
4. Run `npx prisma db push` to push the schema tables to your Neon database instance.

---

## ☁️ Cloudinary Storage Integration

1. Sign up on [Cloudinary](https://cloudinary.com) and retrieve your cloud credentials (cloud name, API key, API secret).
2. Store these keys in `.env` to connect live resume file uploads.
3. If keys are not present, CareerMate uses a simulated upload progress bar and saves file meta locally.

---

## ⚡ Vercel Deployment Instructions

1. Push your repository to **GitHub**.
2. Connect your GitHub account to **Vercel**.
3. Import the `careermate` project.
4. In the Project configuration screen on Vercel:
   - Framework Preset: **Next.js**
   - Configure Environment Variables (from your `.env` file).
5. Click **Deploy**. Vercel will automatically compile, optimize, and serve your app.
