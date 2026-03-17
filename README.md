# CallScout Multi-Dialer — Frontend

The frontend for CallScout is a high-performance, responsive React application designed for seamless multi-line dialing and CRM management.

## Technical Stack

- **Framework**: [React](https://reactjs.org/) (v19)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **UI Components**: Radix UI (Shadcn UI), Ant Design, Lucide Icons
- **Telephony**: [Twilio Voice SDK](https://www.twilio.com/docs/voice/sdks)
- **Routing**: React Router DOM (v7)
- **Forms & Validation**: Zod, React Hook Form (implied by shadcn patterns)
- **Charts**: Recharts

## Main Modules

### 1. Agent Dashboard
- **Live Dialer**: Multi-line calling interface powered by Twilio.
- **Contact Management**: Search, filter, and view detailed contact information.
- **Library**: Access to call scripts, SMS templates, and email templates for quick outreach.
- **Calendar**: Integration for scheduling follow-ups and tasks.

### 2. Admin Workspace
- **Team Management**: User creation, role assignment, and performance monitoring.
- **System Configuration**: Global dialer settings, caller ID management, and custom lead sheets.
- **Action Plans**: Create automated workflows for lead follow-up.
- **Billing & Subscription**: Manage portal billing and feature upgrades.

### 3. Super Admin Portal
- **Platform Overview**: High-level reporting and user statistics.
- **Subscription Management**: Controlling subscription plans and user billing.
- **Audit Logs**: Tracking system-wide activities for security and compliance.

## Folder Structure

```text
multi-dialer-fe/
├── src/
│   ├── components/     # Reusable UI components (shadcn/ui, admin, agent)
│   ├── hooks/          # Custom React hooks
│   ├── layouts/        # Page layouts (Agent, Admin, SuperAdmin)
│   ├── lib/            # External library configurations (Axios, BetterAuth)
│   ├── pages/          # Main page components organized by role
│   ├── providers/      # Context providers (Twilio, Auth, etc.)
│   ├── store/          # Redux Toolkit slices and store configuration
│   ├── utils/          # Helper functions and constants
│   ├── App.tsx         # Main application component
│   ├── router.tsx      # Route definitions and access control
│   └── main.tsx        # Application entry point
├── public/             # Static assets
└── vite.config.ts      # Vite configuration
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- Backend server running (see [Backend README](../multi-dialer-be/README.md))

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up environment variables:
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_TWILIO_ACCESS_TOKEN_URL=http://localhost:5000/api/calling/token
   ```

### Running the Application
- **Development**:
  ```bash
  npm run dev
  ```
- **Build**:
  ```bash
  npm run build
  ```
- **Lint**:
  ```bash
  npm run lint
  ```

## UI & UX Standards
- **Responsive Design**: Mobile-first approach for dashboard accessibility.
- **Dark/Light Mode**: Support for themes (where implemented).
- **Interactive UI**: Real-time updates for call statuses and notifications.

---

For backend integration details, please see the [Backend README](../multi-dialer-be/README.md).
