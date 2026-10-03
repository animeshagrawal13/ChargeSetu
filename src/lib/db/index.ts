import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// This allows the app to build even if the DATABASE_URL is not set yet.
// In production/Vercel, you must provide DATABASE_URL.
const sql = neon(process.env.DATABASE_URL || 'postgresql://dummy:dummy@dummy.neon.tech/dummy');
export const db = drizzle(sql, { schema });
