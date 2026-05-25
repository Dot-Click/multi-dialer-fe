# Technical Design: Voicemail Detection Toggle

## Overview

This feature adds an `amdEnabled` boolean toggle to the existing `CallSettings` / Dialer Settings infrastructure. When enabled, Twilio's Answering Machine Detection (AMD) fires on every outbound call (power dialer and manual), and any machine-detected call is immediately hung up and skipped — the dialer moves to the next contact without playing a voicemail recording.

The existing AMD infrastructure in `makeCall()` (power dialer) already passes `machineDetection`, `asyncAmd`, and `asyncAmdStatusCallback` unconditionally. This design makes those parameters conditional on `amdEnabled`, extends the same behaviour to manual calls, and adds the skip-on-machine path to `handleAmdStatus`.

---

## Architecture

### Data Flow

```
Admin toggles amdEnabled in DialerSetting UI
  → PUT /system-settings/call-settings/:id { amdEnabled: true }
  → CallSettings.amdEnabled persisted in DB

Agent starts power dialer session
  → POST /calling/leads { leads, callerIds, pacing }
  → addLeadsToDialer reads amdEnabled from CallSettings
  → passes amdEnabled into DialerService.addLeadsToQueue()
  → makeCall() reads amdEnabled, conditionally adds AMD params to Twilio call
  → asyncAmdStatusCallback URL includes ?amdEnabled=true&agentId=...

Twilio detects machine
  → POST /api/calling/webhooks/amd-status?amdEnabled=true&agentId=...
  → handleAmdStatus parses amdEnabled=true
  → isMachine=true → hang up immediately, no voicemail
  → dialerService.activeCalls.delete(CallSid)
  → dialerService.updateLeadStatusInDB(leadId, "MACHINE")
  → dialerService.processQueue(userId) → next lead dialed

Agent starts manual call (browser)
  → device.connect() → POST /webhooks/voice → startCalling
  → startCalling fetches CallSettings for userId
  → if amdEnabled: adds AMD params to Twilio call
  → same AMD webhook path handles machine detection
```

---

## Components to Modify

### Backend

#### 1. `prisma/schema.prisma` — `CallSettings` model
Add one field:
```prisma
amdEnabled  Boolean  @default(false)
```

#### 2. `src/schemas/callSettings.schema.ts`
Add to both `createCallSettingsSchema` and `updateCallSettingsSchema`:
```ts
amdEnabled: z.boolean().optional(),
```

#### 3. `src/routes/systemSettings/callSettings/controller.ts` — `updateCallSettings`
The existing update handler already spreads `data` into the Prisma update. No structural change needed — `amdEnabled` flows through automatically once the schema and Zod schema are updated.

#### 4. `src/routes/calling/services.ts` — `DialerService`

**`makeCall()` changes:**
- The existing settings fetch already reads `callSettings[0]`. Extend it to also read `amdEnabled`:
  ```ts
  const amdEnabled = settings?.callSettings[0]?.amdEnabled ?? false;
  ```
- Wrap the existing AMD params in a conditional:
  ```ts
  ...(amdEnabled ? {
    machineDetection: "DetectMessageEnd",
    asyncAmd: "true",
    asyncAmdStatusCallback: `${envConfig.BACKEND_URL}/api/calling/webhooks/amd-status?answeringMachineUrl=${encodeURIComponent(amRecordingUrl)}&agentId=${lead.userId}&amdEnabled=true`,
    asyncAmdStatusCallbackMethod: "POST",
  } : {}),
  ```
- If `amdEnabled` is false, AMD params are omitted entirely (existing behaviour for non-AMD calls).

**No new methods needed in `DialerService`** — `processQueue` and `updateLeadStatusInDB` are already public and called from the webhook handler.

#### 5. `src/routes/calling/controller.ts`

**`handleAmdStatus` changes:**
- Parse `amdEnabled` from query string:
  ```ts
  const amdEnabled = req.query.amdEnabled === 'true';
  ```
- New skip-on-machine branch when `amdEnabled` is true:
  ```ts
  if (isMachine) {
    // Update CallRecord
    const callRecord = await prisma.callRecord.findUnique({ where: { callSid: CallSid } });
    const endTime = new Date();
    const duration = callRecord?.startTime
      ? Math.floor((endTime.getTime() - callRecord.startTime.getTime()) / 1000)
      : 0;
    try {
      await prisma.callRecord.update({
        where: { callSid: CallSid },
        data: { disposition: "MACHINE", status: "machine-detected", endTime, duration }
      });
    } catch (e) { /* log warning, continue */ }

    if (amdEnabled) {
      // Skip: hang up immediately, no voicemail
      const metadata = (dialerService as any).activeCalls.get(CallSid);
      const userId = callRecord?.userId || metadata?.userId || agentId;
      const leadId = metadata?.leadId;

      // Remove from activeCalls before processQueue
      (dialerService as any).activeCalls.delete(CallSid);

      if (leadId) await dialerService.updateLeadStatusInDB(leadId, "MACHINE");

      try {
        const userClient = await getTwilioClient(userId || agentId);
        await userClient.calls(CallSid).update({ status: 'completed' });
      } catch (hangupErr: any) {
        console.error(`[AMD] Hangup failed for ${CallSid}:`, hangupErr.message);
        try {
          await prisma.callRecord.update({
            where: { callSid: CallSid },
            data: { status: "hangup-failed" }
          });
        } catch (e) { /* non-fatal */ }
      }

      if (userId) dialerService.processQueue(userId);

    } else {
      // Existing behaviour: play voicemail or hang up
      if (answeringMachineUrl) {
        await userClient.calls(CallSid).update({
          twiml: `<Response><Play>${answeringMachineUrl}</Play><Hangup/></Response>`
        });
      } else {
        await userClient.calls(CallSid).update({ status: 'completed' });
      }
    }
  }
  ```

