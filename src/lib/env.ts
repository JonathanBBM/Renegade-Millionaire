import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra ?? {};

export const env = {
  appScheme: process.env.EXPO_PUBLIC_APP_SCHEME ?? 'renegademillionaireapp',
  siteUrl: process.env.EXPO_PUBLIC_SITE_URL ?? 'https://renegade-millionaire-app.vercel.app',
  supabaseAnonKey:
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
    (extra.EXPO_PUBLIC_SUPABASE_ANON_KEY as string | undefined) ??
    'sb_publishable_n5nLsudueMIp3f03xaDlqA_huK6rCZk',
  supabaseUrl:
    process.env.EXPO_PUBLIC_SUPABASE_URL ??
    (extra.EXPO_PUBLIC_SUPABASE_URL as string | undefined) ??
    'https://qrazptjoyoaibxdhofuz.supabase.co',
};

export function requireEnv(value: string | undefined, name: string) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}
