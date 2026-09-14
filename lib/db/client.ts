import "server-only";

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@/lib/db/schema";

let pool: Pool | undefined;

export function getDatabase() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is required to use the Pulse database.");
  }

  pool ??= new Pool({ connectionString });
  return drizzle({ client: pool, schema });
}