**`startCalling` changes (manual dialing AMD support):**
- After the existing `userClient` setup, fetch `CallSettings`:
  ```ts
  let amdEnabled = false;
  try {
    const settings = await prisma.system_Setting.findFirst({
      where: { userId: agentId },
      include: { callSettings: true }
    });
    amdEnabled = settings?.callSettings[0]?.amdEnabled ?? false;
  } catch (e) {
    console.warn(`[startCalling] Failed to fetch CallSettings for AMD check:`, e);
    // amdEnabled stays false — safe default
  }
  ```
- Add AMD params conditionally to the `userClient.calls.create()` call:
  ```ts
  ...(amdEnabled ? {
    machineDetection: "DetectMessageEnd",
    asyncAmd: "true",
    asyncAmdStatusCallback: `${envConfig.BACKEND_URL}/api/calling/webhooks/amd-status?agentId=${agentId}&amdEnabled=true`,
    asyncAmdStatusCallbackMethod: "POST",
  } : {}),
  ```

**`addLeadsToDialer` changes:**
- No change needed. `makeCall()` fetches `amdEnabled` from DB directly per-call, so it's always current at call-initiation time.

---

### Frontend

#### 6. `src/hooks/useSystemSettings.ts` — `CallSettings` interface
Add the field:
```ts
export interface CallSettings {
  // ... existing fields ...
  amdEnabled?: boolean;
}
```

#### 7. `src/components/admin/systemsettings/dialersetting.tsx` — `DialerSetting` component

This is the live settings component that uses `useDialerSettings`. The AMD toggle is added as a third card in the existing grid, following the same visual pattern as the "Answer Notification Tone" toggle card.

**State:**
```ts
const [amdEnabled, setAmdEnabled] = useState(false);
```

**Init from fetched data:**
```ts
useEffect(() => {
  if (dialerSettings) {
    setVoicemailMode(dialerSettings.voicemailMode || 'auto');
    setUseAnswerTone(dialerSettings.useAnswerNotificationTone || false);
    setAmdEnabled(dialerSettings.amdEnabled ?? false);  // ← new
  }
}, [dialerSettings]);
```

**Save payload:**
```ts
updateDialerSettings.mutate({
  voicemailMode,
  useAnswerNotificationTone: useAnswerTone,
  amdEnabled,  // ← new
}, { ... });
```

**New card JSX** (added after the Answer Notification card):
```tsx
{/* Voicemail Detection Card */}
<div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
        <PhoneOff className="w-6 h-6 text-purple-600 dark:text-purple-400" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Voicemail Detection (Skip on Machine)
        </h2>
        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
          <Info className="w-4 h-4" />
          <span>Applies to both power dialer and manual calls</span>
        </div>
      </div>
    </div>
    <button
      onClick={() => setAmdEnabled(!amdEnabled)}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800 ${
        amdEnabled ? 'bg-yellow-400' : 'bg-gray-200 dark:bg-slate-700'
      }`}
    >
      <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-md ${
        amdEnabled ? 'translate-x-6' : 'translate-x-1'
      }`} />
    </button>
  </div>

  <p className="text-gray-600 dark:text-gray-400 mt-6 max-w-2xl">
    When enabled, calls answered by a machine will be skipped and the dialer will move to the next contact.
  </p>

  {amdEnabled && !dialerSettings?.answeringMachineRecordingId && (
    <div className="mt-4 flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-sm text-blue-700 dark:text-blue-300">
      <Info className="w-4 h-4 mt-0.5 shrink-0" />
      <span>Voicemail drop is disabled. Machine-answered calls will be skipped automatically.</span>
    </div>
  )}
</div>
```

> **Note:** `useDialerSettings` maps to the `DialerSetting` model (not `CallSettings`). If `amdEnabled` is stored on `CallSettings`, the hook needs to be updated to also fetch/update `CallSettings`. See the Data Model section below for the decision.

---

## Data Model

### Decision: Where to store `amdEnabled`

