import { Link } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAuth } from '@/src/providers/AuthProvider';

export default function ForgotPasswordScreen() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    setIsSubmitting(true);
    const { error } = await resetPassword(email.trim());
    setIsSubmitting(false);

    if (error) {
      Alert.alert('Reset failed', error.message);
      return;
    }

    Alert.alert('Email sent', 'Check your inbox for the password reset link.');
  }

  return (
    <View style={styles.screen}>
      <View style={styles.panel}>
        <Text style={styles.brand}>Renegade Millionaire</Text>
        <Text style={styles.title}>Reset password</Text>
        <Text style={styles.copy}>Enter your email and we will send a recovery link.</Text>

        <TextInput
          autoCapitalize="none"
          autoComplete="email"
          inputMode="email"
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor="#848a80"
          style={styles.input}
          value={email}
        />

        <Pressable disabled={isSubmitting} onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>{isSubmitting ? 'Sending...' : 'Send reset link'}</Text>
        </Pressable>

        <Link href="/(auth)/sign-in" style={styles.link}>
          Back to sign in
        </Link>
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
  copy: { color: '#b9c0b2', fontSize: 15, lineHeight: 22, marginBottom: 22 },
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
  link: { color: '#d5a84c', fontSize: 14, fontWeight: '700', marginTop: 18, textAlign: 'center' },
  panel: { maxWidth: 440, width: '100%' },
  screen: {
    alignItems: 'center',
    backgroundColor: '#0f1210',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: { color: '#f5f1e8', fontSize: 34, fontWeight: '900', marginBottom: 8, marginTop: 10 },
});
