import { supabase } from '@/src/lib/supabase';
import { Quote } from '@/src/types/dashboard';

export async function fetchQuotes() {
  const { data, error } = await supabase.from('quotes').select('id,text,author,source').order('created_at', { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as Quote[];
}

export function pickDailyQuote(quotes: Quote[], dateText: string) {
  if (quotes.length === 0) return null;

  const dayNumber = Math.floor(new Date(`${dateText}T00:00:00`).getTime() / 86400000);
  return quotes[Math.abs(dayNumber) % quotes.length];
}
