// https://orm.drizzle.team/docs/get-started/expo-new 
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import * as schema from './schema';

const expo = openDatabaseSync('job_tracker.db');
export const db = drizzle(expo, { schema });