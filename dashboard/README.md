Ankit Bhati resource-request website (Next.js).

## Getting Started

### Environment

Set these in `dashboard/.env`:

- `MONGODB_URI` (MongoDB connection string)
- `ACCESS_TOKEN` (admin token for `/admin`)
- `SMTP_HOST` (Hostinger SMTP host)
- `SMTP_PORT` (usually `587` or `465`)
- `SMTP_USER` (SMTP username)
- `SMTP_PASS` (SMTP password)
- `SMTP_FROM` (optional, defaults to `SMTP_USER`)

### Run

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Pages

- `/` Request a resource (saves submission to MongoDB and emails the link to the user)
- `/saved-info` Saves user info to browser localStorage (autofill)
- `/admin` Admin dashboard (content CRUD + CSV export of form submissions)
