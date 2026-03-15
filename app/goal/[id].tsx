import { useEffect } from 'react';
import { View, Text, ScrollView, Alert, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { useGoalStore } from '@/stores/goalStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { GOAL_CATEGORIES, GOAL_TIMEFRAMES, GOAL_STATUSES } from '@/lib/constants';
import { GoalCategory, GoalTimeframe, GoalStatus, GoalInsert } from '@/lib/types';

type FormData = {
  title: string;
  category: GoalCategory;
  timeframe: GoalTimeframe;
  target_date: string;
  success_criteria: string;
  status: GoalStatus;
  progress_pct: number;
};

export default function GoalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const isNew = id === 'new';

  const { goals, createGoal, updateGoal, deleteGoal, loading } = useGoalStore();
  const goal = !isNew ? goals.find((g) => g.id === id) : null;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      title: '',
      category: 'career',
      timeframe: 'monthly',
      target_date: '',
      success_criteria: '',
      status: 'active',
      progress_pct: 0,
    },
  });

  useEffect(() => {
    if (goal) {
      reset({
        title: goal.title,
        category: goal.category,
        timeframe: goal.timeframe,
        target_date: goal.target_date ?? '',
        success_criteria: goal.success_criteria ?? '',
        status: goal.status,
        progress_pct: goal.progress_pct,
      });
    }
  }, [goal, reset]);

  const onSubmit = async (data: FormData) => {
    const goalData: GoalInsert = {
      title: data.title,
      category: data.category,
      timeframe: data.timeframe,
      target_date: data.target_date || null,
      success_criteria: data.success_criteria || null,
      parent_goal_id: null,
      status: data.status,
      progress_pct: data.progress_pct,
    };

    if (isNew) {
      const result = await createGoal(goalData);
      if (result) {
        router.back();
      }
    } else if (id) {
      const result = await updateGoal(id, goalData);
      if (result) {
        router.back();
      }
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Goal',
      'Are you sure you want to delete this goal? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (id) {
              const success = await deleteGoal(id);
              if (success) {
                router.back();
              }
            }
          },
        },
      ]
    );
  };

  const selectedCategory = watch('category');
  const selectedTimeframe = watch('timeframe');
  const selectedStatus = watch('status');

  return (
    <>
      <Stack.Screen
        options={{
          title: isNew ? 'New Goal' : 'Edit Goal',
          headerBackTitle: 'Back',
        }}
      />
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['bottom']}>
        <ScrollView className="flex-1 px-4 py-4">
          <Controller
            control={control}
            name="title"
            rules={{ required: 'Title is required' }}
            render={({ field: { onChange, value } }) => (
              <Input
                label="Goal Title"
                placeholder="What do you want to achieve?"
                value={value}
                onChangeText={onChange}
                error={errors.title?.message}
              />
            )}
          />

          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </Text>
          <Controller
            control={control}
            name="category"
            render={({ field: { onChange } }) => (
              <View className="flex-row flex-wrap mb-4">
                {GOAL_CATEGORIES.map((cat) => (
                  <Pressable
                    key={cat.id}
                    onPress={() => onChange(cat.id)}
                    className={`px-3 py-2 rounded-lg mr-2 mb-2 ${
                      selectedCategory === cat.id
                        ? 'bg-blue-600'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        selectedCategory === cat.id
                          ? 'text-white'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {cat.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          />

          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Timeframe
          </Text>
          <Controller
            control={control}
            name="timeframe"
            render={({ field: { onChange } }) => (
              <View className="flex-row flex-wrap mb-4">
                {GOAL_TIMEFRAMES.map((tf) => (
                  <Pressable
                    key={tf.id}
                    onPress={() => onChange(tf.id)}
                    className={`px-3 py-2 rounded-lg mr-2 mb-2 ${
                      selectedTimeframe === tf.id
                        ? 'bg-blue-600'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        selectedTimeframe === tf.id
                          ? 'text-white'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {tf.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          />

          <Controller
            control={control}
            name="target_date"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Target Date (optional)"
                placeholder="YYYY-MM-DD"
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="success_criteria"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Success Criteria (optional)"
                placeholder="How will you know you've achieved this goal?"
                value={value}
                onChangeText={onChange}
                multiline
                numberOfLines={3}
              />
            )}
          />

          {!isNew && (
            <>
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </Text>
              <Controller
                control={control}
                name="status"
                render={({ field: { onChange } }) => (
                  <View className="flex-row flex-wrap mb-4">
                    {GOAL_STATUSES.map((s) => (
                      <Pressable
                        key={s.id}
                        onPress={() => onChange(s.id)}
                        className={`px-3 py-2 rounded-lg mr-2 mb-2 ${
                          selectedStatus === s.id
                            ? 'bg-blue-600'
                            : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        <Text
                          className={`text-sm font-medium ${
                            selectedStatus === s.id
                              ? 'text-white'
                              : 'text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {s.label}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              />

              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Progress: {watch('progress_pct')}%
              </Text>
              <Controller
                control={control}
                name="progress_pct"
                render={({ field: { onChange, value } }) => (
                  <View className="flex-row items-center mb-4">
                    <View className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mr-3">
                      <View
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${value}%` }}
                      />
                    </View>
                    <View className="flex-row">
                      {[0, 25, 50, 75, 100].map((pct) => (
                        <Pressable
                          key={pct}
                          onPress={() => onChange(pct)}
                          className={`w-8 h-8 rounded-full items-center justify-center mr-1 ${
                            value === pct
                              ? 'bg-blue-600'
                              : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                        >
                          <Text
                            className={`text-xs font-medium ${
                              value === pct
                                ? 'text-white'
                                : 'text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {pct}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                )}
              />
            </>
          )}

          <View className="mt-6">
            <Button
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              fullWidth
            >
              {isNew ? 'Create Goal' : 'Save Changes'}
            </Button>

            {!isNew && (
              <View className="mt-3">
                <Button
                  onPress={handleDelete}
                  variant="danger"
                  fullWidth
                >
                  Delete Goal
                </Button>
              </View>
            )}
          </View>

          <View className="h-10" />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
