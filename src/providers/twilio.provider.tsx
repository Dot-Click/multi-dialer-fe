import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { Device, Call } from '@twilio/voice-sdk';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

interface TwilioContextType {
  device: Device | null;
  activeCall: Call | null;
  isCalling: boolean;
  appStatus: string;
  activeCallSid: string | null;
  startCall: (phone: string, from: string, contactId: string) => Promise<void>;
  endCall: () => Promise<void>;
  isMuted: boolean;
  isSpeakerOn: boolean;
  isHold: boolean;
  toggleMute: () => void;
  toggleSpeaker: () => void;
  toggleHold: () => void;
  transcriptionLogs: any[];
  callStatus: 'idle' | 'ringing' | 'connected' | 'on-hold' | 'disconnected';
  duration: number;
  resetCallStatus: () => void;
}

const TwilioContext = createContext<TwilioContextType | undefined>(undefined);

export const TwilioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [device, setDevice] = useState<Device | null>(null);
  const [activeCall, setActiveCall] = useState<Call | null>(null);
  const [isCalling, setIsCalling] = useState(false);
  const[appStatus, setAppStatus] = useState('Initializing Agent...');
  const [activeCallSid, setActiveCallSid] = useState<string | null>(null);
  const [transcriptionLogs, setTranscriptionLogs] = useState<any[]>([]);
  const [identity, setIdentity] = useState<string | null>(null);
  const[isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isHold, setIsHold] = useState(false);
  const[callStatus, setCallStatus] = useState<'idle' | 'ringing' | 'connected' | 'on-hold' | 'disconnected'>('idle');
  const [duration, setDuration] = useState(0);
  const [customerCallSid, setCustomerCallSid] = useState<string | null>(null);

  const isHoldRef = useRef(false);
  
  // 🚨 NEW: Stores the EXACT Twilio Call Objects we intentionally drop for Hold
  const ignoredCallsRef = useRef<Set<Call>>(new Set());

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
    setAppStatus('Agent Ready');
    setActiveCall(null);
    setActiveCallSid(null);
    setCustomerCallSid(null); 
    setIsMuted(false);
    setIsHold(false);
    setDuration(0);
    holdAudio.pause();
    holdAudio.currentTime = 0;
    ignoredCallsRef.current.clear(); // Wipe the slate clean when the call genuinely ends
  }, [holdAudio]);

  const setupDevice = useCallback(async () => {
    try {
      setAppStatus('Fetching Token...');
      const { data } = await api.get('/calling/token');

      if (!data.success || !data.data.token) {
        throw new Error(data.message || 'Failed to fetch token');
      }

      const agentIdentity = data.data.identity || 'tester_agent';
      setIdentity(agentIdentity);
      console.log('Registered with identity:', agentIdentity);

      const newDevice = new Device(data.data.token, {
        codecPreferences:[Call.Codec.Opus, Call.Codec.PCMU],
      });

      newDevice.on('registered', () => {
        setAppStatus('Agent Ready');
      });

      newDevice.on('error', (error) => {
        console.error('Twilio Device Error:', error);
        setAppStatus(`Error: ${error.message}`);
      });

      newDevice.on('incoming', (call: Call) => {
        console.log('Incoming bridge connection');
        setActiveCall(call);

        const sid = call.parameters.CallSid || (call as any).sid || call.outboundConnectionId;
        setActiveCallSid(sid);
        console.log('Incoming call SID:', sid);

        call.on('ringing', () => setCallStatus('ringing'));
        call.on('accept', () => setCallStatus('connected'));

        call.on('disconnect', () => {
          // 🚨 Uses EXACT object reference equality - bulletproof against race conditions
          if (ignoredCallsRef.current.has(call)) {
            console.log('Disconnect safely ignored — this incoming leg was dropped to hold the customer.');
            return;
          }
          if (!isHoldRef.current) {
            setCallStatus('disconnected');
            handleStopCalling();
          }
        });

        // Add defensive cancel/error handlers for incoming calls too!
        call.on('cancel', () => {
          if (ignoredCallsRef.current.has(call)) return;
          if (!isHoldRef.current) {
            setCallStatus('disconnected');
            handleStopCalling();
          }
        });

        call.on('error', () => {
          if (ignoredCallsRef.current.has(call)) return;
          handleStopCalling();
        });

        call.mute(isMuted);
        call.accept();
        setAppStatus('Bridge Connected');
      });

      await newDevice.register();
      setDevice(newDevice);
    } catch (err: any) {
      console.error('Twilio Setup Error:', err);
      setAppStatus(`Setup Failed: ${err.message}`);
    }
  },[handleStopCalling, isMuted]);

  useEffect(() => {
    setupDevice();
    return () => {
      if (device) {
        device.unregister();
        device.destroy();
      }
    };
  },[]);

  const startCall = async (phone: string, from: string, contactId: string) => {
    if (isCalling) return;

    setIsCalling(true);
    setAppStatus('Dialing...');
    setCallStatus('ringing');
    setTranscriptionLogs([]);

    try {
      const call = await device!.connect({
        params: {
          To: phone,
          From: from,
          agentId: identity || 'tester_agent',
          contactId: contactId
        }
      });

      if (call) {
        setActiveCall(call);
        const sid = call.parameters.CallSid || (call as any).sid || call.outboundConnectionId;
        setActiveCallSid(sid);

        call.on('ringing', () => setCallStatus('ringing'));

        call.on('accept', () => {
          const finalSid = call.parameters.CallSid || (call as any).sid || call.outboundConnectionId;
          setActiveCallSid(finalSid);
        });

        call.on('disconnect', () => {
          if (ignoredCallsRef.current.has(call)) {
            console.log('Disconnect safely ignored — this outgoing leg was dropped to hold the customer.');
            return;
          }
          if (!isHoldRef.current) {
            setCallStatus('disconnected');
            handleStopCalling();
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

  const endCall = async () => {
    if (activeCall) activeCall.disconnect();
    if (activeCallSid) {
      try {
        await api.post('/calling/end-call', { callSid: activeCallSid });
      } catch (err) {
        console.error('End Call Server Error:', err);
      }
    }
    handleStopCalling();
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

  const toggleHold = useCallback(async () => {
    const newHoldStatus = !isHold;
    isHoldRef.current = newHoldStatus;

    // 🚨 We store the exact object reference to ignore it when Twilio kills it
    if (newHoldStatus && activeCall) {
      ignoredCallsRef.current.add(activeCall);
    }

    if (activeCall) activeCall.mute(newHoldStatus || isMuted);

    if (newHoldStatus) holdAudio.play().catch(console.error);
    else {
      holdAudio.pause();
      holdAudio.currentTime = 0;
    }

    if (activeCallSid) {
      try {
        const response = await api.post('/calling/toggle-hold', {
          callSid: activeCallSid,
          customerCallSid: customerCallSid,
          hold: newHoldStatus,
          agentIdentity: identity
        });

        if (response.data?.data?.customerLegSid) {
          setCustomerCallSid(response.data.data.customerLegSid);
        }
      } catch (err) {
        isHoldRef.current = !newHoldStatus; 
        
        // Remove from ignore list since it failed to hold
        if (newHoldStatus && activeCall) {
           ignoredCallsRef.current.delete(activeCall);
        }

        if (activeCall) activeCall.mute(isMuted);
        holdAudio.pause();
        holdAudio.currentTime = 0;
        toast.error('Failed to toggle hold');
        return;
      }
    }

    setIsHold(newHoldStatus);
    toast.success(newHoldStatus ? 'Call on Hold' : 'Call Resumed');
  },[activeCall, activeCallSid, customerCallSid, holdAudio, identity, isHold, isMuted]);

  const resetCallStatus = useCallback(() => setCallStatus('idle'),[]);

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
        } catch (err) { /* silent fail */ }
      }, 3000);
    }
    return () => clearInterval(statusInterval);
  }, [isCalling, callStatus, activeCallSid]);

  return (
    <TwilioContext.Provider value={{
      device, activeCall, isCalling, appStatus, activeCallSid,
      startCall, endCall, toggleMute, toggleSpeaker, toggleHold,
      isMuted, isSpeakerOn, isHold, transcriptionLogs, callStatus,
      duration, resetCallStatus
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