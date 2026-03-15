# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal coaching app: goal tracking → daily scheduling → structured reviews → AI pattern analysis. Single user, mobile-first.

## Tech Stack

- **Frontend:** React Native (Expo managed workflow)
- **Backend:** Supabase (Auth, PostgreSQL, Edge Functions, Push Notifications)
- **AI:** Claude API (claude-sonnet-4-20250514) via Supabase Edge Functions
- **Navigation:** React Navigation (stack + bottom tabs)
- **State:** Zustand
- **Styling:** NativeWind (Tailwind for RN)
- **Forms:** React Hook Form

## Commands

- `npx expo start`: Start dev server
- `npx expo start --clear`: Start with cache cleared
- `npx expo run:ios`: Run on iOS simulator
- `npx expo run:android`: Run on Android emulator
- `npx expo lint`: Lint check
- `supabase start`: Start local Supabase
- `supabase db reset`: Reset local DB and re-run migrations
- `supabase functions serve`: Run Edge Functions locally
- `supabase db diff -f <name>`: Generate migration from schema changes
- `supabase migration up`: Apply pending migrations

## Architecture

```
cadence/
├── app/                    # Expo Router screens
│   ├── (tabs)/             # Bottom tab screens
│   │   ├── index.tsx       # Dashboard (home)
│   │   ├── goals.tsx       # Goals browser
│   │   ├── plan.tsx        # Daily plan
│   │   ├── review.tsx      # Review entry point
│   │   └── insights.tsx    # AI insights feed
│   ├── goal/[id].tsx       # Goal detail
│   ├── review/[type].tsx   # Review flow (nightly/weekly/monthly/quarterly/yearly)
│   └── _layout.tsx         # Root layout
├── components/             # Reusable UI components
│   ├── ui/                 # Generic (buttons, cards, inputs)
│   └── domain/             # Domain-specific (GoalCard, ActionItem, ReviewPrompt)
├── lib/
│   ├── supabase.ts         # Supabase client init
│   ├── types.ts            # TypeScript types matching DB schema
│   └── constants.ts        # Goal categories, review prompts, config
├── stores/                 # Zustand stores
│   ├── goalStore.ts
│   ├── actionStore.ts
│   └── reviewStore.ts
├── hooks/                  # Custom React hooks
├── utils/                  # Pure helper functions
└── supabase/
    ├── migrations/         # SQL migrations
    ├── functions/          # Edge Functions
    │   ├── analyze-review/ # Claude API integration
    │   ├── generate-daily-plan/
    │   └── send-review-reminder/
    └── seed.sql            # Dev seed data
```

## Database Schema

Five core tables — all have RLS enabled scoped to `auth.uid()`:

- **goals**: id, title, category (career|fitness|finance|personal_dev), timeframe (yearly|quarterly|monthly|weekly), target_date, success_criteria, parent_goal_id, status (active|completed|paused|abandoned), progress_pct, created_at
- **daily_actions**: id, goal_id (FK→goals), title, scheduled_date, scheduled_time, is_recurring, recurrence_rule, status (pending|completed|skipped|partial), notes, completed_at
- **reviews**: id, review_type (nightly|weekly|monthly|quarterly|yearly), review_date, overall_score, responses (JSONB), ai_analysis, created_at
- **ai_insights**: id, insight_type (pattern|warning|suggestion|trend), category, content, data_range, acknowledged, created_at
- **user_settings**: id, notification_prefs (JSONB), review_time, morning_plan_time, active_categories

## Goal Categories

Four fixed categories — every goal must belong to exactly one:

1. **Career/Skills** — certs, interview prep, portfolio, technical learning
2. **Fitness/Health** — workouts, nutrition, sleep, body composition
3. **Finance/Trading** — trading discipline, account growth, saving targets
4. **Personal Development** — reading, meditation, journaling, relationships

## Core App Loop

1. **Morning (7 AM push):** Dashboard shows today's actions pulled from recurring rules + manually scheduled items, grouped by category
2. **During day:** Check off actions, add quick notes. Swipe-right = complete, swipe-left = skip (reason required)
3. **Night (9:30 PM push):** Nightly review flow — day summary → guided prompts → optional journal → submit → AI analysis appears
4. **Weekly (Sunday evening):** Weekly review aggregating daily data
5. **Monthly/Quarterly/Yearly:** Progressively higher-level reviews at appropriate intervals

## Coding Standards

- TypeScript strict mode, no `any` types
- Functional components with hooks only, no class components
- Use NativeWind utility classes, no StyleSheet.create unless absolutely necessary
- Named exports, not default exports (except for Expo Router screens which require default)
- Zustand stores: one store per domain entity, keep stores flat
- Supabase queries: always handle errors explicitly, never swallow them
- Edge Functions: TypeScript, Deno runtime, always validate input

## AI Integration Rules

- Claude API calls ONLY happen invm use 20.0.0nside Supabase Edge Functions — never from the client
- API key stored in Supabase secrets, never in client code or .env files committed to git
- One API call per review submission, not per action
- System prompt defines role as "personal performance coach analyzing structured self-review data"
- Always request JSON output format: `{ insights: [], category_scores: {}, suggested_focus: "" }`
- Send minimal context: last 7 nightly reviews for nightly analysis, last 4 weeklies for weekly, etc.
- Store raw AI response in ai_insights table, parse and display on client

## Review Prompt Config

Review prompts are defined in `lib/constants.ts`, NOT in the database. This lets you iterate on prompts without migrations. Structure:

```typescript
type ReviewPrompt = {
  id: string;
  question: string;
  type: "text" | "rating" | "checklist";
  required: boolean;
};
```

## Important Notes

- This is a personal-use app. Single user only. No multi-tenancy.
- NEVER commit .env, .env.local, or any file containing API keys
- Supabase URL and anon key are fine in client code (they're public). Service role key is NOT.
- When creating migrations, always include `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` and create policies
- The JSONB `responses` column on reviews stores prompt answers keyed by prompt ID — schema-flexible by design
- Goal cascading: yearly goals have quarterly children, quarterly have monthly, monthly have weekly. Use parent_goal_id.
- Recurring actions use a simple rule string ("daily", "weekdays", "MWF", "TTh", "weekends") — no cron complexity
- Push notifications via Expo Notifications, configured in user_settings
