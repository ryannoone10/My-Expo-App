// adapted from https://github.com/rorypierce111/react-native-lab/blob/main/app/_layout.tsx
// Auth pattern adapted from: https://medium.com/@david.ryan.hall/setting-up-a-basic-login-flow-for-an-expo-application-0b62b2b3e448
// Expo docs - Authentication: https://docs.expo.dev/develop/authentication/
// Tutorial: Tutorial 04/03 Step 1: createContext, Provider pattern
import { db } from '@/db/index';
import { migrate } from '@/db/migrate';
import { applications as applicationsTable, categories as categoriesTable, applicationStatusLogs as statusLogsTable, users as usersTable } from '@/db/schema';
import { seed } from '@/db/seed';
import { getStoredUserId } from '@/lib/auth';
import { eq, InferSelectModel } from 'drizzle-orm';
import { Stack } from 'expo-router';
import { createContext, useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

export type Application = InferSelectModel<typeof applicationsTable>;
export type Category = InferSelectModel<typeof categoriesTable>;
export type StatusLog = InferSelectModel<typeof statusLogsTable>;
export type User = InferSelectModel<typeof usersTable>;

type AppContextType = {
  applications: Application[];
  setApplications: React.Dispatch<React.SetStateAction<Application[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  statusLogs: StatusLog[];
  setStatusLogs: React.Dispatch<React.SetStateAction<StatusLog[]>>;
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
};

export const AppContext = createContext<AppContextType | null>(null);

export default function RootLayout() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [statusLogs, setStatusLogs] = useState<StatusLog[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      await migrate();
      await seed();

    //check for stored login session
      const userId = await getStoredUserId();
      if (userId) {
        const [user]= await db.select().from(usersTable).where(eq(usersTable.id, userId));
        if (user) {
          setCurrentUser(user);
        }
      }

      const appRows = await db.select().from(applicationsTable);
      const catRows = await db.select().from(categoriesTable);
      const logRows = await db.select().from(statusLogsTable);
      setApplications(appRows);
      setCategories(catRows);
      setStatusLogs(logRows);
      setIsReady(true);
    };
    void loadData();
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 12 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <AppContext.Provider value={{ applications, setApplications, categories, setCategories, statusLogs, setStatusLogs, currentUser, setCurrentUser }}>
      <Stack />
    </AppContext.Provider>
  );
}