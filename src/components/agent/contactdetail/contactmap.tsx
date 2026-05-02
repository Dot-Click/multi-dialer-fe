import { useAppSelector } from '@/store/hooks';
import { Map as MapIcon, Eye } from "lucide-react";

const ContactMap = () => {
    const { currentContact } = useAppSelector((state) => state.contacts);
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!currentContact || !apiKey) return null;

    const address = `${currentContact.address || ''} ${currentContact.city || ''} ${currentContact.state || ''} ${currentContact.zip || ''}`.trim();

    if (!address) {
        return (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-50 dark:bg-slate-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-700">
                <MapIcon className="text-gray-400 mb-2" size={32} />
                <p className="text-sm text-gray-500">No address available for this contact</p>
            </div>
        );
    }

    const encodedAddress = encodeURIComponent(address);

    return (
        <div className="flex flex-col gap-6 h-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[500px]">
                {/* Map View */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 px-1">
                        <MapIcon size={16} className="text-yellow-500" />
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Map View</h4>
                    </div>
                    <div className="flex-1 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700 shadow-sm">
                        <iframe
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodedAddress}`}
                        ></iframe>
                    </div>
                </div>

                {/* Street View */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 px-1">
                        <Eye size={16} className="text-blue-500" />
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Street Look</h4>
                    </div>
                    <div className="flex-1 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700 shadow-sm">
                        <iframe
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            src={`https://www.google.com/maps/embed/v1/streetview?key=${apiKey}&location=${encodedAddress}`}
                        ></iframe>
                    </div>
                </div>
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/20 flex justify-between items-center">
                <p className="text-xs text-blue-600 dark:text-blue-400 leading-relaxed">
                    Showing interactive views for: <span className="font-bold">{address}</span>
                </p>
                <div className="flex gap-2">
                    <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-[10px] font-bold rounded-full uppercase">Maps Embed API Active</span>
                </div>
            </div>
        </div>
    );
};

export default ContactMap;
