export type GoalCategory = 'career' | 'fitness' | 'finance' | 'personal_dev';
export type GoalTimeframe = 'yearly' | 'quarterly' | 'monthly' | 'weekly';
export type GoalStatus = 'active' | 'completed' | 'paused' | 'abandoned';

export type Goal = {
  id: string;
  title: string;
  category: GoalCategory;
  timeframe: GoalTimeframe;
  target_date: string | null;
  success_criteria: string | null;
  parent_goal_id: string | null;
  status: GoalStatus;
  progress_pct: number;
  created_at: string;
  user_id: string;
};

export type GoalInsert = Omit<Goal, 'id' | 'created_at' | 'user_id'>;
export type GoalUpdate = Partial<GoalInsert>;

export type ActionStatus = 'pending' | 'completed' | 'skipped' | 'partial';
export type RecurrenceRule = 'daily' | 'weekdays' | 'MWF' | 'TTh' | 'weekends';

export type DailyAction = {
  id: string;
  goal_id: string;
  title: string;
  scheduled_date: string;
  scheduled_time: string | null;
  is_recurring: boolean;
  recurrence_rule: RecurrenceRule | null;
  status: ActionStatus;
  notes: string | null;
  completed_at: string | null;
  user_id: string;
  created_at: string;
};

export type ReviewType = 'nightly' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export type Review = {
  id: string;
  review_type: ReviewType;
  review_date: string;
  overall_score: number | null;
  responses: Record<string, unknown>;
  ai_analysis: string | null;
  created_at: string;
  user_id: string;
};

export type InsightType = 'pattern' | 'warning' | 'suggestion' | 'trend';

export type AIInsight = {
  id: string;
  insight_type: InsightType;
  category: GoalCategory | null;
  content: string;
  data_range: string | null;
  acknowledged: boolean;
  created_at: string;
  user_id: string;
};

export type NotificationPrefs = {
  morning_reminder: boolean;
  evening_reminder: boolean;
  weekly_reminder: boolean;
};

export type UserSettings = {
  id: string;
  notification_prefs: NotificationPrefs;
  review_time: string;
  morning_plan_time: string;
  active_categories: GoalCategory[];
  user_id: string;
};
