# Requirements Document

## Introduction

This feature adds a **Voicemail Detection Toggle** to the multi-dialer's Call Settings. When enabled, the system uses Twilio's Answering Machine Detection (AMD) to identify voicemail/machine answers and immediately skips to the next contact in the queue — without playing a voicemail recording. When disabled (or when a voicemail recording URL is configured), the existing behavior of dropping a voicemail recording is preserved.

The toggle applies to both the **power dialer** (simultaneous/auto-dialing mode) and **manual dialing** mode. The backend already has partial AMD infrastructure for the power dialer; this feature extends it to be configurable and to cover manual calls as well.

## Glossary

- **AMD**: Answering Machine Detection — Twilio's capability to detect whether a call was answered by a human or a machine/voicemail system.
- **CallSettings**: The per-system-setting configuration record (`call_settings` table) that stores dialer behavior options such as recordings, number of lines, and ring time.
- **Power Dialer**: The simultaneous auto-dialing mode (`addLeadsToQueue` / `processQueue` flow) that dials multiple contacts concurrently.
- **Manual Dialing**: The browser-initiated single-call mode triggered via `startCalling` / `startCall` in the Twilio provider.
- **Skip-on-Machine**: The behavior of hanging up immediately when AMD detects a machine, then advancing to the next contact in the queue.
- **Voicemail Drop**: The existing behavior of playing an `answeringMachineRecording` URL when AMD detects a machine.
- **AMD Webhook**: The `handleAmdStatus` endpoint (`/api/calling/webhooks/amd-status`) that Twilio calls asynchronously with the AMD result.
- **System_Setting**: The top-level settings record per user/organization that links to `CallSettings`, `regulatorySetting`, and other sub-settings.
- **Agent**: A user with the AGENT role who makes calls.
- **Admin**: A user with the ADMIN role who configures system settings.

---

## Requirements

### Requirement 1: AMD Toggle Field in Call Settings Data Model

**User Story:** As an Admin, I want a voicemail detection toggle stored in the call settings, so that the dialer behavior can be configured per settings profile.

#### Acceptance Criteria

1. THE `CallSettings` Prisma model SHALL include a boolean field `amdEnabled` with a default value of `false`.
2. WHEN a new `CallSettings` record is created without specifying `amdEnabled`, THE System SHALL persist `amdEnabled` as `false` in the `call_settings` table.
3. WHEN the Settings_API receives a GET request for call settings, THE response payload SHALL include the `amdEnabled` field with its current boolean value.
4. WHEN the Settings_API receives a valid update request containing `amdEnabled: true` or `amdEnabled: false`, THE System SHALL persist the new value to the `call_settings` table and return the updated record in the response.
5. WHEN the Settings_API receives a create or update request containing `amdEnabled` with a non-boolean value (e.g., a string or number), THE API SHALL return HTTP 400 with a validation error message specifying that `amdEnabled` must be a boolean.
6. WHEN the Settings_API receives a create or update request that omits `amdEnabled`, THE System SHALL treat the field as optional and SHALL NOT modify the existing value (or SHALL default to `false` on create).
7. IF the database write for `amdEnabled` fails during an update, THEN THE Settings_API SHALL return HTTP 500, SHALL NOT partially update the record, and SHALL log the database error with the affected `CallSettings` ID.

---

### Requirement 2: AMD Toggle UI in Call Settings

**User Story:** As an Admin, I want a toggle switch for "Voicemail Detection (Skip on Machine)" in the Create/Edit Call Settings form, so that I can enable or disable AMD skip behavior without leaving the settings page.

#### Acceptance Criteria

1. THE Settings_Form SHALL display a toggle switch labeled "Voicemail Detection (Skip on Machine)" in the General Communication section of the Call Settings form, with the toggle in the unchecked (OFF) state by default when creating a new record.
2. WHEN the toggle is switched ON, THE toggle element SHALL be in the checked state and the save payload SHALL include `amdEnabled: true`.
3. WHEN the toggle is switched OFF, THE toggle element SHALL be in the unchecked state and the save payload SHALL include `amdEnabled: false`.
4. WHEN an existing `CallSettings` record is loaded for editing, THE Settings_Form SHALL set the toggle to the checked state if `amdEnabled` is `true`, and to the unchecked state if `amdEnabled` is `false`.
5. THE Settings_Form SHALL display a descriptive hint beneath the toggle: "When enabled, calls answered by a machine will be skipped and the dialer will move to the next contact."
6. IF `amdEnabled` is `true` and no `answeringMachineRecording` is selected in the form, THEN THE Settings_Form SHALL display an informational note: "Voicemail drop is disabled. Machine-answered calls will be skipped automatically."

