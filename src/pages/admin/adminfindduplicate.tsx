import { useState } from "react";
import { GrSplits } from "react-icons/gr";
import mergeduplicates from "../../assets/mergeduplicates.png"
import FilterModal from "@/components/modal/filtercontactmodal";
import ManageColumnsModal from "@/components/modal/managecolumnmodal";
import FindDuplicates from "@/components/admin/contact/findduplicates";


import { useAppSelector } from "@/store/hooks";

const AdminFindDuplicate = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [showColumnsModal, setShowColumnsModal] = useState(false);
    const { duplicateContacts } = useAppSelector((state) => state.contacts);

    return (
        <section className="pr-7 flex flex-col gap-3 min-h-screen px-4 sm:px-6 md:px-10 py-4 lg:py-1 lg:px-3 transition-all">
            {/* 🔹 Breadcrumb + Heading */}
            <div className="flex flex-col">

                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <h1 className="text-[24px] sm:text-[28px] font-[500] dark:text-white">
                        Duplicates Found: {duplicateContacts.length}
                    </h1>

                    {/* Manage Columns button */}
                    <div className="flex items-center gap-5">
                        <div
                            className="flex gap-2 hover:bg-gray-200 rounded-md cursor-pointer px-3 py-2 items-center justify-centerbg-transparent"
                            onClick={() => setShowColumnsModal(true)}
                        >
                            <GrSplits className="text-base text-[#495057] dark:text-gray-300" />
                            <span className="text-sm font-[500] text-[#495057] dark:text-gray-300">
                                Manage Columns
                            </span>
                        </div>

                        <div
                            className="flex gap-2 hover:bg-gray-200 rounded-md cursor-pointer px-3 py-2 items-center justify-centerbg-transparent"
                            onClick={() => setShowColumnsModal(true)}
                        >
                            <button className="flex gap-2 justify-center items-center bg-[#FFCA06] rounded-lg px-4 py-2 text-sm sm:text-sm font-[600] text-[#2B3034] shadow-sm hover:bg-[#ffcf29] transition-all">
                                <img src={mergeduplicates} alt="mergeduplicates" className="w-4"/>
                                <span>Merge Duplicates</span>
                            </button>
                        </div>

                    </div>

                </div>
            </div>

           

            {/* 🔹 Table / Contact List */}
            <div className="flex-1  sm:-ml-10 mt-2">
                <FindDuplicates />
            </div>

            {/* 🔹 Modals */}
            {isFilterOpen && <FilterModal onClose={() => setIsFilterOpen(false)} />}
            {showColumnsModal && (
                <ManageColumnsModal onClose={() => setShowColumnsModal(false)} />
            )}
        </section>
    );
};

export default AdminFindDuplicate;