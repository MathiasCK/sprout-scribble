import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const sql = neon(
  "postgresql://neondb_owner:JITiKPowU85n@ep-winter-mouse-a5q1e4dl-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require",
);
const db = drizzle(sql, { schema, logger: true });

export default db;
