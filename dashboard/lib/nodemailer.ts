import nodemailer from "nodemailer";

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

export function getMailer() {
  const host = requireEnv("SMTP_HOST");
  const port = Number(process.env.SMTP_PORT ?? "587");
  const user = requireEnv("SMTP_USER");
  const pass = requireEnv("SMTP_PASS");

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  const from = process.env.SMTP_FROM ?? user;

  return { transporter, from };
}

