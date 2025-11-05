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
    <section className="pr-7 bg-[#EBEDF0] flex flex-col gap-2 min-h-screen">
      <div className="flex flex-col">
        {getBreadcrumb() && (
          <span className="text-sm text-[#6c757d] font-[500]">
            {getBreadcrumb()}
          </span>
        )}
        <div className="flex justify-between items-center">
          <h1 className="text-[28px] font-[500]">{renderHeading()}</h1>

          <div
            className="flex gap-2 hover:bg-gray-200 rounded-md cursor-pointer px-2 py-1 items-center"
            onClick={() => setShowColumnsModal(true)}
          >
            <span>
              <GrSplits className="text-[17px] text-[#495057]" />
            </span>
            <span className="text-[16px] font-[500] text-[#495057]">
              Manage Columns
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-white flex gap-1 items-center justify-between w-[40vw] rounded-full border border-[#FFFFFF] py-1.5 px-5">
            <input
              type="search"
              placeholder="Search by name, email, phone number..."
              className="w-full placeholder:text-sm text-sm outline-none"
            />
            <span>
              <IoIosSearch className="text-2xl" />
            </span>
          </div>
          <button
            onClick={() => setIsFilterOpen(true)}
            className="bg-[#2B3034] cursor-pointer text-lg text-white p-2 rounded-full"
          >
            <IoFilter />
          </button>
        </div>

        <div className="flex gap-2 cursor-pointer justify-center bg-[#FFCA06] rounded-lg px-4 py-1.5 items-center">
          <span className="text-lg font-[500]">
            <MdOutlineCall />
          </span>
          <span className="text-[14px] font-[500]">Dial Selected (2)</span>
        </div>
      </div>

      <div className="flex-1 -ml-10">
        <AllContactComponent />
      </div>

      {isFilterOpen && <FilterModal onClose={() => setIsFilterOpen(false)} />}
      {showColumnsModal && (
        <ManageColumnsModal onClose={() => setShowColumnsModal(false)} />
      )}
    </section>
  );
};

export default AllContact;
