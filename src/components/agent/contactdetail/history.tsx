import { useAppSelector } from "@/store/hooks";
import dayjs from "dayjs";
import { FileAudio } from "lucide-react";

const History = () => {
    const { currentContact } = useAppSelector((state) => state.contacts);
    const { session, role } = useAppSelector((state) => state.auth);

    const allCallRecords = currentContact?.callRecords || [];

    // Filter logic based on role
    // If ADMIN/OWNER/SUPER_ADMIN, show everything
    // If AGENT, only show calls made by this agent
    const filteredRecords = (role === 'ADMIN' || role === 'OWNER' || role === 'SUPER_ADMIN')
        ? allCallRecords
        : allCallRecords.filter((record: any) => record.userId === session?.user?.id);

    return (
        <div className='flex gap-6 w-full flex-col md:flex-row min-h-40'>

            <div className="flex w-full md:w-[55%] flex-col gap-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-[#0E1011] text-[18px] font-medium">Call History:</h1>
                    {role === 'AGENT' && (
                        <span className="text-[12px] text-gray-500 bg-gray-100 px-2 py-1 rounded">Showing your calls only</span>
                    )}
                </div>

                <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2">
                    {filteredRecords.length > 0 ? (
                        filteredRecords.map((record: any) => (
                            <div key={record.id} className='flex items-start gap-2 justify-between border-b border-gray-100 pb-3'>
                                <div className='flex flex-col gap-1'>
                                    <h1 className='text-[#2B3034] text-[12px] font-medium'>
                                        {record.user?.fullName || "System"}
                                        <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] ${record.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {record.status}
                                        </span>
                                    </h1>
                                    <p className='text-[#0E1011] font-normal text-[14px]'>
                                        {record.disposition || "No disposition"}
                                        {record.duration ? ` • ${Math.floor(record.duration / 60)}m ${record.duration % 60}s` : ""}
                                    </p>
                                </div>
                                <div className='flex flex-col text-right'>
                                    <p className='text-[#495057] whitespace-nowrap text-[12px] font-normal'>
                                        {dayjs(record.startTime).format('MMM DD, YYYY')}
                                    </p>
                                    <p className='text-[#495057] whitespace-nowrap text-[12px] font-normal'>
                                        {dayjs(record.startTime).format('hh:mm A')}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                            <p className="text-sm">No call history found</p>
                        </div>
                    )}
                </div>
            </div>

            <div className='flex w-full md:w-[45%] gap-6 flex-col'>
                <h1 className='test-[#0E1011] text-[18px] font-medium'>Call Recordings:</h1>

                <div className='flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2'>
                    {filteredRecords.filter((r: any) => r.recordingUrl).length > 0 ? (
                        filteredRecords.filter((r: any) => r.recordingUrl).map((record: any) => (
                            <div key={record.id} className="bg-[#F8F9FA] p-4 rounded-xl border border-gray-100 flex flex-col gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                                        <FileAudio size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-[#0E1011]">
                                            Call by {record.user?.fullName || "Agent"}
                                        </p>
                                        <p className="text-[12px] text-gray-500">
                                            {dayjs(record.startTime).format('MMM DD, YYYY • hh:mm A')}
                                        </p>
                                    </div>
                                </div>
                                <audio controls className="w-full h-8 custom-audio-player">
                                    <source src={record.recordingUrl} type="audio/mpeg" />
                                    Your browser does not support the audio element.
                                </audio>
                            </div>
                        ))
                    ) : (
                        <div className='flex mt-10 gap-0.5 h-full items-center w-full flex-col'>
                            <h1 className='text-[#000000] text-[14px] font-medium'>No Data Available</h1>
                            <p className='text-[#848C94] text-[14px] font-normal'>There are no call recordings</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default History;