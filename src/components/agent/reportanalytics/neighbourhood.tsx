import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

// Sample data
const listData = [
    { original: 'High-Value Leads', new: 'Renewals Q3', name: 'Kathryn Murphy', updated: '18/06/2021 09:13', deleted: '18/06/2021 09:13' },
    { original: '-', new: 'Renewals Q3', name: 'Robert Fox', updated: '29/10/2024 15:36', deleted: '29/10/2024 15:36' },
    { original: 'Renewals Q3', new: 'High-Value Leads', name: 'Annette Black', updated: '2021/11/2013 20:01', deleted: '2021/11/2013 20:01' },
    { original: 'Renewals Q3', new: 'High-Value Leads', name: 'Dianne Russell', updated: '10/06/2021 19:30', deleted: '10/06/2021 19:30' },
    { original: 'High-Value Leads', new: 'Renewals Q3', name: 'Kathryn Murphy', updated: '18/06/2021 09:13', deleted: '18/06/2021 09:13' },
    { original: '-', new: 'Renewals Q3', name: 'Robert Fox', updated: '29/10/2024 15:36', deleted: '29/10/2024 15:36' },
    { original: 'Renewals Q3', new: 'High-Value Leads', name: 'Annette Black', updated: '2021/11/2013 20:01', deleted: '2021/11/2013 20:01' },
    { original: 'Renewals Q3', new: 'High-Value Leads', name: 'Dianne Russell', updated: '10/06/2021 19:30', deleted: '10/06/2021 19:30' },
    { original: 'High-Value Leads', new: 'Renewals Q3', name: 'Kathryn Murphy', updated: '18/06/2021 09:13', deleted: '18/06/2021 09:13' },
    { original: '-', new: 'Renewals Q3', name: 'Robert Fox', updated: '29/10/2024 15:36', deleted: '29/10/2024 15:36' },
];

const Neighbourhood = () => {
    return (
        <div className="pb-4 px-3 min-h-screen flex flex-col gap-3">

            {/* Date Filter */}
            <div className="flex items-center w-fit gap-[16px] border border-[#D8DCE1] rounded-[12px] px-[16px] h-[40px] cursor-pointer">
                <IoIosArrowBack className="text-[13px] text-[#71717A]" />
                <span className="text-[16px]">All Dates</span>
                <IoIosArrowForward className="text-[13px] text-[#71717A]" />
            </div>

            {/* Table */}
            <div className="bg-white overflow-hidden">
                <div className="overflow-auto custom-scrollbar responsive-table-wrapper">
                    <table className="w-full text-[14px] text-left min-w-[600px] md:min-w-full">
                        <thead className="bg-[#F7F7F7] border-b border-[#EBEDF0]">
                            <tr>
                                <th className="px-3 py-2 font-[500] text-[#0E1011]">Original List</th>
                                <th className="px-3 py-2 font-[500] text-[#0E1011]">New</th>
                                <th className="px-3 py-2 font-[500] text-[#0E1011]">Name</th>
                                <th className="px-3 py-2 font-[500] text-[#0E1011]">Updated</th>
                                <th className="px-3 py-2 font-[500] text-[#0E1011]">Deleted</th>
                            </tr>
                        </thead>
                        <tbody className="text-[#495057] font-[400] text-[14px]">
                            {listData.map((item, index) => (
                                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="px-3 py-3 whitespace-nowrap">{item.original}</td>
                                    <td className="px-3 py-3 whitespace-nowrap">{item.new}</td>
                                    <td className="px-3 py-3 whitespace-nowrap">
                                        <a href="#" className="text-[#1D85F0] hover:underline">{item.name}</a>
                                    </td>
                                    <td className="px-3 py-3 whitespace-nowrap">{item.updated}</td>
                                    <td className="px-3 py-3 whitespace-nowrap">{item.deleted}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <style>
                {`
                    /* === MOBILE RESPONSIVE === */
                    @media (max-width: 768px) {
                        .responsive-table-wrapper {
                            overflow-x: auto; /* Horizontal scroll on mobile */
                        }
                        table {
                            min-width: 600px; /* Table scrollable if needed */
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default Neighbourhood;
