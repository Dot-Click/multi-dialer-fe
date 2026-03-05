import { useState, useRef } from "react";
import FilterModal from "@/components/modal/filtercontactmodal";
import ManageColumnsModal from "@/components/modal/managecolumnmodal";
import AdminCreateContactComponent from "@/components/admin/contact/admincreatecontact";
import { useNavigate } from "react-router-dom";


const AdminCreateContact = () => {
    const navigate = useNavigate();
    const onSaveRef = useRef<(() => void) | null>(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [showColumnsModal, setShowColumnsModal] = useState(false);


    const handleSave = () => {
        onSaveRef.current?.();
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <section className="pr-7 flex flex-col gap-3 min-h-screen px-4 sm:px-6 md:px-7 py-2 lg:py-1 lg:px-3 transition-all">
            {/* 🔹 Breadcrumb + Heading */}
            <div className="flex flex-col">

                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <h1 className="text-[24px] sm:text-[28px] font-medium">
                        Create Contact
                    </h1>

                    {/* Manage Columns button */}
                    <div className="flex items-center gap-5">
                        <div
                            className="flex gap-2  px-3 py-2 items-center justify-center"
                        >

                            <button
                                onClick={handleCancel}
                                className="text-sm px-5 py-2 cursor-pointer rounded-md w-28 hover:bg-[#dde0e4] bg-[#EBEDF0] font-medium text-gray-950 transition-colors"
                            >
                                Cancel
                            </button>



                            <button
                                onClick={handleSave}
                                className="text-sm px-5 py-2 cursor-pointer rounded-md w-28 hover:bg-[#f7c205] bg-[#FFCA06] font-medium text-gray-950 transition-colors"
                            >
                                Save
                            </button>
                        </div>

                    </div>

                </div>
            </div>



            {/* 🔹 Table / Contact List */}
            <div className="flex-1  sm:-ml-10">
                <AdminCreateContactComponent onSaveRef={onSaveRef} />
            </div>

            {/* 🔹 Modals */}
            {isFilterOpen && <FilterModal onClose={() => setIsFilterOpen(false)} />}
            {showColumnsModal && (
                <ManageColumnsModal onClose={() => setShowColumnsModal(false)} />
            )}
        </section>
    );
};

export default AdminCreateContact;
