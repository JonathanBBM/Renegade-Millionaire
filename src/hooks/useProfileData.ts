import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/src/providers/AuthProvider';
import { fetchAffirmations, fetchRoutines } from '@/src/services/profile';

export function useProfileData() {
  const { user } = useAuth();

  const affirmationsQuery = useQuery({
    enabled: Boolean(user?.id),
    queryFn: () => fetchAffirmations(user!.id),
    queryKey: ['affirmations', user?.id],
  });

  const routinesQuery = useQuery({
    enabled: Boolean(user?.id),
    queryFn: () => fetchRoutines(user!.id),
    queryKey: ['routines', user?.id],
  });

  return {
    affirmations: affirmationsQuery.data ?? [],
    affirmationsError: affirmationsQuery.error,
    isLoading: affirmationsQuery.isLoading || routinesQuery.isLoading,
    routines: routinesQuery.data ?? [],
    routinesError: routinesQuery.error,
  };
}
