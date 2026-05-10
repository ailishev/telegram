import dotenv from 'dotenv';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({path: path.resolve(__dirname, '../../.env')});

export const env = {
  port: Number(8000),
  sessionTtlMs: 1000 * 60 * 60 * 24 * 30,
  otpTtlMs: 1000 * 60 * 5,
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  cloudinaryUploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET || ''
};
