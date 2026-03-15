import { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useGoalStore } from '@/stores/goalStore';
import { GoalCard } from '@/components/domain/GoalCard';
import { Button } from '@/components/ui/Button';
import { GOAL_CATEGORIES } from '@/lib/constants';
import { GoalCategory } from '@/lib/types';

export default function GoalsScreen() {
  const router = useRouter();
  const { goals, loading, error, fetchGoals } = useGoalStore();
  const [selectedCategory, setSelectedCategory] = useState<GoalCategory | 'all'>('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchGoals();
    setRefreshing(false);
  };

  const filteredGoals =
    selectedCategory === 'all'
      ? goals
      : goals.filter((g) => g.category === selectedCategory);

  const activeGoals = filteredGoals.filter((g) => g.status === 'active');
  const otherGoals = filteredGoals.filter((g) => g.status !== 'active');

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
      <View className="px-4 pt-4 pb-2">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Goals
          </Text>
          <Button
            onPress={() => router.push('/goal/new')}
            size="sm"
          >
            Add Goal
          </Button>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-2"
        >
          <Pressable
            onPress={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full mr-2 ${
              selectedCategory === 'all'
                ? 'bg-blue-600'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                selectedCategory === 'all'
                  ? 'text-white'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              All
            </Text>
          </Pressable>
          {GOAL_CATEGORIES.map((category) => (
            <Pressable
              key={category.id}
              onPress={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full mr-2 ${
                selectedCategory === category.id
                  ? 'bg-blue-600'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  selectedCategory === category.id
                    ? 'text-white'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {category.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        className="flex-1 px-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {error && (
          <View className="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg mb-4">
            <Text className="text-red-800 dark:text-red-400">{error}</Text>
          </View>
        )}

        {loading && goals.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-gray-500 dark:text-gray-400">Loading goals...</Text>
          </View>
        ) : filteredGoals.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-gray-500 dark:text-gray-400 text-center">
              No goals yet.{'\n'}Tap &quot;Add Goal&quot; to create your first goal!
            </Text>
          </View>
        ) : (
          <>
            {activeGoals.length > 0 && (
              <View className="mb-6">
                <Text className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                  Active ({activeGoals.length})
                </Text>
                {activeGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onPress={() => router.push(`/goal/${goal.id}`)}
                  />
                ))}
              </View>
            )}

            {otherGoals.length > 0 && (
              <View className="mb-6">
                <Text className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                  Other ({otherGoals.length})
                </Text>
                {otherGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onPress={() => router.push(`/goal/${goal.id}`)}
                  />
                ))}
              </View>
            )}
          </>
        )}

        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}
