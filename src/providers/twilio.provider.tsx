import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { Device, Call } from '@twilio/voice-sdk';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
// import { useCallSettings } from '@/hooks/useSystemSettings';

interface TwilioContextType {
  device: Device | null;
  activeCall: Call | null;
  isCalling: boolean;
  appStatus: string;
  activeCallSid: string | null;
  startCall: (phone: string, from: string, contactId: string) => Promise<void>;
  endCall: (callSid?: string) => Promise<void>;
  isMuted: boolean;
  isSpeakerOn: boolean;
  isHold: boolean;
  toggleMute: () => void;
  toggleSpeaker: () => void;
  toggleHold: (customHoldUrl?: string) => Promise<void>;
  sendDtmf: (digit: string) => void;
  transcriptionLogs: any[];
  callStatus: 'idle' | 'ringing' | 'connected' | 'on-hold' | 'disconnected';
  callDisposition: string | null;
  duration: number;
  resetCallStatus: () => void;
  answeringMachineUrl: string | null;
  setAnsweringMachineUrl: (url: string | null) => void;
  dropVoicemail: () => Promise<void>;
  isDroppingingVoicemail: boolean;
  incomingContactId: string | null;
  incomingQueueCardId: string | null;
  isPostCall: boolean;
  setIsPostCall: (value: boolean) => void;
}

const TwilioContext = createContext<TwilioContextType | undefined>(undefined);

