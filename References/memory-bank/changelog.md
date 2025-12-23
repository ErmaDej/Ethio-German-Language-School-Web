# Changelog: EthioGerman Language School

## [2025-12-22] - Phase 2: Dashboard & UX Enhancements
### Added
- Functional Course Search & Filter by CEFR Level and Delivery Method.
- New translation keys for dashboard components in English, German, and Amharic.
- Loading states and animations to dashboards.

### Changed
- Upgraded Admin Dashboard with statistics and premium dark mode styling.
- Upgraded Instructor Dashboard with course overview and i18n support.
- Enhanced Student Dashboard with personalization and goal tracking.

## [2025-12-22] - Phase 1: Core Data & Authentication
### Added
- SQL migration for restructuring courses to German-only (`007_restructure_german_courses_only.sql`).
- Profile fields `goal` and `current_level` in Supabase.
- i18n support for profile management.

### Changed
- Updated `ProfileForm` to support new fields and multi-language UI.
- Restructured `courses` table with `delivery_method`.

## [2025-12-23] - Initial Memory Bank & Strategy Update

## [Previous]
- Project initialization with Next.js, Supabase, and Tailwind CSS.
- Implementation of landing page components and basic UI system.
- Creation of basic course and profile management logic.
