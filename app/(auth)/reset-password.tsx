import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { supabase } from '@/src/lib/supabase';

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    setIsSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setIsSubmitting(false);

    if (error) {
      Alert.alert('Reset failed', error.message);
      return;
    }

    Alert.alert('Password updated', 'You can continue using the app.');
  }

  return (
    <View style={styles.screen}>
      <View style={styles.panel}>
        <Text style={styles.brand}>Renegade Millionaire</Text>
        <Text style={styles.title}>New password</Text>
        <TextInput
          autoCapitalize="none"
          onChangeText={setPassword}
          placeholder="New password"
          placeholderTextColor="#848a80"
          secureTextEntry
          style={styles.input}
          value={password}
        />
        <Pressable disabled={isSubmitting} onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>{isSubmitting ? 'Saving...' : 'Update password'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  brand: { color: '#d5a84c', fontSize: 15, fontWeight: '700', letterSpacing: 0 },
  button: {
    alignItems: 'center',
    backgroundColor: '#d5a84c',
    borderRadius: 8,
    marginTop: 6,
    paddingVertical: 14,
  },
  buttonText: { color: '#17140d', fontSize: 16, fontWeight: '800' },
  input: {
    backgroundColor: '#181d19',
    borderColor: '#343a32',
    borderRadius: 8,
    borderWidth: 1,
    color: '#f5f1e8',
    fontSize: 16,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  panel: { maxWidth: 440, width: '100%' },
  screen: {
    alignItems: 'center',
    backgroundColor: '#0f1210',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: { color: '#f5f1e8', fontSize: 34, fontWeight: '900', marginBottom: 18, marginTop: 10 },
});
