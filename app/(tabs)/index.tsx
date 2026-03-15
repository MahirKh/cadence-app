import { useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useGoalStore } from '@/stores/goalStore';
import { GoalCard } from '@/components/domain/GoalCard';
import { Card } from '@/components/ui/Card';
import { GOAL_CATEGORIES } from '@/lib/constants';

export default function HomeScreen() {
  const router = useRouter();
  const { goals, fetchGoals, loading } = useGoalStore();

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const activeGoals = goals.filter((g) => g.status === 'active');
  const recentGoals = activeGoals.slice(0, 3);

  const goalsByCategory = GOAL_CATEGORIES.map((cat) => ({
    ...cat,
    count: goals.filter((g) => g.category === cat.id && g.status === 'active').length,
  }));

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
      <ScrollView className="flex-1 px-4 py-4">
        <Text className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Cadence
        </Text>
        <Text className="text-gray-600 dark:text-gray-400 mb-6">
          Your personal coaching companion
        </Text>

        <Card className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Overview
          </Text>
          <View className="flex-row flex-wrap">
            {goalsByCategory.map((cat) => (
              <View key={cat.id} className="w-1/2 mb-3">
                <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {cat.count}
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  {cat.label}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        {loading && goals.length === 0 ? (
          <View className="py-10 items-center">
            <Text className="text-gray-500 dark:text-gray-400">Loading...</Text>
          </View>
        ) : recentGoals.length > 0 ? (
          <>
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Active Goals
              </Text>
              <Text
                className="text-blue-600 dark:text-blue-400"
                onPress={() => router.push('/(tabs)/goals')}
              >
                See all
              </Text>
            </View>
            {recentGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onPress={() => router.push(`/goal/${goal.id}`)}
              />
            ))}
          </>
        ) : (
          <Card>
            <Text className="text-center text-gray-600 dark:text-gray-400 py-4">
              No active goals yet.{'\n'}
              Head to the Goals tab to create your first goal!
            </Text>
          </Card>
        )}

        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}
