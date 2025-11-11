import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { GrSplits } from "react-icons/gr";
import { IoFilter } from "react-icons/io5";
import { MdOutlineCall } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import AllContactComponent from "@/components/agent/contact/allcontact";
import FilterModal from "@/components/modal/filtercontactmodal";
import ManageColumnsModal from "@/components/modal/managecolumnmodal";

// ✅ Define type for the Outlet context
type OutletContextType = {
  activeItem: string;
};

const AllContact = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showColumnsModal, setShowColumnsModal] = useState(false);

  // ✅ Use typed context
  const { activeItem } = useOutletContext<OutletContextType>();

  const getBreadcrumb = () => {
    if (activeItem === "allContacts") return "";
    if (activeItem.startsWith("List")) {
      if (["List 01", "List 02"].includes(activeItem))
        return "Folder 1 · " + activeItem;
      return "Folder 2 · " + activeItem;
    }
    if (activeItem.startsWith("group")) {
      return "Groups · " + activeItem;
    }
    if (activeItem.startsWith("Folder")) {
      return activeItem;
    }
    return "";
  };

  const renderHeading = () => {
    if (activeItem === "allContacts") return "Data & Dialer";
    return activeItem;
  };

  return (
    <section className="pr-7 flex flex-col gap-3 min-h-screen px-4 sm:px-6 md:px-10 py-4 lg:py-1 lg:px-3 transition-all">
      {/* 🔹 Breadcrumb + Heading */}
      <div className="flex flex-col">
        {getBreadcrumb() && (
          <span className="text-sm text-[#6c757d] font-[500] mb-1">
            {getBreadcrumb()}
          </span>
        )}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <h1 className="text-[24px] sm:text-[28px] font-[500]">
            {renderHeading()}
          </h1>

          {/* Manage Columns button */}
          <div
            className="flex gap-2 hover:bg-gray-200 rounded-md cursor-pointer px-3 py-2 items-center justify-centerbg-transparent"
            onClick={() => setShowColumnsModal(true)}
          >
            <GrSplits className="text-lg text-[#495057]" />
            <span className="text-base font-[500] text-[#495057]inline">
              Manage Columns
            </span>
          </div>
        </div>
      </div>

      {/* 🔹 Search + Filter + Dial button */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 w-full">
        {/* Search + Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="bg-white flex items-center justify-between w-full sm:w-[40vw] rounded-full border border-[#D8DCE1] py-1.5 px-4">
            <input
              type="search"
              placeholder="Search by name, email, phone number..."
              className="w-full placeholder:text-sm text-sm outline-none"
            />
            <IoIosSearch className="text-2xl text-gray-600" />
          </div>

          <button
            onClick={() => setIsFilterOpen(true)}
            className="bg-[#2B3034] text-lg text-white p-2 rounded-full flex-shrink-0"
          >
            <IoFilter />
          </button>
        </div>

        {/* Dial Button */}
        <button className="flex gap-2 justify-center items-center bg-[#FFCA06] rounded-lg px-4 py-2 text-sm sm:text-base font-[600] text-[#2B3034] shadow-sm hover:bg-[#ffcf29] transition-all">
          <MdOutlineCall className="text-lg" />
          <span>Dial Selected (2)</span>
        </button>
      </div>

      {/* 🔹 Table / Contact List */}
      <div className="flex-1 -ml-0 sm:-ml-10 mt-2">
        <AllContactComponent />
      </div>

      {/* 🔹 Modals */}
      {isFilterOpen && <FilterModal onClose={() => setIsFilterOpen(false)} />}
      {showColumnsModal && (
        <ManageColumnsModal onClose={() => setShowColumnsModal(false)} />
      )}
    </section>
  );
};

export default AllContact;
