import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Device, Call } from '@twilio/voice-sdk';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

interface TwilioContextType {
  device: Device | null;
  activeCall: Call | null;
  isCalling: boolean;
  appStatus: string;
  activeCallSid: string | null;
  startCall: (phone: string, from: string) => Promise<void>;
  endCall: () => Promise<void>;
  isMuted: boolean;
  isSpeakerOn: boolean;
  toggleMute: () => void;
  toggleSpeaker: () => void;
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
  const [appStatus, setAppStatus] = useState('Initializing Agent...');
  const [activeCallSid, setActiveCallSid] = useState<string | null>(null);
  const [transcriptionLogs, setTranscriptionLogs] = useState<any[]>([]);
  const [identity, setIdentity] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callStatus, setCallStatus] = useState<'idle' | 'ringing' | 'connected' | 'on-hold' | 'disconnected'>('idle');
  const [duration, setDuration] = useState(0);

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
        codecPreferences: [Call.Codec.Opus, Call.Codec.PCMU],
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
        
        const sid = call.parameters.CallSid || (call as any).sid;
        setActiveCallSid(sid);
        console.log('Incoming call SID:', sid);
        
        call.on('ringing', () => {
          console.log('Call is ringing');
          setCallStatus('ringing');
        });

        call.on('accept', () => {
          console.log('Call accepted/connected');
          setCallStatus('connected');
        });

        call.on('disconnect', () => {
          console.log('Call disconnected');
          setCallStatus('disconnected');
          handleStopCalling();
        });

        // Initialize mute state for the new call
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
  }, []);

  useEffect(() => {
    setupDevice();
    return () => {
      if (device) {
        device.unregister();
        device.destroy();
      }
    };
  }, []);

  const handleStopCalling = useCallback(() => {
    setIsCalling(false);
    setAppStatus('Agent Ready');
    setActiveCall(null);
    setActiveCallSid(null);
    setIsMuted(false);
    setDuration(0);
    // Removed setCallStatus('idle') to allow 'disconnected' to persist for the UI
    // Note: Speaker status usually persists across calls on the device level
  }, []);

  const startCall = async (phone: string, from: string) => {
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
          agentId: identity || 'tester_agent'
        }
      });
      
      if (call) {
        const sid = call.parameters.CallSid || (call as any).sid;
        setActiveCallSid(sid);
        console.log('Call initiated:', sid);
      } else {
        throw new Error('Call connection failed');
      }
    } catch (err: any) {
      console.error('Start Call Error:', err);
      handleStopCalling();  
      console.log()
      toast.error(`Failed to start call: ${err.message}`);
    }
  };

  const endCall = async () => {
    if (activeCall) {
      activeCall.disconnect();
    }
    
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
    
    // 1. SDK level mute (if call is active)
    if (activeCall) {
      console.log(`Setting call mute to: ${muted}`);
      activeCall.mute(muted);
    }

    // 2. Forceful Browser level mute via Device Audio
    if (device?.audio?.inputStream) {
      console.log(`Disabling inputStream tracks: ${muted}`);
      device.audio.inputStream.getAudioTracks().forEach(track => {
        track.enabled = !muted;
      });
    }

    // 3. Fallback: Search for any active media tracks in the browser and mute them
    // (This is a safety net in case Twilio is using a different internal stream)
    navigator.mediaDevices.enumerateDevices().then(() => {
        // We don't want to request new tracks, just find existing ones if possible
        // Actually, tracks are usually scoped to the stream they belong to.
        // We'll trust the device.audio.inputStream for now but add more logs.
    });

    setIsMuted(muted);
    toast.success(muted ? 'Microphone Muted' : 'Microphone Unmuted');
  }, [activeCall, device, isMuted]);

  const toggleSpeaker = useCallback(() => {
    const speakerOn = !isSpeakerOn;
    
    // 1. SDK level speaker management
    // Twilio SDK v2+ uses speakerDevices for output selection. 
    // Here we manage the local audio elements as a fallback for the "Dialer" muting.
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(el => {
      el.muted = !speakerOn;
      el.volume = speakerOn ? 1.0 : 0.0;
    });

    setIsSpeakerOn(speakerOn);
    toast.success(speakerOn ? 'Speaker ON' : 'Speaker OFF (Muted)');
  }, [isSpeakerOn]);

  const resetCallStatus = useCallback(() => {
    setCallStatus('idle');
  }, []);

  // Poll for transcriptions
  useEffect(() => {
    let pollInterval: any;
    if (isCalling) {
      pollInterval = setInterval(async () => {
        try {
          const { data } = await api.get('/calling/transcription-logs');
          if (data.success && data.data.logs) {
            setTranscriptionLogs(data.data.logs);
          }
        } catch (err) {
          console.error('Polling error:', err);
        }
      }, 9000);
    }
    return () => clearInterval(pollInterval);
  }, [isCalling]);

  // Duration Timer
  useEffect(() => {
    let timerInterval: any;
    if (callStatus === 'connected') {
      timerInterval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } else if (callStatus === 'idle' || callStatus === 'disconnected' || callStatus === 'ringing') {
      setDuration(0);
    }
    return () => clearInterval(timerInterval);
  }, [callStatus]);

  return (
    <TwilioContext.Provider value={{ 
      device, 
      activeCall, 
      isCalling, 
      appStatus, 
      activeCallSid, 
      startCall, 
      endCall,
      toggleMute,
      toggleSpeaker,
      isMuted,
      isSpeakerOn,
      transcriptionLogs,
      callStatus,
      duration,
      resetCallStatus
    }}>
      {children}
    </TwilioContext.Provider>
  );
};

export const useTwilio = () => {
  const context = useContext(TwilioContext);
  if (context === undefined) {
    throw new Error('useTwilio must be used within a TwilioProvider');
  }
  return context;
};
