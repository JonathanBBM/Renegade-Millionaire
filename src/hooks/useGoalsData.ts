import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/src/providers/AuthProvider';
import { fetchGoals, fetchWarriorCategories } from '@/src/services/goals';

export function useGoalsData() {
  const { user } = useAuth();

  const categoriesQuery = useQuery({
    queryFn: fetchWarriorCategories,
    queryKey: ['warrior-categories'],
  });

  const goalsQuery = useQuery({
    enabled: Boolean(user?.id),
    queryFn: () => fetchGoals(user!.id),
    queryKey: ['goals', user?.id],
  });

  return {
    categories: categoriesQuery.data ?? [],
    categoriesError: categoriesQuery.error,
    goals: goalsQuery.data ?? [],
    goalsError: goalsQuery.error,
    isLoading: categoriesQuery.isLoading || goalsQuery.isLoading,
  };
}
