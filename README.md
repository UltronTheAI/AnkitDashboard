# Ankit Dashboard

A full-stack resource request portal. Visitors browse resources and request email delivery, while a token-protected admin area manages content, uploads, and submissions.

## Features

- Resource search, saved visitor details, and daily request limits
- Admin CRUD, Cloudinary uploads, pagination, and CSV export
- MongoDB persistence and email delivery

## Tech stack

Next.js, React, TypeScript, Tailwind CSS, MongoDB, Cloudinary, and Nodemailer.

## Setup

```bash
cd dashboard
npm install
npm run dev
```

Configure the MongoDB, mail, Cloudinary, site URL, and admin-token variables referenced in `dashboard/lib/`. Open `http://localhost:3000`; administration is at `/admin`.

## License

See [LICENSE](LICENSE).
