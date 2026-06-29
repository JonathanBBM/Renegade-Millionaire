import { Redirect, Stack } from 'expo-router';

import { useAuth } from '@/src/providers/AuthProvider';

export default function AuthLayout() {
  const { isLoading, session } = useAuth();

  if (!isLoading && session) {
    return <Redirect href="/(app)/dashboard" />;
  }

  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: '#0f1210' },
        headerShown: false,
      }}
    />
  );
}
