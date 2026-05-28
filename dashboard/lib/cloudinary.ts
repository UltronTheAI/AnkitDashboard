import { v2 as cloudinary } from "cloudinary";

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

export function getCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    throw new Error("Missing CLOUDINARY_CLOUD_NAME");
  }

  const apiKey = requireEnv("CLOUDINARY_API_KEY");
  const apiSecret = requireEnv("CLOUDINARY_API_SECRET");

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  return cloudinary;
}
