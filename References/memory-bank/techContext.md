# Tech Context: EthioGerman Language School

## Technologies

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0, CSS Variables
- **Animations**: Framer Motion
- **UI Components**: Shadcn UI (Radix UI)
- **Forms**: React Hook Form, Zod
- **State Management**: Zustand, React Query
- **Internationalization**: custom i18n implementation (`lib/i18n`)

### Backend & Infrastructure
- **BaaS**: Supabase
  - **Database**: PostgreSQL
  - **Auth**: Supabase Auth
  - **Storage**: Supabase Storage
- **Deployment**: Vercel (planned)

## Technical Decisions
- **Multi-tenant System**: Three-tier hierarchy (Student, Instructor, Admin).
- **Responsive Design**: Mobile-first approach with tablet and desktop optimization.
- **Dark Mode Support**: Built-in theme switching system.
- **i18n**: Support for English, Amharic, and German.

## Integration Points
- **Chapa Payment Gateway**: Active integration for Ethiopian payment processing (test mode).
- **Google Calendar API**: Planned for scheduling sync.
- **Zoom/Meet**: Planned for online classes.
- **AI Assistant**: Planned for language support.

## Payment Integration
- **Gateway**: Chapa (Ethiopian payment gateway)
- **Currency**: ETB (Ethiopian Birr)
- **Flow**: Enroll first (pending) → Pay later → Auto-confirm on payment
- **Webhooks**: Real-time payment status updates
- **Auto-cancellation**: Unpaid enrollments cancelled after timeout period
