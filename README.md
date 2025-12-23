
# EthioGerman Language School Web Application

A comprehensive language learning platform designed to connect Ethiopian students with expert German language instructors. The application facilitates course management, student enrollment, scheduling, and progress tracking, providing a modern and accessible learning experience.

## ✨ Key Features

### 🏢 For Administrators
- **Course Management:** Create, update, and manage German language courses with CEFR levels (A1-C2).
- **Schedule Management:** Organize class schedules, assign instructors, and manage classroom availability.
- **Enrollment Tracking:** View and manage student enrollments, payment statuses, and class capacities.
- **Dashboard:** Real-time insights into active courses, revenue, and user statistics.
- **Internationalization:** Full support for English, German, and Amharic languages.

### 👨‍🏫 For Instructors
- **Class Management:** View assigned schedules and class rosters.
- **Student Progress:** Track student attendance and performance.
- **Resource Sharing:** (Planned) Upload materials and assignments.

### 👨‍🎓 For Students
- **Course Discovery:** Browse and filter courses by level, delivery method (Online/Onsite), and schedule.
- **Easy Enrollment:** Simple registration and enrollment process for available classes.
- **Progress Tracking:** Monitor course progress and upcoming classes.
- **Multilingual Interface:** Learn in your preferred language (English, Amharic, or German).

## 🚀 Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, Framer Motion (Animations)
- **Database & Auth:** Supabase
- **UI Components:** Shadcn/ui (Radix UI)
- **State Management:** Zustand
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ installed
- NPM or Bun package manager
- A Supabase project set up

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/ethio-german-web.git
   cd ethio-german-web
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open:** Open [http://localhost:3000](http://localhost:3000) in your browser.

## 👥 Roles & Access

The application supports three user roles:
- **Student:** Default role upon registration.
- **Instructor:** Access to teaching schedules and student lists.
- **Admin:** Full access to managing courses, schedules, and users.

> **Note:** To access the Admin Panel, you must have the `admin` role. Currently, this role must be assigned manually in the database.

### How to Assign Admin Role
1. Sign up as a new user in the app.
2. Go to your Supabase Dashboard > Table Editor > `profiles` table.
3. Find your user row and change the `role` column to `admin`.
4. Refresh the application to access the Admin Dashboard.

## 🌍 Internationalization

The platform is built with inclusivity in mind, supporting:
- 🇬🇧 English
- 🇩🇪 German
- 🇪🇹 Amharic

## 📍 Location

EthioGerman Language School is located at:
**Megenagna, City Mall**, Addis Ababa, Ethiopia.

---

Built with ❤️ for better education.
