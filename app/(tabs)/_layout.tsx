// Tab layout with auth guard
// Auth guard pattern: https://medium.com/@david.ryan.hall/setting-up-a-basic-login-flow-for-an-expo-application-0b62b2b3e448
// Expo docs - Authentication: https://docs.expo.dev/develop/authentication/
import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { useContext, useEffect } from 'react';
import { AppContext } from '../_layout';

export default function TabLayout() {
  const context = useContext(AppContext);
  const router = useRouter();

  useEffect(() => {
    if (!context?.currentUser) {
      router.replace('/login');
    }
  }, [context?.currentUser]);

  if (!context?.currentUser) {
    return null;
  }

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Applications',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="briefcase-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: 'Insights',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bar-chart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="targets"
        options={{
          title: 'Targets',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="flag-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}