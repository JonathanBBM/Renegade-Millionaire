import { useQuery } from '@tanstack/react-query';

import { fetchCourseModules, fetchProgress } from '@/src/services/course';
import { useAuth } from '@/src/providers/AuthProvider';

export function useCourseData() {
  const { user } = useAuth();

  const modulesQuery = useQuery({
    queryFn: fetchCourseModules,
    queryKey: ['course-modules'],
  });

  const progressQuery = useQuery({
    enabled: Boolean(user?.id),
    queryFn: () => fetchProgress(user!.id),
    queryKey: ['course-progress', user?.id],
  });

  return {
    isLoading: modulesQuery.isLoading || progressQuery.isLoading,
    modules: modulesQuery.data ?? [],
    modulesError: modulesQuery.error,
    progress: progressQuery.data ?? [],
    progressError: progressQuery.error,
    refetchProgress: progressQuery.refetch,
  };
}
