import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

// Sample data that mirrors the structure and content in the image
const timeSheetData = [
    {
        date: '18/06/2021',
        agent: 'Bertha Wiza',
        device: 'Web',
        logIn: '18/06/2021 09:13',
        logOut: '18/06/2021 09:13',
        timeLogged: '00:02:53',
    },
    {
        date: '29/10/2024',
        agent: 'Bertha Wiza',
        device: 'Web',
        logIn: '29/10/2024 15:36',
        logOut: '29/10/2024 15:36',
        timeLogged: '00:02:53',
    },
    {
        date: '2021/11/2013',
        agent: 'Bertha Wiza',
        device: 'Web',
        logIn: '2021/11/2013 20:01',
        logOut: '2021/11/2013 20:01',
        timeLogged: '00:02:53',
    },
    {
        date: '18/06/2021',
        agent: 'Bertha Wiza',
        device: 'Web',
        logIn: '18/06/2021 09:13',
        logOut: '18/06/2021 09:13',
        timeLogged: '00:02:53',
    },
    {
        date: '29/10/2024',
        agent: 'Bertha Wiza',
        device: 'Web',
        logIn: '29/10/2024 15:36',
        logOut: '29/10/2024 15:36',
        timeLogged: '00:02:53',
    },
    {
        date: '2021/11/2013',
        agent: 'Bertha Wiza',
        device: 'Web',
        logIn: '2021/11/2013 20:01',
        logOut: '2021/11/2013 20:01',
        timeLogged: '00:02:53',
    },
    {
        date: '18/06/2021',
        agent: 'Bertha Wiza',
        device: 'Web',
        logIn: '18/06/2021 09:13',
        logOut: '18/06/2021 09:13',
        timeLogged: '00:02:53',
    },
    {
        date: '29/10/2024',
        agent: 'Bertha Wiza',
        device: 'Web',
        logIn: '29/10/2024 15:36',
        logOut: '29/10/2024 15:36',
        timeLogged: '00:02:53',
    },
    {
        date: '2021/11/2013',
        agent: 'Bertha Wiza',
        device: 'Web',
        logIn: '2021/11/2013 20:01',
        logOut: '2021/11/2013 20:01',
        timeLogged: '00:02:53',
    },
    {
        date: '18/06/2021',
        agent: 'Bertha Wiza',
        device: 'Web',
        logIn: '18/06/2021 09:13',
        logOut: '18/06/2021 09:13',
        timeLogged: '00:02:53',
    },
];

const AgentTimeSheet = () => {
    return (
        <div className="py-4 px-3 min-h-screen flex flex-col gap-3">
            <div className="flex w-fit items-center justify-between gap-3 text-sm text-gray-600 border rounded-md px-3 py-2">
                <span><IoIosArrowBack className="text-sm" /></span>
                <span className="font-medium">All Dates</span>
                <span><IoIosArrowForward className="text-sm" /></span>
            </div>
            <div className=" bg-white overflow-hidden">
                <div className="overflow-auto custom-scrollbar">
                    <table className="w-full text-sm text-left text-gray-800">
                        <thead className=" bg-gray-200 border-b border-gray-200">
                            <tr>
                                <th scope="col" className="px-3 py-2 font-semibold text-gray-950">Date</th>
                                <th scope="col" className="px-3 py-2 font-semibold text-gray-950">Agent</th>
                                <th scope="col" className="px-3 py-2 font-semibold text-gray-950">Device</th>
                                <th scope="col" className="px-3 py-2 font-semibold text-gray-950">Log In Time</th>
                                <th scope="col" className="px-3 py-2 font-semibold text-gray-950">Log Out Time</th>
                                <th scope="col" className="px-3 py-2 font-semibold text-gray-950">Time Logged</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {timeSheetData.map((row, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-3 py-3 whitespace-nowrap">{row.date}</td>
                                    <td className="px-3 py-3 whitespace-nowrap font-semibold">{row.agent}</td>
                                    <td className="px-3 py-3 whitespace-nowrap">{row.device}</td>
                                    <td className="px-3 py-3 whitespace-nowrap">{row.logIn}</td>
                                    <td className="px-3 py-3 whitespace-nowrap">{row.logOut}</td>
                                    <td className="px-3 py-3 whitespace-nowrap">{row.timeLogged}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};

export default AgentTimeSheet;