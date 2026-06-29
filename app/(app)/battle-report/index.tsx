import { StyleSheet, Text, View } from 'react-native';

export default function BattleReportScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Battle Report</Text>
      <Text style={styles.copy}>Daily and weekly logging is schema-ready and scheduled for Phase 5.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  copy: { color: '#c7cdbf', fontSize: 16, marginTop: 8 },
  screen: { backgroundColor: '#0f1210', flex: 1, padding: 24 },
  title: { color: '#f5f1e8', fontSize: 30, fontWeight: '900' },
});
