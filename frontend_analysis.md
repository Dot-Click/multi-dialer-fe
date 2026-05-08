# Frontend Architecture & Feature Analysis

## Technology Stack
- **Framework:** React 19 + Vite + TypeScript
- **Styling:** Tailwind CSS v4, Radix UI (Shadcn), class-variance-authority, Tailwind Merge
- **State Management:** Redux Toolkit, TanStack React Query
- **Routing:** React Router DOM (v7)
- **Data Tables:** TanStack Table
- **Forms/Rich Text:** Tiptap (Rich Text Editor), React Phone Number Input
- **Charts:** Recharts

---

## Application Flow & Layouts

The application is heavily compartmentalized based on the user's role. It uses `ProtectedRoute` wrappers to enforce access control.

### 1. Public Routes
- **Endpoints:** `/agent/login`, `/admin/login`, `/agent/code`, `/admin/password-recovery`
- **Flow:** Users authenticate via Better Auth. Dependent on their role, they are redirected to their respective dashboard.

### 2. Agent Portal (`/`)
Wrapped in `DashboardLayout` and `TwilioProvider` (for in-browser calling).
- **Dashboard (`/`)**: Overview of daily tasks, stats, and upcoming callbacks.
- **Data Dialer (`/data-dialer`)**: 
  - The core interface where agents view assigned lists.
  - **Contact Detail (`/data-dialer/contact-detail/:id`)**: The actual dialer UI. Shows contact info, lead sheet questions, scripts, and holds the active call controls.
- **Inbox (`/inbox`)**: Messages, emails, or SMS history.
- **Library (`/library`)**: View access to scripts, email templates, etc.
- **Calendar (`/calendar`)**: View appointments and follow-ups.
- **Reports & Analytics (`/reports-analytics`)**: Personal call stats.

### 3. Admin Portal (`/admin`)
Wrapped in `AdminDashboardLayout` and `TwilioProvider`. Admins have all agent features plus management capabilities.
- **User Management (`/admin/user-management`)**: Add, edit, or remove agents under their tenancy.
- **System Settings (`/admin/system-settings`)**:
  - **Call Settings (`/admin/create-setting`)**: Manage caller IDs and routing.
  - **Action Plans (`/admin/action-plan`)**: Create automated workflows.
  - **Lead Sheets (`/admin/add-lead-sheet`)**: Build custom qualification forms.
  - **Integrations**: Connect MyPlusLeads, Webhooks, etc.
  - **Compliance (`/admin/compliance`)**: Set TCPA boundaries.
- **Data Management (`/admin/data-dialer`)**:
  - Import/Export contacts.
  - Find Duplicates (`/admin/find-duplicate`).
  - Restore Data (`/admin/restore-data`).
- **Billing (`/admin/billing`)**: View invoices and upgrade plans.
- **Library Management (`/admin/library`)**: Create and upload company-wide scripts, templates, and audio assets.

### 4. Super Admin Portal (`/super-admin`)
Wrapped in `SuperAdminDashboardLayout`. This is for the platform owners.
- **User Management (`/super-admin/user-management`)**: Manage Owner/Admin accounts across the entire SaaS.
- **Subscription Management (`/super-admin/subscription-management`)**: Manage global subscription tiers.
- **Reporting (`/super-admin/reporting`)**: Platform-wide metrics.
- **Audit Logs (`/super-admin/audit-logs`)**: View platform security and action logs.

---

## Core Frontend Mechanisms
- **Twilio Voice SDK:** Wrapped at the layout level (`TwilioProvider`) so that incoming calls or active dialer sessions persist as the user navigates between pages (e.g., browsing the calendar while on a call).
- **TanStack Query vs Redux:** Redux is likely used for synchronous global state (UI toggles, active call state), while TanStack Query is used for asynchronous data fetching and caching (fetching contact lists, user profiles).