export const TwilioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [device, setDevice] = useState<Device | null>(null);
  const [activeCall, setActiveCall] = useState<Call | null>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [appStatus, setAppStatus] = useState('Initializing Agent...');
  const [activeCallSid, setActiveCallSid] = useState<string | null>(null);
  const [transcriptionLogs, setTranscriptionLogs] = useState<any[]>([]);
  const [identity, setIdentity] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isHold, setIsHold] = useState(false);
  const [callStatus, setCallStatus] = useState<'idle' | 'ringing' | 'connected' | 'on-hold' | 'disconnected'>('idle');
  const [callDisposition, setCallDisposition] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [customerCallSid, setCustomerCallSid] = useState<string | null>(null);
  const [answeringMachineUrl, setAnsweringMachineUrl] = useState<string | null>(null);
  const [isDroppingingVoicemail, setIsDroppingVoicemail] = useState(false);
  const [incomingContactId, setIncomingContactId] = useState<string | null>(null);
  const [incomingQueueCardId, setIncomingQueueCardId] = useState<string | null>(null);
  const [isPostCall, setIsPostCall] = useState(false);

  // 🚨 ALL REFS AT THE TOP LEVEL
  const isHoldRef = useRef(false);
  const ignoredCallsRef = useRef<Set<Call>>(new Set());
  const isHoldProcessing = useRef(false);
  // Tracks the most-recently-accepted call so stale disconnect handlers
  // from a superseded call do NOT wipe the state for the new active call.
  const activeCallRef = useRef<Call | null>(null);
  const deviceRef = useRef<Device | null>(null);

  useEffect(() => {
    isHoldRef.current = isHold;
  }, [isHold]);

  const [holdAudio] = useState(() => {
    const audio = new Audio('https://com.twilio.music.classical.s3.amazonaws.com/BusyStrings.mp3');
    audio.loop = true;
    return audio;
  });

  const handleStopCalling = useCallback(() => {
    setIsCalling(false);
    setCallStatus('disconnected');
    setAppStatus('Agent Ready');
    setActiveCall(null);
    setActiveCallSid(null);
    setCustomerCallSid(null);
    setIsMuted(false);
    setIsHold(false);
    setCallDisposition(null);
    setDuration(0);
    setIncomingContactId(null);
    setIncomingQueueCardId(null);
    activeCallRef.current = null;
    holdAudio.pause();
    holdAudio.currentTime = 0;
    ignoredCallsRef.current.clear();
  }, [holdAudio]);

  const handleCallDisconnected = useCallback(() => {
    // Enter post-call state instead of fully stopping
    setIsCalling(false);
    setCallStatus('disconnected');
    setAppStatus('Post-Call — Select Disposition');
    setActiveCall(null);
    setActiveCallSid(null);
    setCustomerCallSid(null);
    setIsMuted(false);
    setIsHold(false);
    setDuration(0);
    activeCallRef.current = null;
    holdAudio.pause();
    holdAudio.currentTime = 0;
    ignoredCallsRef.current.clear();
    // Enter post-call state — agent must apply disposition before moving on
    setIsPostCall(true);
  }, [holdAudio]);

  const fetchVoiceToken = useCallback(async () => {
    const { data } = await api.get('/calling/token');
    if (!data.success || !data.data.token) {
      throw new Error(data.message || 'Failed to fetch token');
    }

    return {
      token: data.data.token as string,
      identity: (data.data.identity || 'tester_agent') as string,
    };
  }, []);

  const refreshDeviceToken = useCallback(async (targetDevice: Device) => {
    try {
      const { token, identity: refreshedIdentity } = await fetchVoiceToken();
      targetDevice.updateToken(token);
      setIdentity(refreshedIdentity);
      console.log("[TwilioProvider] Device token refreshed for:", refreshedIdentity);
    } catch (err: any) {
      console.error("[TwilioProvider] Token refresh failed:", err);
      setAppStatus(`Token Refresh Failed: ${err.message}`);
    }
  }, [fetchVoiceToken]);

  const setupDevice = useCallback(async () => {
    try {
      // Clean up previous device if it exists to prevent leaks
      if (deviceRef.current) {
        console.log("[TwilioProvider] Cleaning up existing device before re-setup...");
        deviceRef.current.unregister();
        deviceRef.current.destroy();
        deviceRef.current = null;
      }

      setAppStatus('Fetching Token...');
      const { token, identity: agentIdentity } = await fetchVoiceToken();
      setIdentity(agentIdentity);

      const newDevice = new Device(token, {
        codecPreferences: [Call.Codec.Opus, Call.Codec.PCMU],
        allowIncomingWhileBusy: true,
        edge: ['ashburn', 'dublin', 'singapore', 'sydney', 'frankfurt', 'tokyo'],
      });

      newDevice.on('registered', () => {
        setAppStatus('Agent Ready');
        console.log("[TwilioProvider] Device registered successfully.");
        console.log("[TwilioProvider] I am registered as:", agentIdentity);
        console.log("[TwilioProvider] Device Status:", newDevice.state);
      });

      newDevice.on('error', (error) => {
        setAppStatus(`Error: ${error.message}`);
        console.error("[TwilioProvider] Device error:", error);
      });

      newDevice.on('tokenWillExpire', () => {
        refreshDeviceToken(newDevice);
      });

      newDevice.on('incoming', (call: Call) => {
        const sid = call.parameters.CallSid || (call as any).sid || call.outboundConnectionId;
        const isDialerBridge = call.customParameters?.get('dialerBridge') === 'true';

        console.log("==================================================");
        console.log("[TwilioProvider] INCOMING CALL DETECTED");
        console.log("[TwilioProvider] Call SID:", sid);
        console.log("[TwilioProvider] Is Dialer Bridge:", isDialerBridge);
        console.log("[TwilioProvider] Device Status:", newDevice.state);
        console.log("[TwilioProvider] Call Parameters:", JSON.stringify(call.parameters));
        console.log("[TwilioProvider] Custom Parameters:", JSON.stringify(Object.fromEntries((call as any).customParameters || [])));
        console.log("==================================================");

        // For power dialer bridge calls, always accept — even if there's a stale activeCall.
        // The bridge IS the agent's connection to the customer, it must never be rejected.
        if (activeCallRef.current && activeCallRef.current.status() !== 'closed') {
          if (!isDialerBridge) {
            // Genuine unexpected inbound while on a call — reject it
            console.log("[TwilioProvider] REJECTING: Already has an active call (not a dialer bridge):", activeCallRef.current.parameters.CallSid);
            call.reject();
            return;
          }
          // Dialer bridge: cleanly disconnect the stale call first so we don't block the accept
          console.log("[TwilioProvider] Dialer bridge arrived with stale activeCall — disconnecting stale call before accepting bridge.");
          try {
            // IMPORTANT: Mark as ignored so its 'disconnect' event doesn't trigger handleStopCalling
            ignoredCallsRef.current.add(activeCallRef.current);
            activeCallRef.current.disconnect();
          } catch (e) {
            console.warn("[TwilioProvider] Could not disconnect stale call:", e);
          }
          activeCallRef.current = null;
        }

        activeCallRef.current = call;
        setActiveCall(call);
        setActiveCallSid(sid);

        call.on('ringing', () => {
          if (activeCallRef.current !== call) return;
          setCallStatus('ringing');
        });
        call.on('accept', () => {
          if (activeCallRef.current !== call) return;
          setCallStatus('connected');
        });

        call.on('disconnect', () => {
          if (ignoredCallsRef.current.has(call)) return;
          if (activeCallRef.current !== call) return;
          if (!isHoldRef.current) {
            handleCallDisconnected();
          }
        });

        call.on('cancel', () => {
          if (ignoredCallsRef.current.has(call)) return;
          if (activeCallRef.current !== call) return;
          if (!isHoldRef.current) {
            setCallStatus('disconnected');
            handleStopCalling();
          }
        });

        call.on('error', () => {
          if (ignoredCallsRef.current.has(call)) return;
          if (activeCallRef.current !== call) return;
          handleStopCalling();
        });

        const contactIdParam = call.customParameters?.get('contactId');
        if (contactIdParam) {
           setIncomingContactId(contactIdParam);
        }
        const queueCardIdParam = call.customParameters?.get('queueCardId');
        if (queueCardIdParam) {
           setIncomingQueueCardId(queueCardIdParam);
        }

        call.mute(isMuted);
        call.on('sample', (sample) => {
          if (sample.localVolume > 0 || sample.remoteVolume > 0) {
             console.log(`[Twilio Audio] Energy detected - Local: ${sample.localVolume}, Remote: ${sample.remoteVolume}`);
          }
        });

        try {
          console.log("[TwilioProvider] Attempting setup for bridge call...");
          setAppStatus('Connecting...');
          
          // Slight delay to ensure SDK is fully ready for the accept()
          setTimeout(() => {
            console.log("[TwilioProvider] Auto-accepting incoming call...");
            call.accept();
            setAppStatus('Bridge Connected');
            setIsCalling(true);
            console.log("[TwilioProvider] call.accept() transition complete.");
          }, 400);

        } catch (e: any) {
          toast.error("Auto-answer failed: Please manually interact with the browser.");
          console.error("[TwilioProvider] Auto-answer failed:", e);
        }
      });

      await newDevice.register();
      deviceRef.current = newDevice;
      setDevice(newDevice);
    } catch (err: any) {
      setAppStatus(`Setup Failed: ${err.message}`);
      console.error("[TwilioProvider] setupDevice failed:", err);
    }
  }, [fetchVoiceToken, handleStopCalling, refreshDeviceToken]);

  useEffect(() => {
    setupDevice();
    return () => {
      if (deviceRef.current) {
        console.log("[TwilioProvider] Unmounting: destroying Twilio device...");
        deviceRef.current.unregister();
        deviceRef.current.destroy();
        deviceRef.current = null;
      }
    };
  }, [setupDevice]);

  const startCall = async (phone: string, from: string, contactId: string) => {
    if (isCalling) return;
    if (!deviceRef.current) {
      toast.error('Twilio device is not ready yet.');
      return;
    }

    setIsPostCall(false);
    setIsCalling(true);
    setAppStatus('Dialing...');
    setCallStatus('ringing');
    setTranscriptionLogs([]);


    try {
      const call = await deviceRef.current.connect({
        params: {
          To: phone,
          From: from,
          callerId: from,
          agentId: identity || 'tester_agent',
          contactId: contactId,
          answeringMachineUrl: answeringMachineUrl || '',
        }
      });

      if (call) {
        activeCallRef.current = call;
        setActiveCall(call);

        const syncRealCallSid = () => {
          const realSid = call.parameters?.CallSid;
          if (realSid?.startsWith('CA')) {
            setActiveCallSid(realSid);
          }
        };

        syncRealCallSid();

        call.on('ringing', () => {
          setCallStatus('ringing');
          syncRealCallSid();
        });

        call.on('accept', () => {
          syncRealCallSid();
        });

        call.on('disconnect', () => {
          if (ignoredCallsRef.current.has(call)) return;
          if (!isHoldRef.current) {
            handleCallDisconnected();
          }
        });

        call.on('cancel', () => {
          if (ignoredCallsRef.current.has(call)) return;
          if (!isHoldRef.current) {
            setCallStatus('disconnected');
            handleStopCalling();
          }
        });

        call.on('error', (error) => {
          if (ignoredCallsRef.current.has(call)) return;
          toast.error(`Call Error: ${error.message}`);
          handleStopCalling();
        });
      } else {
        throw new Error('Call connection failed');
      }
    } catch (err: any) {
      handleStopCalling();
      toast.error(`Failed to start call: ${err.message}`);
    }
  };

  const sendDtmf = useCallback((digit: string) => {
    if (activeCall && callStatus === 'connected') {
      try {
        activeCall.sendDigits(digit);
      } catch (e) {
        console.warn('[TwilioProvider] sendDigits failed:', e);
      }
    }
  }, [activeCall, callStatus]);

  const dropVoicemail = async () => {
    if (!activeCallSid || !answeringMachineUrl) {
      toast.error('No voicemail recording configured');
      return;
    }
    setIsDroppingVoicemail(true);
    try {
      await api.post('/calling/drop-voicemail', {
        callSid: activeCallSid,
        voicemailUrl: answeringMachineUrl,
      });
      toast.success('Voicemail dropped successfully');
      // End the call after dropping voicemail
      handleStopCalling();
    } catch (err: any) {
      toast.error('Failed to drop voicemail');
    } finally {
      setIsDroppingVoicemail(false);
    }
  };


  const endCall = async (callSid?: string) => {
    // If we're ending the currently active browser leg
    if (!callSid || callSid === activeCallSid) {
      if (activeCall) activeCall.disconnect();
    }

    const sidToDrop = callSid || activeCallSid || customerCallSid;
    if (sidToDrop) {
      try {
        await api.post('/calling/end-call', { callSid: sidToDrop });
      } catch (err) { }
    }

    // Only full stop if we are dropping the main active call
    if (!callSid || callSid === activeCallSid) {
      handleStopCalling();
    }
  };

  const toggleMute = useCallback(() => {
    const muted = !isMuted;
    if (activeCall) activeCall.mute(muted);

    if (device?.audio?.inputStream) {
      device.audio.inputStream.getAudioTracks().forEach(track => {
        track.enabled = !muted;
      });
    }
    setIsMuted(muted);
    toast.success(muted ? 'Microphone Muted' : 'Microphone Unmuted');
  }, [activeCall, device, isMuted]);

  const toggleSpeaker = useCallback(() => {
    const speakerOn = !isSpeakerOn;
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(el => {
      el.muted = !speakerOn;
      el.volume = speakerOn ? 1.0 : 0.0;
    });
    setIsSpeakerOn(speakerOn);
    toast.success(speakerOn ? 'Speaker ON' : 'Speaker OFF (Muted)');
  }, [isSpeakerOn]);

  const toggleHold = useCallback(async (customHoldUrl?: string) => {
    if (isHoldProcessing.current) {
      console.log("Hold request currently processing, please wait...");
      return;
    }

    isHoldProcessing.current = true;
    const newHoldStatus = !isHold;
    // Prevent race conditions: if we're going ON hold, set the ref immediately.
    // If we're RESUMING, keep the ref as 'true' to continue ignoring disconnects 
    // from the old leg until the transition is complete.
    if (newHoldStatus) {
      isHoldRef.current = true;
    }

    if (newHoldStatus && activeCall) {
      ignoredCallsRef.current.add(activeCall);
    }

    // SAFE MUTE (only when putting on hold)
    if (newHoldStatus && activeCall) {
      try {
        if (activeCall.status() !== 'closed') {
          activeCall.mute(true);
        }
      } catch (e) {
        console.warn("Mute ignored: Call not active");
      }
    }

    if (activeCallSid) {
      try {
        const response = await api.post('/calling/toggle-hold', {
          callSid: activeCallSid,
          customerCallSid: customerCallSid,
          hold: newHoldStatus,
          agentIdentity: identity,
          holdUrl: customHoldUrl
        });

        if (response.data?.data?.customerLegSid) {
          setCustomerCallSid(response.data.data.customerLegSid);
        }

        if (newHoldStatus) {
          if (activeCall) {
            try {
              if (activeCall.status() !== 'closed') {
                activeCall.disconnect();
              }
            } catch (e) {
              console.warn("Local disconnect failed safely", e);
            }
          }

          const defaultAudio = 'https://com.twilio.music.classical.s3.amazonaws.com/BusyStrings.mp3';
          const targetAudioSrc = customHoldUrl || defaultAudio;
          if (holdAudio.src !== targetAudioSrc) {
            holdAudio.src = targetAudioSrc;
          }
          holdAudio.play().catch(console.error);

          setIsHold(true);
          toast.success('Call on Hold');

        } else {
          holdAudio.pause();
          holdAudio.currentTime = 0;

          // Now that we've successfully called the backend to resume, 
          // we can allow future disconnects to be handled normally.
          isHoldRef.current = false;
          setIsHold(false);
          setCallStatus('connected');
          toast.success('Call Resumed');
        }

      } catch (err) {
        // Rollback on failure
        isHoldRef.current = isHold;
        if (newHoldStatus && activeCall) {
          ignoredCallsRef.current.delete(activeCall);
        }

        if (activeCall) {
          try {
            if (activeCall.status() !== 'closed') activeCall.mute(isMuted);
          } catch (e) { }
        }

        holdAudio.pause();
        holdAudio.currentTime = 0;
        toast.error('Failed to toggle hold');

        isHoldProcessing.current = false;
        return;
      }
    }

    setTimeout(() => {
      isHoldProcessing.current = false;
    }, 1200);

  }, [activeCall, activeCallSid, customerCallSid, holdAudio, identity, isHold, isMuted]);

  // const resetCallStatus = useCallback(() => setCallStatus('idle'), []);

  useEffect(() => {
    let pollInterval: any;
    if (isCalling) {
      pollInterval = setInterval(async () => {
        try {
          const { data } = await api.get('/calling/transcription-logs');
          if (data.success && data.data.logs) setTranscriptionLogs(data.data.logs);
        } catch (err) { /* silent fail */ }
      }, 9000);
    }
    return () => clearInterval(pollInterval);
  }, [isCalling]);

  useEffect(() => {
    let timerInterval: any;
    if (callStatus === 'connected') {
      timerInterval = setInterval(() => setDuration(prev => prev + 1), 1000);
    } else if (callStatus === 'idle' || callStatus === 'disconnected' || callStatus === 'ringing') {
      setDuration(0);
    }
    return () => clearInterval(timerInterval);
  }, [callStatus]);

  useEffect(() => {
    let statusInterval: any;
    if (isCalling && callStatus === 'ringing' && activeCallSid) {
      statusInterval = setInterval(async () => {
        try {
          const { data } = await api.get(`/calling/status/${activeCallSid}`);
          if (data.success && (data.data.status === 'in-progress' || data.data.status === 'answered')) {
            setCallStatus('connected');
          }
          if (data.success && data.data.disposition) {
            setCallDisposition(data.data.disposition);
          }
        } catch (err) { /* silent fail */ }
      }, 3000);
    }
    return () => clearInterval(statusInterval);
  }, [isCalling, callStatus, activeCallSid]);

  return (
    <TwilioContext.Provider value={{
      device, activeCall, isCalling, appStatus, activeCallSid,
      startCall, endCall, toggleMute, toggleSpeaker, toggleHold,
      sendDtmf,
      isMuted, isSpeakerOn, isHold, transcriptionLogs, callStatus,
      callDisposition,
      duration,
      resetCallStatus: () => setCallStatus('idle'),
      answeringMachineUrl,
      setAnsweringMachineUrl,
      dropVoicemail,
      isDroppingingVoicemail,
      incomingContactId,
      incomingQueueCardId,
      isPostCall,
      setIsPostCall
    }}>
      {children}
    </TwilioContext.Provider>
  );
};

export const useTwilio = () => {
  const context = useContext(TwilioContext);
  if (context === undefined) throw new Error('useTwilio must be used within a TwilioProvider');
  return context;
};
