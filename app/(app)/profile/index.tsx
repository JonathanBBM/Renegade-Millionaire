import { StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/src/providers/AuthProvider';

export default function ProfileScreen() {
  const { profile, user } = useAuth();

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.copy}>{profile?.full_name || user?.email || 'Signed in user'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  copy: { color: '#c7cdbf', fontSize: 16, marginTop: 8 },
  screen: { backgroundColor: '#0f1210', flex: 1, padding: 24 },
  title: { color: '#f5f1e8', fontSize: 30, fontWeight: '900' },
});
