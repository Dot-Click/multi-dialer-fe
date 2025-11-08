
const HistoryContactInfo = () => {

    const history = [
        { id: 1, history: 'Wrong Number', date: "09/16/2025", time: "10:09:22 AM" },
        { id: 2, history: 'Not Interested', date: "09/16/2025", time: "10:09:22 AM" }
    ]

    return (
        <div className="w-full">
            <div className=" text-sm flex flex-col gap-6">

                {history.map((his) => (
                    <div className="flex w-fit items-center flex-col gap-2">
                        <div className="w-full bg-gray-200 text-center rounded-lg px-3 py-1.5 ">
                            <button className="font-medium">{his.history}</button>
                        </div>
                        <span className="flex text-xs gap-2 items-center">
                            <h1>{his.date}</h1>
                            <h1>{his.time}</h1>
                        </span>

                    </div>
                ))}
            </div>



        </div>
    );
};


export default HistoryContactInfo;
