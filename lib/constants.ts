import { GoalCategory, ReviewType } from './types';

export const GOAL_CATEGORIES: {
  id: GoalCategory;
  label: string;
  description: string;
  color: string;
}[] = [
  {
    id: 'career',
    label: 'Career/Skills',
    description: 'Certifications, interview prep, portfolio, technical learning',
    color: 'career',
  },
  {
    id: 'fitness',
    label: 'Fitness/Health',
    description: 'Workouts, nutrition, sleep, body composition',
    color: 'fitness',
  },
  {
    id: 'finance',
    label: 'Finance/Trading',
    description: 'Trading discipline, account growth, saving targets',
    color: 'finance',
  },
  {
    id: 'personal_dev',
    label: 'Personal Development',
    description: 'Reading, meditation, journaling, relationships',
    color: 'personal',
  },
];

export const GOAL_TIMEFRAMES = [
  { id: 'yearly', label: 'Yearly' },
  { id: 'quarterly', label: 'Quarterly' },
  { id: 'monthly', label: 'Monthly' },
  { id: 'weekly', label: 'Weekly' },
] as const;

export const GOAL_STATUSES = [
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
  { id: 'paused', label: 'Paused' },
  { id: 'abandoned', label: 'Abandoned' },
] as const;

export type ReviewPrompt = {
  id: string;
  question: string;
  type: 'text' | 'rating' | 'checklist';
  required: boolean;
};

export const REVIEW_PROMPTS: Record<ReviewType, ReviewPrompt[]> = {
  nightly: [
    {
      id: 'wins',
      question: 'What were your wins today?',
      type: 'text',
      required: true,
    },
    {
      id: 'challenges',
      question: 'What challenges did you face?',
      type: 'text',
      required: false,
    },
    {
      id: 'energy_level',
      question: 'How was your energy level today?',
      type: 'rating',
      required: true,
    },
    {
      id: 'tomorrow_focus',
      question: 'What is your top priority for tomorrow?',
      type: 'text',
      required: true,
    },
  ],
  weekly: [
    {
      id: 'week_summary',
      question: 'Summarize your week in a few sentences',
      type: 'text',
      required: true,
    },
    {
      id: 'goal_progress',
      question: 'Rate your progress toward your goals this week',
      type: 'rating',
      required: true,
    },
    {
      id: 'biggest_lesson',
      question: 'What was your biggest lesson this week?',
      type: 'text',
      required: true,
    },
    {
      id: 'next_week_goals',
      question: 'What are your top 3 goals for next week?',
      type: 'text',
      required: true,
    },
  ],
  monthly: [
    {
      id: 'month_highlights',
      question: 'What were the highlights of this month?',
      type: 'text',
      required: true,
    },
    {
      id: 'goal_completion',
      question: 'Which goals did you complete this month?',
      type: 'checklist',
      required: false,
    },
    {
      id: 'areas_improvement',
      question: 'What areas need improvement?',
      type: 'text',
      required: true,
    },
    {
      id: 'next_month_focus',
      question: 'What will you focus on next month?',
      type: 'text',
      required: true,
    },
  ],
  quarterly: [
    {
      id: 'quarter_reflection',
      question: 'Reflect on your quarter. What stands out?',
      type: 'text',
      required: true,
    },
    {
      id: 'major_achievements',
      question: 'List your major achievements this quarter',
      type: 'text',
      required: true,
    },
    {
      id: 'goal_alignment',
      question: 'Are your goals still aligned with your values?',
      type: 'text',
      required: true,
    },
    {
      id: 'next_quarter_priorities',
      question: 'What are your priorities for next quarter?',
      type: 'text',
      required: true,
    },
  ],
  yearly: [
    {
      id: 'year_story',
      question: 'If this year were a story, what would the title be?',
      type: 'text',
      required: true,
    },
    {
      id: 'proudest_moments',
      question: 'What are you most proud of this year?',
      type: 'text',
      required: true,
    },
    {
      id: 'biggest_growth',
      question: 'Where did you experience the most growth?',
      type: 'text',
      required: true,
    },
    {
      id: 'next_year_vision',
      question: 'What is your vision for next year?',
      type: 'text',
      required: true,
    },
  ],
};

export const getCategoryColor = (category: GoalCategory): string => {
  const categoryInfo = GOAL_CATEGORIES.find((c) => c.id === category);
  return categoryInfo?.color ?? 'gray';
};

export const getCategoryLabel = (category: GoalCategory): string => {
  const categoryInfo = GOAL_CATEGORIES.find((c) => c.id === category);
  return categoryInfo?.label ?? category;
};
