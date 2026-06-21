# MERN-style Portfolio (Next.js + MongoDB)

A developer portfolio with a public site and a hidden admin panel for managing all content
(hero text, photo, CV, skills, experience, projects, contact links) — no redeploy needed to update content.

## Stack
- **Next.js 14** (App Router) — frontend + API routes (replaces a separate Express server)
- **MongoDB** with **Mongoose** — database
- **JWT + httpOnly cookies** — admin authentication
- **bcryptjs** — password hashing

## 1. Install dependencies
```
npm install
```

## 2. Set up environment variables
Copy `.env.example` to `.env.local` and fill in:
```
MONGODB_URI=your MongoDB Atlas (or local) connection string
JWT_SECRET=a long random string
ADMIN_EMAIL=the email you'll log in with
ADMIN_PASSWORD=a strong password
```

## 3. Create your admin account
This runs once to create the only admin account, using ADMIN_EMAIL / ADMIN_PASSWORD above:
```
npm run seed
```

## 4. Run the app
```
npm run dev
```
- Public site: http://localhost:3000
- Admin login (NOT linked anywhere on the public site): http://localhost:3000/admin/login

## How content management works
- Everything (hero text, photo, CV link, skills, experience, projects, contact links) lives in MongoDB.
- Log in at `/admin/login` with the account you seeded.
- `/admin/dashboard` is protected by middleware — visiting it without a valid session redirects to the login page.
- Edits save immediately to the database and appear on the public homepage on refresh (no rebuild/redeploy required).

## Notes on images & the CV file
This starter stores **URLs** for the photo, CV, and project screenshots (not file uploads), so you have two options:
1. Upload images/PDFs somewhere like Cloudinary, Imgur, or your own storage, and paste the URL into the admin dashboard.
2. Add a file upload route later (e.g. using Cloudinary's API) if you'd like in-dashboard uploads instead of URLs — happy to add this if needed.

## Deploying
This is a standard Next.js app — deploys cleanly to Vercel. Add the same environment variables
(`MONGODB_URI`, `JWT_SECRET`) in your hosting provider's dashboard, and use a MongoDB Atlas
connection string (rather than `localhost`) so the database is reachable from production.
