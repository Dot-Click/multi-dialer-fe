import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { IoFilter } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import AllContactComponent from "@/components/agent/contact/allcontact";
import FilterModal from "@/components/modal/filtercontactmodal";
import ManageColumnsModal from "@/components/modal/managecolumnmodal";
import callIcon from "../../assets/callsicon.png";
import managecolicon from "../../assets/managecolicon.png";
import CreateCallSettingModal from "@/components/admin/systemsettings/CreateCallSettingModal";
import toast from "react-hot-toast";

type OutletContextType = {
  activeItem: { type: string; id?: string; name: string };
};

const AllContact = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showColumnsModal, setShowColumnsModal] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<any[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(["Name", "Email", "Phone", "Last Dialed"]);
  const [isDialSettingOpen, setIsDialSettingOpen] = useState(false);

  const { activeItem } = useOutletContext<OutletContextType>();

  const getBreadcrumb = () => {
    if (activeItem.type === "allContacts") return "";
    if (activeItem.type === "list") return "Calling Lists · " + activeItem.name;
    if (activeItem.type === "group") return "Groups · " + activeItem.name;
    if (activeItem.type === "folder") return "Calling Lists · " + activeItem.name;
    return "";
  };

  const renderHeading = () => {
    if (activeItem.type === "allContacts") return "Data & Dialer";
    return activeItem.name;
  };

  return (
    <section className="pr-7 flex flex-col gap-3 min-h-screen px-4 sm:px-6 md:px-10 py-4 lg:py-1 lg:px-3 transition-all">

      {/* Breadcrumb + Heading */}
      <div className="flex flex-col">
        {getBreadcrumb() && (
          <span className="text-[11px] text-[#6c757d] dark:text-slate-400 font-bold uppercase tracking-wider mb-1">
            {getBreadcrumb()}
          </span>
        )}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <h1 className="text-[20px] sm:text-[24px] font-bold text-[#0E1011] dark:text-white tracking-tight">
            {renderHeading()}
          </h1>

          {/* Manage Columns button */}
          <div
            className="flex gap-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md cursor-pointer px-3 py-1.5 items-center justify-center bg-transparent transition-colors"
            onClick={() => setShowColumnsModal(true)}
          >
            <img
              src={managecolicon}
              className="w-[16px] h-[14px] object-contain dark:invert dark:opacity-70"
              alt="managecolicon"
            />
            <span className="text-[13px] font-bold text-[#495057] dark:text-slate-300 uppercase tracking-wide">
              Manage Columns
            </span>
          </div>
        </div>
      </div>

      {/* Search + Filter + Dial button */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 w-full">

        {/* Search + Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="bg-white dark:bg-slate-800 flex items-center justify-between w-full sm:w-[40vw] rounded-full border border-[#D8DCE1] dark:border-slate-600 py-2.5 px-6">
            <input
              type="search"
              placeholder="Search by name, email, phone number..."
              className="w-full bg-transparent placeholder:text-sm font-normal text-[#495057] dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 text-sm outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <IoIosSearch className="text-2xl text-gray-500 dark:text-slate-400 shrink-0" />
          </div>

          <button
            onClick={() => setIsFilterOpen(true)}
            className="bg-[#2B3034] dark:bg-slate-700 hover:bg-[#3a4045]  dark:hover:bg-slate-600 text-xl text-white p-2 rounded-full shrink-0 transition-colors"
          >
            <IoFilter />
          </button>
        </div>

        {/* Dial Button */}
        <button
          onClick={() => {
            if (selectedContacts.length > 0) {
              setIsDialSettingOpen(true);
            } else {
              toast.error("Please select at least one contact to start dialing.");
            }
          }}
          className={`flex gap-2 justify-center items-center bg-[#FFCA06] rounded-full px-5 py-2 text-xs sm:text-sm font-bold text-[#2B3034] shadow-sm hover:bg-[#ffcf29] transition-all active:scale-95`}
        >              
          <img
            src={callIcon}
            className="w-[12px] h-[16px] object-contain"
            alt="callIcon"
          />
          <span className="text-black font-bold text-xs uppercase tracking-wider">
            Dial Selected ({selectedContacts.length})
          </span>
        </button>
      </div>

      {/* Table / Contact List */}
      <div className="flex-1 ml-0 sm:-ml-10 mt-2">
        <AllContactComponent
          onSelectionChange={setSelectedContacts}
          listId={activeItem.type === "list" ? activeItem.id : undefined}
          visibleColumns={visibleColumns}
          searchTerm={searchTerm}
        />
      </div>

      {/* Modals */}
      {isFilterOpen && <FilterModal onClose={() => setIsFilterOpen(false)} />}
      {showColumnsModal && (
        <ManageColumnsModal
          onClose={() => setShowColumnsModal(false)}
          initialDisplayColumns={visibleColumns}
          onApply={(columns) => {
            setVisibleColumns(columns);
            setShowColumnsModal(false);
          }}
        />
      )}
      <CreateCallSettingModal
        isOpen={isDialSettingOpen}
        onClose={() => setIsDialSettingOpen(false)}
        selectedContacts={selectedContacts}
      />

    </section>
  );
};

export default AllContact;