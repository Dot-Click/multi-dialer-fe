import { useDialerHealth } from "@/hooks/useWorkspace";
import { Loader2 } from "lucide-react";

const DialerHealth = () => {
    const { data: dialers, isLoading } = useDialerHealth();

    if (isLoading) {
        return (
            <section className='bg-white dark:bg-slate-800 flex flex-col h-fit lg:h-[75vh] items-center justify-center rounded-[32px] w-full'>
                <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
            </section>
        );
    }

    return (
        <section className='bg-white dark:bg-slate-800  flex flex-col h-fit lg:h-[75vh] gap-5 rounded-[32px] px-[24px] pt-[24px] pb-[32px]  w-full '>
            <div className="flex justify-between items-center">
                <h1 className="text-[20px] dark:text-white text-[#000000] font-medium">Dialer Health</h1>
            </div>

            <div className='flex flex-col gap-5  overflow-auto custom-scrollbar h-full'>
                {dialers && dialers.length > 0 ? (
                    dialers.map((dial) => {
                        let bgColor = "";
                        let textColor = "";

                        switch (dial.health) {
                            case "healthy":
                                bgColor = "bg-[#1EAC221A] dark:bg-green-500/20";
                                textColor = "text-[#0F7812] dark:text-green-500"
                                break;
                            case "unhealthy":
                                bgColor = "bg-[#D434351A] dark:bg-red-500/20";
                                textColor = "text-[#B00506] dark:text-red-500"
                                break;
                            default:
                                bgColor = "bg-gray-400";
                                textColor = "text-black";
                        }

                        return (
                            <div key={dial.id} className='flex mx-2 rounded-md border-b gap-2 items-center dark:border-slate-700 border-gray-100'>
                                <div className="flex justify-between w-full pr-3 items-center">
                                    <div>
                                        <h1 className="text-[16px] dark:text-white font-medium text-[#000000]">{dial.name}</h1>
                                        <h1 className="text-[14px] dark:text-gray-400 font-normal text-[#495057]">{dial.contact}</h1>
                                    </div>
                                    <div className={`rounded-[100px] text-center min-w-[85px] max-w-[100px] px-2 py-0.5 ${bgColor}`}>
                                        <span className={`text-[12px] font-medium capitalize ${textColor}`}>{dial.health}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        No recent activity
                    </div>
                )}
            </div>
        </section>
    );
};

export default DialerHealth;
