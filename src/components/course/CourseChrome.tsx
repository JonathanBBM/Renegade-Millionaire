import { PropsWithChildren } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export function CourseScreenShell({ children }: PropsWithChildren) {
  return <View style={styles.screen}>{children}</View>;
}

export function CourseLoading() {
  return (
    <CourseScreenShell>
      <View style={styles.centered}>
        <ActivityIndicator />
        <Text style={styles.muted}>Loading course...</Text>
      </View>
    </CourseScreenShell>
  );
}

export function CourseError({ message }: { message: string }) {
  return (
    <CourseScreenShell>
      <Text style={styles.title}>Course unavailable</Text>
      <Text style={styles.copy}>{message}</Text>
    </CourseScreenShell>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderColor: '#3a4037',
    borderRadius: 999,
    borderWidth: 1,
    color: '#c7cdbf',
    fontSize: 12,
    fontWeight: '800',
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 5,
    textTransform: 'uppercase',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#d5a84c',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  buttonSecondary: {
    alignItems: 'center',
    borderColor: '#3a4037',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  buttonSecondaryText: { color: '#f5f1e8', fontSize: 15, fontWeight: '800' },
  buttonText: { color: '#14170f', fontSize: 15, fontWeight: '900' },
  card: {
    backgroundColor: '#171c17',
    borderColor: '#2d342b',
    borderRadius: 8,
    borderWidth: 1,
    gap: 10,
    padding: 16,
  },
  centered: { alignItems: 'center', flex: 1, gap: 12, justifyContent: 'center' },
  copy: { color: '#c7cdbf', fontSize: 16, lineHeight: 24 },
  divider: { backgroundColor: '#2d342b', height: 1, marginVertical: 16 },
  label: { color: '#8d9488', fontSize: 12, fontWeight: '800', textTransform: 'uppercase' },
  muted: { color: '#8d9488', fontSize: 14, lineHeight: 20 },
  screen: { backgroundColor: '#0f1210', flex: 1, padding: 20 },
  sectionTitle: { color: '#f5f1e8', fontSize: 20, fontWeight: '900', lineHeight: 25 },
  title: { color: '#f5f1e8', fontSize: 32, fontWeight: '900', lineHeight: 38 },
});

export const courseStyles = styles;
