// Tab layout with auth guard
// Auth guard pattern: https://medium.com/@david.ryan.hall/setting-up-a-basic-login-flow-for-an-expo-application-0b62b2b3e448
// Expo docs - Authentication: https://docs.expo.dev/develop/authentication/
import { Redirect, Tabs } from 'expo-router';
import { useContext } from 'react';
import { AppContext } from '../_layout';

export default function TabLayout() {
  const context = useContext(AppContext);

  if (!context?.currentUser) {
    return <Redirect href={"/login" as any} />;
  }

  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Applications' }} />
      <Tabs.Screen name="insights" options={{ title: 'Insights' }} />
      <Tabs.Screen name="targets" options={{ title: 'Targets' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}