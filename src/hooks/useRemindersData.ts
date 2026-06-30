import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/src/providers/AuthProvider';
import { fetchReminders } from '@/src/services/reminders';

export function useRemindersData() {
  const { user } = useAuth();

  const remindersQuery = useQuery({
    enabled: Boolean(user?.id),
    queryFn: () => fetchReminders(user!.id),
    queryKey: ['reminders', user?.id],
  });

  return {
    isLoading: remindersQuery.isLoading,
    reminders: remindersQuery.data ?? [],
    remindersError: remindersQuery.error,
  };
}
