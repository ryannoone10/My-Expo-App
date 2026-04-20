// Auth helper functions, local SQLite authentication
// SQLite offline login pattern: https://github.com/quangvietntd/SQLiteDemo3
// Offline auth with password_hash: https://dev.to/tuliocalil/offline-auth-with-electron-sqlite-react-986
// Lecture: Week 12 slide 10: "hash with bcrypt before storing in SQLite"
// Expo docs: Crypto: https://docs.expo.dev/versions/latest/sdk/crypto/
import { db } from '@/db/index';
import { users } from '@/db/schema';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { eq } from 'drizzle-orm';
import * as Crypto from 'expo-crypto';

// Hash password using SHA-256 (expo-crypto)
export async function hashPassword(password: string): Promise<string> {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  );
}

export async function register(username: string, email: string, password: string) {
  const existing = await db.select().from(users).where(eq(users.email, email));
  if (existing.length > 0) {
    throw new Error('An account with this email already exists');
  }

  const existingUsername = await db.select().from(users).where(eq(users.username, username));
  if (existingUsername.length > 0) {
    throw new Error('This username is already taken');
  }

  const passwordHash = await hashPassword(password);
  const now = Math.floor(Date.now() / 1000);

  const [user] = await db.insert(users).values({
    username: username.trim(),
    email: email.trim().toLowerCase(),
    passwordHash,
    createdAt: now,
  }).returning();

  // Persist login session
  await AsyncStorage.setItem('@userId', String(user.id));

  return user;
}

export async function login(email: string, password: string) {
  const passwordHash = await hashPassword(password);

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.trim().toLowerCase()));

  if (!user) {
    throw new Error('No account found with this email');
  }

  if (user.passwordHash !== passwordHash) {
    throw new Error('Incorrect password');
  }

  // Persist login session
  await AsyncStorage.setItem('@userId', String(user.id));

  return user;
}

export async function logout() {
  await AsyncStorage.removeItem('@userId');
}

export async function getStoredUserId(): Promise<number | null> {
  const id = await AsyncStorage.getItem('@userId');
  return id ? Number(id) : null;
}

export async function deleteAccount(userId: number) {
  await db.delete(users).where(eq(users.id, userId));
  await AsyncStorage.removeItem('@userId');
}