import { StyleSheet, Text, View } from 'react-native';

export default function GoalsScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Goals</Text>
      <Text style={styles.copy}>The long-range WARRIOR goal system starts in Phase 4.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  copy: { color: '#c7cdbf', fontSize: 16, marginTop: 8 },
  screen: { backgroundColor: '#0f1210', flex: 1, padding: 24 },
  title: { color: '#f5f1e8', fontSize: 30, fontWeight: '900' },
});
