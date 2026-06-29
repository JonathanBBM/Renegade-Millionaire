import { StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/src/providers/AuthProvider';

export default function DashboardScreen() {
  const { profile, user } = useAuth();

  return (
    <View style={styles.screen}>
      <Text style={styles.kicker}>Phase 1</Text>
      <Text style={styles.title}>Command Center</Text>
      <Text style={styles.copy}>
        Auth is wired, sessions persist, and this protected route is only visible after sign in.
      </Text>
      <View style={styles.panel}>
        <Text style={styles.label}>Signed in as</Text>
        <Text style={styles.value}>{profile?.full_name || user?.email}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  copy: { color: '#c7cdbf', fontSize: 16, lineHeight: 23, marginTop: 8, maxWidth: 620 },
  kicker: { color: '#d5a84c', fontSize: 13, fontWeight: '800', letterSpacing: 0, textTransform: 'uppercase' },
  label: { color: '#8d9488', fontSize: 13, fontWeight: '700', textTransform: 'uppercase' },
  panel: {
    backgroundColor: '#171c17',
    borderColor: '#30372e',
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 28,
    maxWidth: 620,
    padding: 18,
  },
  screen: { backgroundColor: '#0f1210', flex: 1, padding: 24 },
  title: { color: '#f5f1e8', fontSize: 34, fontWeight: '900', marginTop: 6 },
  value: { color: '#f5f1e8', fontSize: 18, fontWeight: '700', marginTop: 6 },
});