---

### Requirement 3: Power Dialer — Skip on Machine When AMD Toggle is ON

**User Story:** As an Agent, I want the power dialer to automatically skip to the next contact when a machine is detected and the AMD toggle is on, so that I only spend time on live human answers.

#### Acceptance Criteria

1. WHEN `amdEnabled` is `true` in the active `CallSettings` and the AMD webhook receives an `AnsweredBy` value indicating a machine (one of: `machine_start`, `machine_end_beep`, `machine_end_silence`, `machine_end_other`, `fax`), THE AMD_Webhook SHALL call `userClient.calls(CallSid).update({ status: 'completed' })` to hang up the call without playing any voicemail recording.
2. WHEN `amdEnabled` is `true` and a machine is detected, THE AMD_Webhook SHALL remove the call's SID from `dialerService.activeCalls`, update the lead's status to `"MACHINE"` in the database, and then call `dialerService.processQueue(userId)` to dial the next lead — in that order.
3. WHEN `amdEnabled` is `false` and a machine is detected and an `answeringMachineRecording` URL is configured, THE AMD_Webhook SHALL update the call with TwiML `<Response><Play>{url}</Play><Hangup/></Response>` (existing behavior preserved).
4. WHEN `amdEnabled` is `false` and a machine is detected and no `answeringMachineRecording` URL is configured, THE AMD_Webhook SHALL call `userClient.calls(CallSid).update({ status: 'completed' })` to hang up without playing any recording (existing behavior preserved).
5. WHEN `amdEnabled` is `true` and the AMD webhook receives `AnsweredBy: "human"` or `AnsweredBy: "unknown"`, THE AMD_Webhook SHALL respond with HTTP 200 and SHALL NOT modify the call in any way.
6. THE `makeCall` function SHALL fetch `amdEnabled` from `CallSettings` before initiating the Twilio call. IF `amdEnabled` is absent or `null` in the fetched settings, THE `makeCall` function SHALL treat it as `false`.
7. WHEN `amdEnabled` is `true`, THE `makeCall` function SHALL include `machineDetection: "DetectMessageEnd"`, `asyncAmd: "true"`, and `asyncAmdStatusCallback` pointing to `/api/calling/webhooks/amd-status` in the Twilio call parameters.
8. WHEN the AMD webhook receives the `amdEnabled` query parameter as the string `"true"`, THE AMD_Webhook SHALL parse it as boolean `true`. WHEN it receives `"false"` or any other string, THE AMD_Webhook SHALL parse it as boolean `false`.

---

### Requirement 4: Manual Dialing — AMD Support When Toggle is ON

**User Story:** As an Agent, I want manual calls to also use AMD when the voicemail detection toggle is on, so that machine-answered calls are handled consistently regardless of dialing mode.

#### Acceptance Criteria

1. WHEN `amdEnabled` is `true` in the active `CallSettings` and a manual call is initiated via `startCalling`, THE Calling_Service SHALL include `machineDetection: "DetectMessageEnd"`, `asyncAmd: "true"`, and `asyncAmdStatusCallback: "{BACKEND_URL}/api/calling/webhooks/amd-status?agentId={agentId}&amdEnabled=true"` in the Twilio call parameters.
2. WHEN `amdEnabled` is `false` and a manual call is initiated via `startCalling`, THE Calling_Service SHALL NOT include `machineDetection`, `asyncAmd`, or `asyncAmdStatusCallback` in the Twilio call parameters (existing behavior preserved).
3. WHEN `amdEnabled` is `true` and the AMD webhook receives a machine `AnsweredBy` value for a manual call, THE AMD_Webhook SHALL call `userClient.calls(CallSid).update({ status: 'completed' })` within 2 seconds of receiving the webhook, and the call's Twilio status SHALL transition to `completed`.
4. WHEN `amdEnabled` is `true` and the AMD webhook receives `AnsweredBy: "human"` or `AnsweredBy: "unknown"` for a manual call, THE AMD_Webhook SHALL respond with HTTP 200 and SHALL NOT issue any Twilio API call to modify the call.
5. WHEN a manual call is initiated via `startCalling`, THE `startCalling` endpoint SHALL fetch the caller's active `CallSettings` (via `system_Setting` linked to the agent's userId) to read `amdEnabled` before constructing the Twilio call parameters.
6. IF the `CallSettings` fetch in `startCalling` fails (database error or no settings record found), THEN THE `startCalling` endpoint SHALL proceed with `amdEnabled` defaulting to `false`, log a warning with the userId and error details, and SHALL NOT return an error to the caller.

