import { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { IoFilter } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import AllContactComponent from "@/components/agent/contact/allcontact";
import FilterModal from "@/components/modal/filtercontactmodal";
import ManageColumnsModal from "@/components/modal/managecolumnmodal";
import callIcon from "../../assets/callsicon.png"
import managecolicon from "../../assets/managecolicon.png"


type OutletContextType = {
  activeItem: { type: string; id?: string; name: string };
};

const AllContact = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showColumnsModal, setShowColumnsModal] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<any[]>([]);
  const navigate = useNavigate();

  // ✅ Use typed context
  const { activeItem } = useOutletContext<OutletContextType>();

  const getBreadcrumb = () => {
    if (activeItem.type === "allContacts") return "";
    if (activeItem.type === "list") {
      // Find parent folder for better breadcrumb if needed
      return "Calling Lists · " + activeItem.name;
    }
    if (activeItem.type === "group") {
      return "Groups · " + activeItem.name;
    }
    if (activeItem.type === "folder") {
      return "Calling Lists · " + activeItem.name;
    }
    return "";
  };

  const renderHeading = () => {
    if (activeItem.type === "allContacts") return "Data & Dialer";
    return activeItem.name;
  };

  return (
    <section className="pr-7 flex flex-col gap-3 min-h-screen px-4 sm:px-6 md:px-10 py-4 lg:py-1 lg:px-3 transition-all">
      {/* 🔹 Breadcrumb + Heading */}
      <div className="flex flex-col">
        {getBreadcrumb() && (
          <span className="text-sm text-[#6c757d] font-medium mb-1">
            {getBreadcrumb()}
          </span>
        )}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <h1 className="text-[24px] text-[#0E1011] sm:text-[28px] font-medium">
            {renderHeading()}
          </h1>

          {/* Manage Columns button */}
          <div
            className="flex gap-2 hover:bg-gray-200 rounded-md cursor-pointer px-3 py-2 items-center justify-centerbg-transparent"
            onClick={() => setShowColumnsModal(true)}
          >
            <img src={managecolicon} className='w-[20px] h-[16px] object-contain' alt="managecolicon" />

            <span className="text-[16px] font-medium text-[#495057] inline">
              Manage Columns
            </span>
          </div>
        </div>
      </div>

      {/* 🔹 Search + Filter + Dial button */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 w-full">
        {/* Search + Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="bg-white flex items-center justify-between w-full sm:w-[40vw] rounded-[1000000px] border border-[#D8DCE1] py-[12px] px-[24px]">
            <input
              type="search"
              placeholder="Search by name, email, phone number..."
              className="w-full placeholder:text-[16px] font-normal text-[#495057] text-[16px] outline-none"
            />
            <IoIosSearch className="text-2xl text-gray-600" />
          </div>

          <button
            onClick={() => setIsFilterOpen(true)}
            className="bg-[#2B3034] text-xl text-white p-2 rounded-full shrink-0"
          >
            <IoFilter />
          </button>
        </div>

        {/* Dial Button */}
        <button
          onClick={() => {
            if (selectedContacts.length > 0) {
              // Navigate to contact-info with the first selected contact
              navigate("/contact-info", {
                state: { contact: selectedContacts[0] }
              });
            }
          }}
          disabled={selectedContacts.length === 0}
          className={`flex gap-2 justify-center items-center bg-[#FFCA06] rounded-lg pr-[24px] pl-[20px] py-[8px] text-sm sm:text-base font-semibold text-[#2B3034] shadow-sm hover:bg-[#ffcf29] transition-all ${selectedContacts.length === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
          <img src={callIcon} className='w-[15.300321578979492px] h-[20.095260620117188px] object-contain' alt="callIcon" />

          <span className="text-[#000000] font-medium text-[16px]">
            Dial Selected ({selectedContacts.length})
          </span>
        </button>
      </div>

      {/* 🔹 Table / Contact List */}
      <div className="flex-1 ml-0 sm:-ml-10 mt-2">
        <AllContactComponent 
          onSelectionChange={setSelectedContacts} 
          listId={activeItem.type === 'list' ? activeItem.id : undefined}
        />
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






