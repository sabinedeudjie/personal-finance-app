import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { URL } from 'url';

export function createDbAdapter() {
  const dbUrlStr = process.env.DATABASE_URL;
  if (!dbUrlStr) {
    throw new Error('DATABASE_URL is not defined in environment variables');
  }

  const url = new URL(dbUrlStr);
  return new PrismaMariaDb({
    host: url.hostname,
    port: parseInt(url.port || '3306'),
    user: url.username,
    password: decodeURIComponent(url.password || ''),
    database: url.pathname.replace(/^\//, ''),
    connectionLimit: 10,
  });
}
