import { View, Text } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Goal, GoalCategory } from '@/lib/types';
import { getCategoryLabel } from '@/lib/constants';

type GoalCardProps = {
  goal: Goal;
  onPress?: () => void;
};

const categoryColors: Record<GoalCategory, { bg: string; text: string; progress: string }> = {
  career: {
    bg: 'bg-career-50 dark:bg-career-500/10',
    text: 'text-career-600 dark:text-career-500',
    progress: 'bg-career-500',
  },
  fitness: {
    bg: 'bg-fitness-50 dark:bg-fitness-500/10',
    text: 'text-fitness-600 dark:text-fitness-500',
    progress: 'bg-fitness-500',
  },
  finance: {
    bg: 'bg-finance-50 dark:bg-finance-500/10',
    text: 'text-finance-600 dark:text-finance-500',
    progress: 'bg-finance-500',
  },
  personal_dev: {
    bg: 'bg-personal-50 dark:bg-personal-500/10',
    text: 'text-personal-600 dark:text-personal-500',
    progress: 'bg-personal-500',
  },
};

const statusBadge: Record<string, string> = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  paused: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  abandoned: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400',
};

export function GoalCard({ goal, onPress }: GoalCardProps) {
  const colors = categoryColors[goal.category];
  const categoryLabel = getCategoryLabel(goal.category);

  return (
    <Card onPress={onPress} className="mb-3">
      <View className="flex-row items-start justify-between mb-2">
        <View className={`px-2 py-1 rounded-md ${colors.bg}`}>
          <Text className={`text-xs font-medium ${colors.text}`}>
            {categoryLabel}
          </Text>
        </View>
        <View className={`px-2 py-1 rounded-md ${statusBadge[goal.status]}`}>
          <Text className="text-xs font-medium capitalize">{goal.status}</Text>
        </View>
      </View>

      <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
        {goal.title}
      </Text>

      {goal.success_criteria && (
        <Text className="text-sm text-gray-600 dark:text-gray-400 mb-3" numberOfLines={2}>
          {goal.success_criteria}
        </Text>
      )}

      <View className="mt-2">
        <View className="flex-row justify-between mb-1">
          <Text className="text-xs text-gray-500 dark:text-gray-400 capitalize">
            {goal.timeframe}
          </Text>
          <Text className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {goal.progress_pct}%
          </Text>
        </View>
        <View className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <View
            className={`h-full ${colors.progress} rounded-full`}
            style={{ width: `${goal.progress_pct}%` }}
          />
        </View>
      </View>

      {goal.target_date && (
        <Text className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Target: {new Date(goal.target_date).toLocaleDateString()}
        </Text>
      )}
    </Card>
  );
}
