// Used existing scheama to get migrations file through AI assistence, to save time, Slight adaption from response.
//  https://www.perplexity.ai/search/can-u-create-a-migrate-ts-file-5mWuZcUMTJq4jef76GazAA 
import { sql } from 'drizzle-orm';
import { db } from './index';

export async function migrate() {
  await db.run(sql`CREATE TABLE IF NOT EXISTS users (
      id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
      username text NOT NULL UNIQUE,
      email text NOT NULL UNIQUE,
      password_hash text NOT NULL,
      created_at integer NOT NULL
    )`);

  await db.run(sql`CREATE TABLE IF NOT EXISTS categories (
      id integer PRIMARY KEY AUTOINCREMENT  NOT NULL,
      user_id integer REFERENCES users(id) NOT NULL,
      name text NOT NULL,
      colour text NOT NULL,
      icon text NOT NULL
    )`);

  await db.run(sql`
    CREATE TABLE IF NOT EXISTS applications (
      id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
      user_id integer REFERENCES users(id) NOT NULL,
      category_id integer REFERENCES categories(id),
      company_name text NOT NULL,
      position text NOT NULL,
      notes text,
      metric integer NOT NULL DEFAULT 1,
      applied_at integer NOT NULL,
      created_at integer NOT NULL
    )`);

  await db.run(sql`
    CREATE TABLE IF NOT EXISTS application_status_logs (
      id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
      application_id integer REFERENCES applications(id) NOT NULL,
      old_status integer NOT NULL,
      new_status integer NOT NULL,
      changed_at integer NOT NULL
    )`);

  await db.run(sql`
    CREATE TABLE IF NOT EXISTS targets (
      id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
      user_id integer REFERENCES users(id) NOT NULL,
      period text NOT NULL,
      goal_value integer NOT NULL
    )`);

    console.log("Migrations completed");
}