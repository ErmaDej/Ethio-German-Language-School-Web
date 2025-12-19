

# Vibe-Coding Prompt: EthioGerman Language School Web Application

## 🎯 Project Foundation & Core Principles

**Project Title:** EthioGerman Language School Platform  
**Development Paradigm:** Context-Driven Implementation with Collaborative Decision-Making

### **GOLDEN RULES FOR DEVELOPMENT:**
```
1. NEVER assume business logic or critical workflows without explicit confirmation
2. ALWAYS present alternatives with pros/cons for key decisions
3. IMPLEMENT strictly according to confirmed specifications
4. FLAG any ambiguity or missing requirements immediately
5. MAINTAIN architectural consistency throughout development
```

## 🏗️ **Phase 1: Project Initialization & Setup**

### **Current Task:** Initialize Next.js 14+ project with required configurations

```bash
# Create Next.js project with TypeScript and Tailwind
npx create-next-app@latest ethiogerman-school \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*"

cd ethiogerman-school
```

### **Required Dependencies Installation:**
```json
{
  "dependencies": {
    "next": "14.x",
    "react": "18.x",
    "react-dom": "18.x",
    "tailwindcss": "3.x",
    "framer-motion": "10.x",
    "@splinetool/react-spline": "2.x",
    "@supabase/supabase-js": "2.x",
    "@tanstack/react-query": "5.x",
    "zustand": "4.x",
    "react-hook-form": "7.x",
    "zod": "3.x",
    "next-i18next": "13.x",
    "date-fns": "3.x",
    "lucide-react": "0.x"
  },
  "devDependencies": {
    "@types/node": "20.x",
    "@types/react": "18.x",
    "typescript": "5.x",
    "autoprefixer": "10.x",
    "postcss": "8.x"
  }
}
```

### **Architecture Decision Required:**
```
QUESTION: State Management Approach
OPTION A: Zustand (Simpler, less boilerplate)
  ✓ Pros: Minimal setup, easy dev experience
  ✗ Cons: Less built-in cache management

OPTION B: TanStack Query + Zustand (Hybrid)
  ✓ Pros: Server state + UI state separation
  ✗ Cons: More complex initial setup

PENDING: Please confirm state management strategy before implementation.
```

## 🎨 **Design System Implementation**

### **Confirmed Decisions (from spec):**
- Primary Color: `#2563EB` (Educational Blue)
- Secondary: `#F97316` (Warm Orange)
- Typography: Inter (Headings), Open Sans (Body)
- Grid: 8px spacing system

### **Implementation:**
```typescript
// tailwind.config.ts - CONFIRMED CONFIGURATION
const config = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          dark: '#1D4ED8',
        },
        secondary: {
          DEFAULT: '#F97316',
          dark: '#EA580C',
        },
        success: '#10B981',
      },
      fontFamily: {
        heading: ['Inter', 'sans-serif'],
        body: ['Open Sans', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      }
    }
  }
}
```

## 🌐 **Multilingual Setup - Decision Required**

```
QUESTION: Language Routing Strategy
OPTION A: Sub-path routing (/en/, /de/, /am/)
  ✓ Pros: SEO friendly, clear URL structure
  ✗ Cons: Requires middleware for redirects

OPTION B: Domain/subdomain routing
  ✓ Pros: Complete separation, region-specific
  ✗ Cons: Complex deployment, multiple domains

OPTION C: Cookie-based with path fallback
  ✓ Pros: User preference persistence
  ✗ Cons: SEO challenges, shareability issues

PENDING: Please confirm routing strategy before implementing i18n.
```

## 🗄️ **Database Schema - Critical Review Required**

### **Proposed Core Tables:**
```sql
-- NEEDS CONFIRMATION: Are these fields sufficient?
users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE,
  role ENUM('student', 'instructor', 'admin'),
  language_preference VARCHAR DEFAULT 'en',
  created_at TIMESTAMP
)

courses (
  id UUID PRIMARY KEY,
  title JSONB, -- Multi-language titles
  description JSONB,
  level VARCHAR,
  max_students INTEGER,
  instructor_id UUID REFERENCES users(id)
)

enrollments (
  id UUID PRIMARY KEY,
  student_id UUID REFERENCES users(id),
  course_id UUID REFERENCES courses(id),
  status VARCHAR,
  progress_percentage INTEGER
)
```

