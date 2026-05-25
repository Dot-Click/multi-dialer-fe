# Implementation Tasks: Voicemail Detection Toggle

## Tasks

- [x] 1. Add `amdEnabled` field to Prisma schema and run migration
  - Add `amdEnabled Boolean @default(false)` to the `CallSettings` model in `prisma/schema.prisma`
  - Run `npx prisma migrate dev --name add_amd_enabled_to_call_settings` in the backend workspace
  - Verify the migration file is generated and the `call_settings` table has the new column
  - **Files:** `multi-dialer-be/prisma/schema.prisma`
  - **Requirements:** 1.1, 1.2

- [x] 2. Update Zod validation schemas for CallSettings
  - Add `amdEnabled: z.boolean().optional()` to `createCallSettingsSchema`
  - Add `amdEnabled: z.boolean().optional()` to `updateCallSettingsSchema`
  - Ensure non-boolean values for `amdEnabled` produce a 400 validation error (requirement 1.5)
  - **Files:** `multi-dialer-be/src/schemas/callSettings.schema.ts`
  - **Requirements:** 1.3, 1.4, 1.5, 1.6
  - **Depends on:** 1

- [x] 3. Update `makeCall()` in DialerService to conditionally apply AMD params
  - In `src/routes/calling/services.ts`, extend the existing `settings` fetch to read `amdEnabled` from `callSettings[0]`
  - Default `amdEnabled` to `false` if absent or null
  - Wrap the existing `machineDetection`, `asyncAmd`, and `asyncAmdStatusCallback` params in a conditional spread: only include them when `amdEnabled === true`
  - Append `&amdEnabled=true` to the `asyncAmdStatusCallback` URL when AMD is enabled
  - If `amdEnabled` is false, omit all AMD params from the Twilio call (preserves existing non-AMD behaviour)
  - **Files:** `multi-dialer-be/src/routes/calling/services.ts`
  - **Requirements:** 3.6, 3.7, 7.3
  - **Depends on:** 1, 2

- [x] 4. Rewrite `handleAmdStatus` to support skip-on-machine when `amdEnabled=true`
  - In `src/routes/calling/controller.ts`, parse `amdEnabled` from `req.query.amdEnabled === 'true'` (requirement 3.8)
  - Fetch the `CallRecord` for the `CallSid` to get `startTime`, `userId`, and `leadId`
  - Calculate `endTime = new Date()` and `duration = startTime ? Math.floor((endTime - startTime) / 1000) : 0`
  - When `isMachine === true`:
    - Update `CallRecord` with `{ disposition: "MACHINE", status: "machine-detected", endTime, duration }` — log warning if record not found, do not throw (requirement 6.4)
    - If `amdEnabled === true` (skip branch):
      - Delete `CallSid` from `dialerService.activeCalls` before calling `processQueue` (requirement 3.2)
      - Call `dialerService.updateLeadStatusInDB(leadId, "MACHINE")` if `leadId` is present (requirement 6.1, 6.2)
      - Call `userClient.calls(CallSid).update({ status: 'completed' })` — on failure, log error and update `CallRecord.status` to `"hangup-failed"`, then continue (requirement 7.2)
      - Call `dialerService.processQueue(userId)` to advance to next lead (requirement 3.2)
    - If `amdEnabled === false` (existing voicemail-drop branch):
      - If `answeringMachineUrl` is set: play voicemail TwiML (requirement 3.3)
      - Else: hang up with `status: 'completed'` (requirement 3.4)
  - When `isMachine === false` (human/unknown/unrecognized):
    - For `human` or `unknown`: respond HTTP 200, no call modification (requirement 3.5, 4.4)
    - For unrecognized `AnsweredBy` values: log the value with `CallSid`, treat as human, no call modification (requirement 7.1)
  - Always respond `res.sendStatus(200)` to Twilio (requirement 7.2)
  - **Files:** `multi-dialer-be/src/routes/calling/controller.ts`
  - **Requirements:** 3.1, 3.2, 3.3, 3.4, 3.5, 3.8, 4.3, 4.4, 6.1, 6.2, 6.3, 6.4, 7.1, 7.2, 7.5
  - **Depends on:** 1, 3

- [x] 5. Update `startCalling` to fetch `amdEnabled` and apply AMD params to manual calls
  - In `src/routes/calling/controller.ts`, after the existing `userClient` setup in `startCalling`, add a try/catch block to fetch `system_Setting` with `include: { callSettings: true }` for the `agentId`
  - Read `amdEnabled = settings?.callSettings[0]?.amdEnabled ?? false`
  - On fetch failure: log a warning with `userId` and error details, keep `amdEnabled = false`, do not return an error (requirement 4.6)
  - Conditionally spread AMD params into the `userClient.calls.create()` call: `machineDetection`, `asyncAmd`, `asyncAmdStatusCallback` with `?agentId=...&amdEnabled=true` (requirement 4.1)
  - When `amdEnabled === false`: no AMD params added (requirement 4.2)
  - **Files:** `multi-dialer-be/src/routes/calling/controller.ts`
  - **Requirements:** 4.1, 4.2, 4.5, 4.6
  - **Depends on:** 1, 4

- [x] 6. Add `amdEnabled` to the frontend `CallSettings` TypeScript interface
  - In `src/hooks/useSystemSettings.ts`, add `amdEnabled?: boolean` to the `CallSettings` interface
  - Verify the `useCallSettings` hook's create/update mutation types accept the new field
  - **Files:** `multi-dialer-fe/src/hooks/useSystemSettings.ts`
  - **Requirements:** 1.3, 2.2, 2.3
  - **Depends on:** 2

- [x] 7. Add AMD toggle card to the `DialerSetting` UI component
  - In `src/components/admin/systemsettings/dialersetting.tsx`:
    - Add `const [amdEnabled, setAmdEnabled] = useState(false)` state
    - In the `useEffect` that initialises from `dialerSettings`, add `setAmdEnabled(dialerSettings.amdEnabled ?? false)`
    - Add `amdEnabled` to the `updateDialerSettings.mutate(...)` payload
    - Add a new card after the "Answer Notification Tone" card with:
      - A `PhoneOff` icon (import from `lucide-react`) in a purple icon container
      - Title: "Voicemail Detection (Skip on Machine)"
      - Subtitle: "Applies to both power dialer and manual calls"
      - Toggle button using the same `h-7 w-12` pill pattern as the existing Answer Notification toggle
      - Description text: "When enabled, calls answered by a machine will be skipped and the dialer will move to the next contact."
      - Conditional info note when `amdEnabled && !dialerSettings?.answeringMachineRecordingId`: "Voicemail drop is disabled. Machine-answered calls will be skipped automatically." (requirement 2.6)
  - Toggle initialises to OFF (unchecked) for new records (requirement 2.1)
  - Toggle reflects stored value when editing an existing record (requirement 2.4)
  - **Files:** `multi-dialer-fe/src/components/admin/systemsettings/dialersetting.tsx`
  - **Requirements:** 2.1, 2.2, 2.3, 2.4, 2.5, 2.6
  - **Depends on:** 6
