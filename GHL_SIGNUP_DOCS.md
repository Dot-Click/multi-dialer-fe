# Technical Documentation: GHL Integration & Signup Flow

This document summarizes the technical architecture, challenges, and solutions implemented for the automated onboarding and GoHighLevel (GHL) integration.

---

## 1. Automated Signup Flow (Backend)

### The Challenge
Initially, the Stripe webhook provisioning was "fragile." If a sub-process (like creating a GHL account or buying a Twilio number) failed, the user was still left partially created in the database, leading to "Credential account not found" errors during login.

### The Solution: Atomic Provisioning with Rollback
We implemented a strict **Atomic** workflow in `src/routes/webhooks/stripe.ts`:
- **Step 1: DB Creation**: User, Account (Better Auth), and Company are created.
- **Step 2: External Provisioning**: Calls to GHL and Twilio are made.
- **Rollback Mechanism**: If *any* external API call fails (GHL 401, Twilio error, etc.), the system automatically **deletes the newly created User** from the database.
- **Cascade Delete**: Thanks to Prisma's cascade rules, deleting the User automatically wipes the partial Company, Account, and Settings records.
- **Stripe Retry**: The webhook returns a `500` error to Stripe on failure, triggering an automatic retry once the external issue (e.g., API scopes) is fixed.

---

## 2. Better Auth & Login Fix

### The Problem
Users were getting "Credential account not found" even after their DB record existed.
### The Reason
Better Auth requires an explicit entry in the `Account` table with `providerId: 'credential'` and `accountId` matching the `userId` to allow email/password logins.
### The Fix
The signup flow now explicitly creates this `Account` record during the initial DB phase of the Stripe webhook.

---

## 3. GoHighLevel (GHL) Integration

### Current Error
`statusCode: 401, message: 'The token is not authorized for this scope.'`

### Analysis
- This error confirms the API Key is valid but lacks **Agency-level permissions**.
- Creating a sub-account (Location) is an Agency action. 
- A token generated within a single Location cannot create *other* locations.

### Final Solution Requirements
1. **App Type**: You must create a **Private App** at the **Agency level** (Agency Settings -> Marketplace -> Developers).
2. **Required Scope**: The scope **`locations.write`** MUST be enabled.
3. **Verification**: You can verify your token scopes by running:
   ```bash
   node -e "const axios = require('axios'); axios.get('https://services.leadconnectorhq.com/oauth/token/info', { headers: { Authorization: 'Bearer YOUR_TOKEN' } }).then(r => console.log(r.data.scopes))"
   ```

---

## 4. Import Wizard Enhancements (Frontend)

### Address Auto-Mapping
- Added `Property Address`, `City`, `State`, and `Zip` to the primary field list.
- Implemented **Auto-Map Aliases**: Headers like `st`, `zipcode`, `street` will now automatically pair with system fields.

### Inline Creation
- Users can now create **Calling Lists** and **Folders** directly inside the Import Wizard Step 2.
- Clicking the `+` button opens an inline input; clicking "Add" creates the resource and **auto-selects** it for the import immediately.

---

## 5. Maintenance Notes
- **Prisma Middleware**: Background tasks in `src/lib/prisma.ts` were removed as they caused race conditions during rollbacks. Keep initializations explicit in the service layer.
- **GHL Agency ID**: Ensure `GHL_AGENCY_ID` in `.env` matches the `companyId` found in the GHL Agency settings.