---

### Requirement 5: AMD Toggle State Passed to Dialer Session

**User Story:** As an Agent, I want the AMD toggle state from my call settings to be automatically applied when I start a dialing session, so that I don't have to configure it separately each time.

#### Acceptance Criteria

1. WHEN the Settings_API returns call settings for session initialization, THE response payload SHALL include the `amdEnabled` field. IF `amdEnabled` is absent from the database record, THE API SHALL return `amdEnabled: false` in the response.
2. WHEN the Frontend_Dialer receives the settings response and `amdEnabled` is present and `true`, THE Frontend_Dialer SHALL include `amdEnabled: true` in the payload sent to `POST /calling/leads` (power dialer) or pass it as context for `startCalling` (manual dialing). IF `amdEnabled` is absent from the response, THE Frontend_Dialer SHALL treat it as `false`.
3. WHEN `amdEnabled` is updated in settings and the save is confirmed (Settings_API returns HTTP 200), THE new value SHALL apply to the next dialing session started after that confirmation. Sessions already in progress SHALL NOT be affected.
4. WHILE a dialing session is active (i.e., `isAutoDialing` is `true` or `isCalling` is `true`), THE Dialer_Service SHALL use the `amdEnabled` value captured at session start and SHALL NOT re-fetch `CallSettings` mid-session.
5. WHILE a dialing session is active, THE Settings_Form SHALL render the `amdEnabled` toggle in a disabled state and SHALL display the tooltip: "Cannot change voicemail detection while a session is active."

---

### Requirement 6: Lead Status and Audit Trail for Skipped Machine Calls

**User Story:** As an Admin, I want machine-detected skipped calls to be recorded with a clear disposition, so that I can audit which contacts were skipped due to AMD.

#### Acceptance Criteria

1. WHEN a call is skipped due to AMD detection with `amdEnabled: true`, THE AMD_Webhook SHALL atomically update the `CallRecord` with `disposition: "MACHINE"` and `status: "machine-detected"`, AND update the associated `Lead` record with `status: "MACHINE"` — both updates SHALL be attempted before `processQueue` is called.
2. WHEN a call is skipped due to AMD detection, THE `CallRecord` update SHALL include `endTime` set to the timestamp of the AMD webhook receipt and `duration` calculated as `Math.floor((endTime - startTime) / 1000)` in seconds.
3. WHEN calculating `duration` for a machine-detected call and the `CallRecord.startTime` is `null`, THE AMD_Webhook SHALL set `duration` to `0` and SHALL log a warning with the `CallSid`.
4. IF the `CallRecord` for a machine-detected call does not exist in the database, THEN THE AMD_Webhook SHALL log a warning including the `CallSid` and SHALL proceed with hanging up the call and calling `processQueue` without throwing an error.

---

### Requirement 7: Graceful Degradation and Error Handling

**User Story:** As an Agent, I want the dialer to continue operating normally if AMD detection fails or returns an unexpected result, so that a Twilio error does not stall the entire dialing session.

#### Acceptance Criteria

1. IF the AMD webhook receives an `AnsweredBy` value that is not one of the recognized machine values (`machine_start`, `machine_end_beep`, `machine_end_silence`, `machine_end_other`, `fax`) and not one of the recognized human values (`human`, `unknown`), THEN THE AMD_Webhook SHALL treat the call as human-answered, SHALL NOT modify the call, and SHALL log the unrecognized value with the `CallSid`.
2. IF the Twilio API call to hang up a machine-detected call throws an error, THEN THE AMD_Webhook SHALL log the error with the `CallSid`, SHALL attempt to update the `CallRecord` with `status: "hangup-failed"` for manual cleanup, and SHALL respond with HTTP 200 to Twilio to prevent webhook retries.
3. IF fetching `CallSettings` to determine `amdEnabled` fails during `makeCall` (database error), THEN THE Dialer_Service SHALL log the error with the `leadId` and `userId`, SHALL update the lead's status to `"FAILED"` in the database, and SHALL NOT initiate the Twilio call for that lead.
4. IF `amdEnabled` is `true` and the Twilio call creation returns an error code indicating that `machineDetection` is not supported for the destination number type, THEN THE Dialer_Service SHALL log a warning with the `leadId` and phone number, and SHALL retry the call without the `machineDetection` and `asyncAmd` parameters.
5. IF the AMD webhook is called for a `CallSid` that has no corresponding `CallRecord` in the database, THEN THE AMD_Webhook SHALL determine the skip-or-drop action using the `amdEnabled` query parameter from the original session, SHALL execute that action, and SHALL respond with HTTP 200.
