import { registerAs } from '@nestjs/config';

export const CLOUDINARY_CONFIG = registerAs('cloudinary', () => ({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
}));