# Doctor Appointment Scheduler

A lightweight clinic scheduling web app built with Next.js. It lets staff:

- view doctors
- book appointments
- see upcoming patient visits
- cancel appointments

## Features

- Modern dashboard interface
- Appointment booking form
- Validation for duplicate time slots
- Persistent data file using local JSON storage
- Responsive UI for desktop and mobile

## Quick start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open http://localhost:3000 in the browser.

## Production build

```bash
npm run build
npm run start
```

## Project structure

- `app/` – Next.js pages and API routes
- `components/` – dashboard UI
- `data/` – clinic seed data
- `lib/` – local storage logic

## Notes

Data is stored in `data/clinic-data.json`, so the app is easy to run without a database.
