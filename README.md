Personal Finance Tracker - Frontend

Setup

1. Create `.env` with:
   - `VITE_API_BASE_URL=https://expense-tracker-kmek.onrender.com`
2. Install dependencies: `npm install`
3. Run dev: `npm run dev`

Pages
- Signup `/signup`
- Login `/login`
- Dashboard `/` (requires login)

Notes
- Auth token stored in localStorage by `AuthContext`.
- API client in `src/lib/api.ts` uses `VITE_API_BASE_URL`.