The `DialerSetting` component uses `useDialerSettings` which maps to a separate `DialerSetting` model (not `CallSettings`). The `CallSettings` model is used by `makeCall()` in the power dialer.

**Chosen approach:** Add `amdEnabled` to `CallSettings` (where the other dialer behaviour flags like `enableRecording`, `enableAutoPause` already live), and update `useDialerSettings` to also read/write `amdEnabled` from the first `CallSettings` record for the user.

This keeps the backend logic simple — `makeCall()` already fetches `callSettings[0]` — and avoids creating a new model.

### Prisma Migration

```prisma
// In CallSettings model
amdEnabled  Boolean  @default(false)
```

Migration command:
```bash
npx prisma migrate dev --name add_amd_enabled_to_call_settings
```

---

## API Changes

### `PUT /system-settings/call-settings/:id`

**Request body** (new optional field):
```json
{ "amdEnabled": true }
```

**Response** (new field in returned record):
```json
{
  "id": "...",
  "label": "...",
  "amdEnabled": true,
  ...
}
```

No new endpoints are needed. The existing CRUD for `CallSettings` handles this automatically once the Prisma model and Zod schema are updated.

---

## Sequence Diagrams

### Power Dialer — Machine Detected, amdEnabled=true

```
DialerService.makeCall()
  → reads amdEnabled=true from CallSettings
  → calls.create({ machineDetection, asyncAmd, asyncAmdStatusCallback?amdEnabled=true })
  → Twilio dials customer

Twilio AMD detects machine
  → POST /webhooks/amd-status?amdEnabled=true&agentId=userId
  → handleAmdStatus:
      isMachine=true, amdEnabled=true
      → prisma.callRecord.update({ disposition:"MACHINE", status:"machine-detected", endTime, duration })
      → dialerService.activeCalls.delete(CallSid)
      → dialerService.updateLeadStatusInDB(leadId, "MACHINE")
      → userClient.calls(CallSid).update({ status:'completed' })
      → dialerService.processQueue(userId)  ← next lead dialed
  → res.sendStatus(200)
```

### Power Dialer — Machine Detected, amdEnabled=false (existing behaviour)

```
DialerService.makeCall()
  → reads amdEnabled=false
  → calls.create({ machineDetection, asyncAmd, asyncAmdStatusCallback?amdEnabled=false })

Twilio AMD detects machine
  → POST /webhooks/amd-status?amdEnabled=false
  → handleAmdStatus:
      isMachine=true, amdEnabled=false
      → if answeringMachineUrl: play voicemail TwiML
      → else: calls(CallSid).update({ status:'completed' })
  → res.sendStatus(200)
  (no processQueue call — existing behaviour)
```

### Manual Call — Machine Detected, amdEnabled=true

```
Agent: device.connect() → POST /webhooks/voice → startCalling
  → fetches CallSettings, amdEnabled=true
  → calls.create({ machineDetection, asyncAmd, asyncAmdStatusCallback?amdEnabled=true })

Twilio AMD detects machine
  → POST /webhooks/amd-status?amdEnabled=true&agentId=userId
  → handleAmdStatus:
      isMachine=true, amdEnabled=true
      → hang up immediately
      → (no processQueue for manual calls — single contact)
  → res.sendStatus(200)
```

---

## Error Handling

| Scenario | Behaviour |
|---|---|
| `CallSettings` fetch fails in `makeCall()` | `amdEnabled` defaults to `false`; call proceeds without AMD; error logged |
| `CallSettings` fetch fails in `startCalling()` | `amdEnabled` defaults to `false`; call proceeds without AMD; warning logged |
| Twilio hangup API fails in `handleAmdStatus` | Error logged; `CallRecord.status` set to `"hangup-failed"`; HTTP 200 returned to Twilio |
| `CallRecord` not found for `CallSid` | Warning logged; hangup/skip still executed; HTTP 200 returned |
| Unknown `AnsweredBy` value | Treated as human; no call modification; unrecognized value logged |
| `amdEnabled` query param is not `"true"` | Parsed as `false` (safe default) |

---

## Files Changed Summary

| File | Change |
|---|---|
| `multi-dialer-be/prisma/schema.prisma` | Add `amdEnabled Boolean @default(false)` to `CallSettings` |
| `multi-dialer-be/src/schemas/callSettings.schema.ts` | Add `amdEnabled: z.boolean().optional()` to both schemas |
| `multi-dialer-be/src/routes/calling/services.ts` | `makeCall()`: read `amdEnabled`, conditionally add AMD params |
| `multi-dialer-be/src/routes/calling/controller.ts` | `handleAmdStatus()`: parse `amdEnabled`, add skip branch; `startCalling()`: fetch `amdEnabled`, conditionally add AMD params |
| `multi-dialer-fe/src/hooks/useSystemSettings.ts` | Add `amdEnabled?: boolean` to `CallSettings` interface |
| `multi-dialer-fe/src/components/admin/systemsettings/dialersetting.tsx` | Add `amdEnabled` state, init, save, and new toggle card UI |
