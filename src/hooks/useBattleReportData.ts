import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/src/providers/AuthProvider';
import { fetchDailyBattleReport, fetchWeeklyBattleReport } from '@/src/services/battleReport';

export function useBattleReportData(reportDate: string, weekStartDate: string) {
  const { user } = useAuth();

  const dailyQuery = useQuery({
    enabled: Boolean(user?.id),
    queryFn: () => fetchDailyBattleReport(user!.id, reportDate),
    queryKey: ['battle-report-daily', user?.id, reportDate],
  });

  const weeklyQuery = useQuery({
    enabled: Boolean(user?.id),
    queryFn: () => fetchWeeklyBattleReport(user!.id, weekStartDate),
    queryKey: ['battle-report-weekly', user?.id, weekStartDate],
  });

  return {
    daily: dailyQuery.data ?? null,
    dailyError: dailyQuery.error,
    isLoading: dailyQuery.isLoading || weeklyQuery.isLoading,
    weekly: weeklyQuery.data ?? null,
    weeklyError: weeklyQuery.error,
  };
}
