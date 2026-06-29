import { Link } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAuth } from '@/src/providers/AuthProvider';

export default function SignInScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    setIsSubmitting(true);
    const { error } = await signIn(email.trim(), password);
    setIsSubmitting(false);

    if (error) {
      Alert.alert('Sign in failed', error.message);
    }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.panel}>
        <Text style={styles.brand}>Renegade Millionaire</Text>
        <Text style={styles.title}>Sign in</Text>
        <Text style={styles.copy}>Continue your warrior path to power, profit, and freedom.</Text>

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
        <TextInput
          autoCapitalize="none"
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor="#848a80"
          secureTextEntry
          style={styles.input}
          value={password}
        />

        <Pressable disabled={isSubmitting} onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>{isSubmitting ? 'Signing in...' : 'Sign in'}</Text>
        </Pressable>

        <View style={styles.links}>
          <Link href="/(auth)/forgot-password" style={styles.link}>
            Forgot password?
          </Link>
          <Link href="/(auth)/sign-up" style={styles.link}>
            Create account
          </Link>
        </View>
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
  link: { color: '#d5a84c', fontSize: 14, fontWeight: '700' },
  links: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 18 },
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
