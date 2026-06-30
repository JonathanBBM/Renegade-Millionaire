import { PropsWithChildren } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

export const colors = {
  background: '#0f1210',
  border: '#2d342b',
  card: '#171c17',
  copy: '#c7cdbf',
  danger: '#ffb0a7',
  dangerBorder: '#70413c',
  gold: '#d5a84c',
  muted: '#8d9488',
  text: '#f5f1e8',
};

export function AppScreen({ children, centered = false }: PropsWithChildren<{ centered?: boolean }>) {
  const { width } = useWindowDimensions();
  const horizontalPadding = width >= 1024 ? 32 : 20;

  return (
    <View style={[styles.screen, { paddingHorizontal: horizontalPadding }, centered ? styles.centered : null]}>
      <View style={[styles.inner, centered ? styles.centeredInner : null]}>{children}</View>
    </View>
  );
}

export function AppLoading({ label }: { label: string }) {
  return (
    <AppScreen centered>
      <ActivityIndicator accessibilityLabel={label} />
      <Text style={styles.muted}>{label}</Text>
    </AppScreen>
  );
}

export function EmptyState({ copy, title }: { copy: string; title: string }) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.copy}>{copy}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: { alignItems: 'center', justifyContent: 'center' },
  centeredInner: { alignItems: 'center' },
  copy: { color: colors.copy, fontSize: 16, lineHeight: 23 },
  emptyState: {
    borderRadius: 8,
    gap: 8,
    padding: 16,
  },
  emptyTitle: { color: colors.text, fontSize: 20, fontWeight: '900', lineHeight: 25 },
  inner: { flex: 1, maxWidth: 1180, width: '100%' },
  muted: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  screen: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
    paddingVertical: 20,
  },
});
