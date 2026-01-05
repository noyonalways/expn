import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';;
import * as schema from '../drizzle/schema';

const client = drizzle(process.env.DATABASE_URL!, { schema: schema });
export { client as drizzleClient };
export type DrizzleClient = typeof client;