import { SymbolView } from 'expo-symbols';
import { Redirect, Tabs } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/src/providers/AuthProvider';

const tint = '#d5a84c';

export default function AppLayout() {
  const { isLoading, session } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerRight: () => <SignOutButton />,
        headerStyle: { backgroundColor: '#111511' },
        headerTintColor: '#f5f1e8',
        tabBarActiveTintColor: tint,
        tabBarInactiveTintColor: '#8d9488',
        tabBarStyle: { backgroundColor: '#111511', borderTopColor: '#2b3029' },
      }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <TabIcon color={color as string} name="chart.bar.fill" />,
        }}
      />
      <Tabs.Screen
        name="course/index"
        options={{
          title: 'Course',
          tabBarIcon: ({ color }) => <TabIcon color={color as string} name="book.closed.fill" />,
        }}
      />
      <Tabs.Screen
        name="goals/index"
        options={{
          title: 'Goals',
          tabBarIcon: ({ color }) => <TabIcon color={color as string} name="target" />,
        }}
      />
      <Tabs.Screen
        name="battle-report/index"
        options={{
          title: 'Battle Report',
          tabBarIcon: ({ color }) => <TabIcon color={color as string} name="checklist" />,
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabIcon color={color as string} name="person.fill" />,
        }}
      />
    </Tabs>
  );
}

function SignOutButton() {
  const { signOut } = useAuth();

  return (
    <Pressable onPress={signOut} style={styles.signOut}>
      <Text style={styles.signOutText}>Sign out</Text>
    </Pressable>
  );
}

function TabIcon({ color, name }: { color: string; name: string }) {
  return <SymbolView name={{ ios: name, android: name, web: name } as never} size={24} tintColor={color} />;
}

const styles = StyleSheet.create({
  centered: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  signOut: { paddingHorizontal: 14, paddingVertical: 8 },
  signOutText: { color: tint, fontSize: 14, fontWeight: '700' },
});
