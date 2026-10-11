# 0 → Shipped Resume Parser

A React and Vite frontend with an Express API. Upload a PDF resume and paste a
job description to see a deterministic skill overlap score, skills found, and
skills missing. AI scoring is intentionally left for a later iteration.

## Run locally

Requirements: Node.js and MongoDB (local or hosted).

1. Start MongoDB and configure `backend/.env` (copy `backend/.env.example`):

   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/resume_parser
   PORT=3001
   ```

2. In one terminal, start the API:

   ```sh
   cd backend
   npm install
   npm run dev
   ```

3. In another terminal, start the frontend:

   ```sh
   cd frontend
   npm install
   npm run dev
   ```

Open the URL printed by Vite. It proxies `/api` requests to the Express server
on port 3001. The API health endpoint is `http://localhost:3001/api/health`.
Uploaded PDFs are held in memory and limited to 5 MB. Analysis records are
written to the MongoDB `analyses` collection.

The backend is organized by responsibility: `routes/` defines endpoints,
`controller/` handles request and response logic, `service/` contains PDF and
skill analysis, `config/` connects MongoDB, `middleware/` handles uploads and
errors, and `utils.js` contains shared helpers.

## Deploy on Vercel

Create one Vercel project using the repository root. The root `vercel.json`
defines separate `frontend` (Vite) and `backend` (Express) services. Requests
under `/api/*` go to the backend; all other paths go to the frontend. Set
`MONGO_URI` in the Vercel project's environment variables to your hosted
MongoDB connection string. The frontend calls the API through the same domain,
so it does not need a separate `VITE_API_URL`.
