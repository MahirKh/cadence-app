# Cadence

A personal coaching app for goal tracking, daily scheduling, structured reviews, and AI-powered pattern analysis. Single user, mobile-first.

## Tech Stack

- **React Native** (Expo managed workflow) + **Expo Router** (file-based routing)
- **Supabase** — Auth, PostgreSQL, Edge Functions, Push Notifications
- **Claude API** (`claude-sonnet-4-20250514`) via Supabase Edge Functions
- **NativeWind** — Tailwind CSS for React Native
- **Zustand** — State management
- **React Hook Form** — Form handling

## Getting Started

### Prerequisites

- Node.js 20+
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Supabase CLI](https://supabase.com/docs/guides/cli)

### Install dependencies

```bash
npm install
```

### Start local Supabase

```bash
supabase start
supabase db reset   # applies migrations and seed data
```

### Start the dev server

```bash
npx expo start
```

Open in an [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/), [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/), or [Expo Go](https://expo.dev/go).

## Commands

| Command                      | Description                            |
| ---------------------------- | -------------------------------------- |
| `npx expo start`             | Start dev server                       |
| `npx expo start --clear`     | Start with cache cleared               |
| `npx expo run:ios`           | Run on iOS simulator                   |
| `npx expo run:android`       | Run on Android emulator                |
| `npx expo lint`              | Lint check                             |
| `supabase start`             | Start local Supabase                   |
| `supabase db reset`          | Reset local DB and re-run migrations   |
| `supabase functions serve`   | Run Edge Functions locally             |
| `supabase db diff -f <name>` | Generate migration from schema changes |

## Project Structure

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
│   └── review/[type].tsx   # Review flow
├── components/
│   ├── ui/                 # Generic (Button, Card, Input)
│   └── domain/             # Domain-specific (GoalCard, etc.)
├── lib/
│   ├── supabase.ts         # Supabase client
│   ├── types.ts            # TypeScript types
│   └── constants.ts        # Categories, review prompts, config
├── stores/                 # Zustand stores (goals, actions, reviews)
├── hooks/                  # Custom React hooks
├── utils/                  # Pure helper functions
└── supabase/
    ├── migrations/         # SQL migrations
    ├── functions/          # Edge Functions (Claude API integration)
    └── seed.sql            # Dev seed data
```

## Core App Loop

1. **Morning** — Dashboard shows today's actions pulled from recurring rules and scheduled items
2. **During day** — Check off actions, add notes; swipe right to complete, swipe left to skip
3. **Night** — Nightly review: day summary → guided prompts → optional journal → AI analysis
4. **Weekly/Monthly/Quarterly/Yearly** — Progressive reviews at appropriate intervals
