import 'react-native-url-polyfill/auto';

import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import { env, requireEnv } from './env';

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    if (Platform.OS === 'web') {
      return Promise.resolve(globalThis.localStorage?.getItem(key) ?? null);
    }

    return SecureStore.getItemAsync(key);
  },
  removeItem: (key: string) => {
    if (Platform.OS === 'web') {
      globalThis.localStorage?.removeItem(key);
      return Promise.resolve();
    }

    return SecureStore.deleteItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    if (Platform.OS === 'web') {
      globalThis.localStorage?.setItem(key, value);
      return Promise.resolve();
    }

    return SecureStore.setItemAsync(key, value);
  },
};

export const supabase = createClient(
  requireEnv(env.supabaseUrl, 'EXPO_PUBLIC_SUPABASE_URL'),
  requireEnv(env.supabaseAnonKey, 'EXPO_PUBLIC_SUPABASE_ANON_KEY'),
  {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: Platform.OS === 'web',
      persistSession: true,
      storage: Platform.OS === 'web' ? ExpoSecureStoreAdapter : ExpoSecureStoreAdapter,
    },
  },
);
