import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const nodeEnv = process.env.NODE_ENV || 'development';
const jwtSecret = process.env.JWT_SECRET || 'campuslend-dev-secret-key-super-secure-2026';

if (nodeEnv === 'production' && (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32)) {
  throw new Error('FATAL SECURITY ERROR: JWT_SECRET must be set and at least 32 characters in production.');
}

export const config = {
  nodeEnv,
  port: parseInt(process.env.PORT || '5000', 10),
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/campuslend',
  jwt: {
    secret: jwtSecret,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    algorithm: 'HS256' as const,
  },
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
} as const;

export type AppConfig = typeof config;
