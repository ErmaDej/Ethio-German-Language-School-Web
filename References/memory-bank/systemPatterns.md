# System Patterns: EthioGerman Language School

## Architecture Overview
The application follows a modern Next.js App Router architecture, leveraging React Server Components (RCS) for performance and Client Components for interactivity.

## Key Patterns

### Component Structure
- **Landing Components**: Modular sections for the homepage (Hero, Features, Courses, etc.) under `components/landing`.
- **UI Components**: Atomic design system based on Shadcn UI under `components/ui`.
- **Feature-specific Components**: Components organized by actor or feature (e.g., `components/courses`, `components/student`).

### Data Fetching & State
- **Server Actions/Components**: Used for initial data fetch and sensitive operations.
- **Supabase Client**: Direct client-side fetching for real-time updates where appropriate.
- **Zustand**: Used for transient UI state (e.g., current language, theme).

### Security & Auth
- **Row Level Security (RLS)**: PostgreSQL policies in Supabase for data isolation.
- **Role-Based Access Control (RBAC)**: Enforced via `lib/auth.ts` helper functions.

### Multilingual Support
- Centralized translations in `lib/i18n/translations.ts`.
- `useLanguage` hook for accessing current language state.
- URL-agnostic language switching (state-based).

## Directory Structure
- `app/`: Routing and page components.
- `components/`: UI components and shared sections.
- `lib/`: Utilities, hooks, and core logic.
- `scripts/`: SQL migrations and setup scripts.
- `References/`: Documentation and project context.
