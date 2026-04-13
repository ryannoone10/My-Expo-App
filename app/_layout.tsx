// adapted from https://github.com/rorypierce111/react-native-lab/blob/main/app/_layout.tsx
import { db } from '@/db/index';
import { migrate } from '@/db/migrate';
import { applications as applicationsTable, categories as categoriesTable } from '@/db/schema';
import { seed } from '@/db/seed';
import { InferSelectModel } from 'drizzle-orm';
import { Stack } from 'expo-router';
import { createContext, useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

export type Application = InferSelectModel<typeof applicationsTable>;
export type Category = InferSelectModel<typeof categoriesTable>;

type AppContextType = {
  applications: Application[];
  setApplications: React.Dispatch<React.SetStateAction<Application[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
};

export const AppContext = createContext<AppContextType | null>(null);

export default function RootLayout() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      await migrate();
      await seed();
      const appRows = await db.select().from(applicationsTable);
      const catRows = await db.select().from(categoriesTable);
      setApplications(appRows);
      setCategories(catRows);
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
    <AppContext.Provider value={{ applications, setApplications, categories, setCategories }}>
      <Stack />
    </AppContext.Provider>
  );
}