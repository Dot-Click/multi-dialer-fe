import { useAppSelector } from "@/store/hooks";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Mic, 
  Volume2, 
  PhoneOff 
} from 'lucide-react';
import { useTwilio } from '@/providers/twilio.provider';

const CurrentCallDetails = () => {
  const { currentContact } = useAppSelector((state) => state.contacts);
  const { endCall, isCalling, toggleMute, toggleSpeaker, isMuted, isSpeakerOn } = useTwilio();

  if (!currentContact) {
    return (
      <div className="mx-4 md:mx-auto max-w-4xl bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center text-gray-500">
        Select a contact to start dialing
      </div>
    );
  }

  const primaryPhone = currentContact.phones?.find((p: any) => p.isPrimary)?.number || currentContact.phones?.[0]?.number || "No phone";
  const primaryEmail = currentContact.emails?.find((e: any) => e.isPrimary)?.email || currentContact.emails?.[0]?.email || "No email";
  const locationText = `${currentContact.city || ""}${currentContact.city && currentContact.state ? ", " : ""}${currentContact.state || ""}` || "No location";

  return (
    <div className="mx-4 md:mx-auto max-w-4xl bg-white rounded-xl border border-gray-100 shadow-sm p-6 sm:p-8 font-inter">
      {/* Top Section: Stacked on mobile, side-by-side on sm screens */}
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-6 sm:gap-4">
        
        {/* Contact Info: Centered on mobile, left-aligned on sm screens */}
        <div className="flex flex-col items-center sm:items-start space-y-4 w-full sm:w-auto">
          <h2 className="text-xl sm:text-[22px] font-semibold text-[#343a40]">{currentContact.fullName || currentContact.name}</h2>
          
          <div className="space-y-2">
            <div className="flex items-center justify-center sm:justify-start gap-3 text-[#495057]">
              <Phone size={18} className="text-[#495057] shrink-0" />
              <span className="text-sm sm:text-[15px] font-medium">{primaryPhone}</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-3 text-[#495057]">
              <Mail size={18} className="text-[#495057] shrink-0" />
              <span className="text-sm sm:text-[15px] font-medium break-all">{primaryEmail}</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-3 text-[#495057]">
              <MapPin size={18} className="text-[#495057] shrink-0" />
              <span className="text-sm sm:text-[15px] font-medium">{locationText}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons: Prominent on all devices */}
        <div className="flex gap-3 shrink-0">
          {/* Mute Button */}
          <button 
            onClick={toggleMute}
            disabled={!isCalling}
            className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-xl border transition-colors shadow-sm ${
              !isCalling ? 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-50' :
              isMuted ? 'bg-red-50 border-red-200 text-red-600' : 
              'bg-white border-gray-300 text-black hover:bg-gray-50'
            }`}
          >
            <Mic size={20} />
          </button>
          
          {/* Speaker Button */}
          <button 
            onClick={toggleSpeaker}
            className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-xl transition-colors shadow-sm ${
              isSpeakerOn ? 'bg-[#FFCA06] text-[#0f1111]' : 'bg-[#0f1111] text-white hover:bg-gray-800'
            }`}
          >
            <Volume2 size={20} />
          </button>
          
          {/* End Call Button */}
          <button 
            onClick={() => endCall()}
            disabled={!isCalling}
            className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-xl transition-colors shadow-sm ${isCalling ? 'bg-[#d90404] hover:bg-red-700' : 'bg-gray-300 cursor-not-allowed'}`}
          >
            <PhoneOff size={20} className="text-white" />
          </button>
        </div>
      </div>

      {/* Horizontal Divider */}
      <div className="h-[1px] bg-gray-100 w-full my-6 sm:my-8"></div>

      {/* Stats Section: Responsive grid */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
        <div className="flex flex-col items-center">
          <span className="text-lg sm:text-[22px] font-semibold text-[#00c851] leading-none mb-2">00:00</span>
          <span className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-tight">Call Duration</span>
        </div>
        
        <div className="flex flex-col items-center border-x border-gray-100 px-2">
          <span className="text-lg sm:text-[22px] font-semibold text-[#343a40] leading-none mb-2">0</span>
          <span className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-tight">Calls Today</span>
        </div>
        
        <div className="flex flex-col items-center">
          <span className="text-lg sm:text-[22px] font-semibold text-[#343a40] leading-none mb-2">0</span>
          <span className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-tight">Connected</span>
        </div>
      </div>
    </div>
  );
};

export default CurrentCallDetails;