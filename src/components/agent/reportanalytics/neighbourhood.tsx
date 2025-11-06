import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

// Sample data that reflects the structure in the image provided
const listData = [
    {
        original: 'High-Value Leads',
        new: 'Renewals Q3',
        name: 'Kathryn Murphy',
        updated: '18/06/2021 09:13',
        deleted: '18/06/2021 09:13',
    },
    {
        original: '-',
        new: 'Renewals Q3',
        name: 'Robert Fox',
        updated: '29/10/2024 15:36',
        deleted: '29/10/2024 15:36',
    },
    {
        original: 'Renewals Q3',
        new: 'High-Value Leads',
        name: 'Annette Black',
        updated: '2021/11/2013 20:01',
        deleted: '2021/11/2013 20:01',
    },
    {
        original: 'Renewals Q3',
        new: 'High-Value Leads',
        name: 'Dianne Russell',
        updated: '10/06/2021 19:30',
        deleted: '10/06/2021 19:30',
    },
    {
        original: 'High-Value Leads',
        new: 'Renewals Q3',
        name: 'Kathryn Murphy',
        updated: '18/06/2021 09:13',
        deleted: '18/06/2021 09:13',
    },
    {
        original: '-',
        new: 'Renewals Q3',
        name: 'Robert Fox',
        updated: '29/10/2024 15:36',
        deleted: '29/10/2024 15:36',
    },
    {
        original: 'Renewals Q3',
        new: 'High-Value Leads',
        name: 'Annette Black',
        updated: '2021/11/2013 20:01',
        deleted: '2021/11/2013 20:01',
    },
    {
        original: 'Renewals Q3',
        new: 'High-Value Leads',
        name: 'Dianne Russell',
        updated: '10/06/2021 19:30',
        deleted: '10/06/2021 19:30',
    },
    {
        original: 'High-Value Leads',
        new: 'Renewals Q3',
        name: 'Kathryn Murphy',
        updated: '18/06/2021 09:13',
        deleted: '18/06/2021 09:13',
    },
    {
        original: '-',
        new: 'Renewals Q3',
        name: 'Robert Fox',
        updated: '29/10/2024 15:36',
        deleted: '29/10/2024 15:36',
    },
];

const Neighbourhood = () => {
    return (
        <div className="py-4 px-3 min-h-screen flex flex-col gap-3">
            <div className="flex w-fit items-center justify-between gap-3 text-sm text-gray-600 border rounded-md px-3 py-2">
                <span><IoIosArrowBack className="text-sm" /></span>
                <span className="font-medium">All Dates</span>
                <span><IoIosArrowForward className="text-sm" /></span>
            </div>
            <div className=" bg-white overflow-hidden">
                <div className="overflow-auto custom-scrollbar">
                    <table className="w-full text-sm text-left">
                        <thead className=" bg-gray-200 border-b border-gray-200">
                            <tr>
                                <th scope="col" className="px-3 py-2 font-semibold text-gray-950">
                                    Original List
                                </th>
                                <th scope="col" className="px-3 py-2 font-semibold text-gray-950">
                                    New
                                </th>
                                <th scope="col" className="px-3 py-2 font-semibold text-gray-950">
                                    Name
                                </th>
                                <th scope="col" className="px-3 py-2 font-semibold text-gray-950">
                                    Updated
                                </th>
                                <th scope="col" className="px-3 py-2 font-semibold text-gray-950">
                                    Deleted
                                </th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600">
                            {listData.map((item, index) => (
                                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="px-3 py-3 whitespace-nowrap">
                                        {item.original}
                                    </td>
                                    <td className="px-3 py-3 whitespace-nowrap">
                                        {item.new}
                                    </td>
                                    <td className="px-3 py-3 whitespace-nowrap">
                                        <a href="#" className="text-blue-600 hover:underline">
                                            {item.name}
                                        </a>
                                    </td>
                                    <td className="px-3 py-3 whitespace-nowrap">
                                        {item.updated}
                                    </td>
                                    <td className="px-3 py-3 whitespace-nowrap">
                                        {item.deleted}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};

export default Neighbourhood;