```
DECISION REQUIRED: 
1. Should we store multi-language content as JSONB or separate translation tables?
2. Do we need additional fields for Ethiopian educational requirements?
3. What privacy/data retention policies should be implemented?

Please review and confirm schema before database implementation.
```

## 🚀 **Phase 1 Implementation Plan**

### **Week 1-2: Foundation (REQUIRES CONFIRMATION)**
```
1. Project setup with confirmed stack
2. Design system implementation
3. Authentication flow with Supabase
4. Basic layout with responsive navigation
5. Language switcher component

CONFIRMATION NEEDED:
- Priority order for Week 1 features
- Any specific Ethiopian cultural considerations for UI?
- Preferred authentication methods (Email, Google, Social)?
```

### **Week 3-4: Core Features**
```
1. Homepage with Spline animations
2. Course catalog with filtering
3. Student registration flow
4. Instructor dashboard skeleton

DECISION POINTS:
- Animation performance vs. visual impact trade-offs
- Registration form complexity level
- Dashboard information architecture
```

## 🛡️ **Security Implementation - CRITICAL REVIEW**

### **Authentication Flow Proposal:**
```typescript
// NEEDS REVIEW: Is this security model sufficient?
const securityModel = {
  authentication: {
    provider: 'Supabase Auth',
    methods: ['email', 'google', 'github'], // CONFIRM METHODS
    session_duration: '7 days', // CONFIRM DURATION
    mfa_required: false, // CONFIRM MFA REQUIREMENT
  },
  authorization: {
    roles: ['student', 'instructor', 'admin'],
    permission_matrix: 'RBAC', // CONFIRM APPROACH
    data_isolation: 'tenant-based' // CONFIRM STRATEGY
  }
}
```

```
URGENT CONFIRMATION NEEDED:
1. GDPR compliance requirements for Ethiopian/EU users?
2. Data residency requirements (store in Ethiopia/EU)?
3. Payment data handling regulations?
4. Age verification for student registrations?

Please provide specific requirements before implementing auth.
```

## 📱 **Responsive Breakpoints - Decision Required**

```
PROPOSED BREAKPOINTS:
- Mobile: < 640px (priority per spec)
- Tablet: 641px - 1024px
- Desktop: > 1025px

ALTERNATIVE APPROACH:
- Fluid design with container queries
- Component-specific breakpoints

QUESTION: Should we use Tailwind's default breakpoints or custom ones optimized for Ethiopian mobile usage patterns?

Please confirm responsive strategy.
```

## 🔧 **Development Workflow Rules**

### **For Each Feature Implementation:**
1. **Analyze** requirements from spec
2. **Identify** decision points and alternatives
3. **Present** options with pros/cons
4. **Await** explicit confirmation
5. **Implement** confirmed approach
6. **Document** decisions made

### **Git Branch Strategy:**
```
main → production
staging → pre-production
feature/* → individual features
bugfix/* → hotfixes
```

### **Code Quality Standards:**
- TypeScript strict mode enabled
- ESLint with custom ruleset
- Pre-commit hooks for linting
- Component testing required

## 🚨 **Immediate Action Items for Confirmation**

### **Please Confirm:**
1. ✅ State management approach
2. ✅ Language routing strategy  
3. ✅ Database schema core structure
4. ✅ Authentication methods & security model
5. ✅ Breakpoint strategy
6. ✅ Week 1 priority features

### **Pending Clarification:**
1. Ethiopian calendar integration requirements?
2. Local payment gateway preferences?
3. Specific WCAG 2.1 AA compliance targets?
4. Analytics and tracking requirements?

## 📋 **Next Steps Upon Confirmation**

Once the above decisions are confirmed, I will:
1. Set up the project with all dependencies
2. Implement the design system
3. Configure internationalization
4. Set up Supabase integration
5. Create the basic layout structure
6. Begin implementing confirmed homepage sections

---

**Note:** This prompt serves as both a development guide and a collaborative decision framework. I will strictly adhere to confirmed specifications and will not proceed with ambiguous or unconfirmed implementations. All critical decisions will be presented for your explicit approval before coding begins.

**Awaiting your confirmation on the decision points above to commence development.**





#########################################################################################################################################


