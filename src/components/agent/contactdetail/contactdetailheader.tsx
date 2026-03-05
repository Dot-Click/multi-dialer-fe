import { useState } from "react";
import {
  MdKeyboardArrowDown,
  MdMoreVert,
} from "react-icons/md";
import {
  IoAddOutline,
  IoCloseOutline,
} from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { deleteContact, fetchContactFolders, fetchContactLists } from "@/store/slices/contactSlice";
import { downloadCSV } from "@/utils/csvDownload";
import toast from "react-hot-toast";
import AppointmentModal from "@/components/modal/appointmentmodal";
import TaskModal from "@/components/modal/taskmodal";
import CallBackModal from "@/components/modal/callbackmodal";
import TakeActionModal from "@/components/modal/takeactionmodal";

const ContactDetailHeader = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [isCallBackModalOpen, setCallBackModalOpen] = useState(false);
  const [isActionModalOpen, setActionModalOpen] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const actionMenuRef = useRef<HTMLDivElement>(null);

  const { currentContact, folders, lists } = useAppSelector((state) => state.contacts);

  // Fetch folders and lists if not already available
  useEffect(() => {
    if (folders.length === 0) dispatch(fetchContactFolders());
    if (lists.length === 0) dispatch(fetchContactLists());
  }, [dispatch, folders.length, lists.length]);

  // Handle click outside to close action menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setShowActionMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExport = () => {
    if (!currentContact) return;

    // Resolve Folder and List names
    const currentList = lists.find(l => l.contactIds.includes(currentContact.id));
    const currentFolder = currentList ? folders.find(f => f.listIds.includes(currentList.id)) : null;

    const fieldMapping = {
      "Name": "fullName",
      "Phones": "phones",
      "Emails": "emails",
      "Property Address": "propertyAddress",
      "Property City": "propertyCity",
      "Property State": "propertyState",
      "Property Zip": "propertyZip",
      "Mailing Address": "mailingAddress",
      "Mailing City": "mailingCity",
      "Mailing State": "mailingState",
      "Mailing Zip": "mailingZip",
      "Folder": "folder",
      "List": "list",
      "Tags": "tags",
      "Source": "source"
    };

    const allPhones = currentContact.phones?.map((p: any) => p.number).join("; ") || "-";
    const allEmails = currentContact.emails?.map((e: any) => e.email).join("; ") || "-";
    const allTags = currentContact.tags?.join("; ") || "-";

    const exportData = [{
      fullName: currentContact.fullName || "-",
      phones: allPhones,
      emails: allEmails,
      propertyAddress: currentContact.address || "-",
      propertyCity: currentContact.city || "-",
      propertyState: currentContact.state || "-",
      propertyZip: currentContact.zip || "-",
      mailingAddress: currentContact.mailingAddress || "-",
      mailingCity: currentContact.mailingCity || "-",
      mailingState: currentContact.mailingState || "-",
      mailingZip: currentContact.mailingZip || "-",
      folder: currentFolder?.name || "-",
      list: currentList?.name || "-",
      tags: allTags,
      source: currentContact.source || "-"
    }];

    downloadCSV(exportData, Object.keys(fieldMapping), fieldMapping, `Contact_${currentContact.fullName || 'Export'}.csv`);
    setShowActionMenu(false);
    toast.success("Contact exported successfully with all records");
  };

  const handleDelete = async () => {
    if (!currentContact) return;
    try {
      await dispatch(deleteContact(currentContact.id)).unwrap();
      toast.success("Contact deleted successfully");
      navigate("/agent/allcontact");
    } catch (error: any) {
      toast.error(error || "Failed to delete contact");
    }
    setShowActionMenu(false);
  };

  const handlePrint = () => {
    window.print();
    setShowActionMenu(false);
  };

  const handleEmail = () => {
    if (!currentContact) return;
    const email = currentContact.emails?.[0]?.email || prompt("Enter recipient email address:");
    if (!email) return;

    window.location.href = `mailto:${email}?subject=Contact Form: ${currentContact.fullName}&body=Name: ${currentContact.fullName}%0AEmail: ${email}`;
    setShowActionMenu(false);
    toast.success("Email client opened");
  };

  const headerLinks = [
    {
      id: 1,
      name: "Appointment",
      icon: <IoAddOutline />,
      onClick: () => setModalOpen(true),
    },
    {
      id: 2,
      name: "Task",
      icon: <IoAddOutline />,
      onClick: () => setTaskModalOpen(true),
    },
    {
      id: 3,
      name: "Call Back",
      icon: <IoAddOutline />,
      onClick: () => setCallBackModalOpen(true),
    },
  ];

  return (
    <>
      {/* HEADER */}
      <header className="shadow-sm bg-white flex items-center justify-between px-3 sm:px-5 md:px-6 w-full h-16">
        {/* LEFT SECTION */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          {/* Action button */}
          <div className="relative" ref={actionMenuRef}>
            <button
              onClick={() => setShowActionMenu(!showActionMenu)}
              className="flex items-center gap-1.5 sm:gap-2 py-[12px] pr-[17px] pl-[24px] rounded-[12px] bg-[#EBEDF0] hover:bg-gray-200 text-sm sm:text-[16px] font-medium text-[#0E1011]"
            >
              Action
              <MdKeyboardArrowDown className="text-lg" />
            </button>

            {showActionMenu && (
              <div className="absolute top-14 left-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 animate-fadeIn">
                <button
                  onClick={handleExport}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-[#0E1011]"
                >
                  Export
                </button>
                <button
                  onClick={() => {
                    setShowActionMenu(false);
                    toast("Move to DNC functionality is not implemented yet", { icon: "ℹ️" });
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-[#0E1011]"
                >
                  Move to DNC
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
                >
                  Delete Contact
                </button>
                <button
                  onClick={handlePrint}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-[#0E1011]"
                >
                  Print contact form
                </button>
                <button
                  onClick={handleEmail}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-[#0E1011]"
                >
                  Email contact form
                </button>
              </div>
            )}
          </div>

          {/* Take Action */}
          <button
            onClick={() => setActionModalOpen(true)}
            className="hidden sm:flex items-center gap-2 py-[12px] px-[24px] rounded-md bg-[#EBEDF0] hover:bg-gray-200 text-sm sm:text-[16px] font-medium text-[#0E1011]"
          >
            Take Action
          </button>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {headerLinks.map((btn) => (
              <button
                key={btn.id}
                onClick={btn.onClick}
                className="flex items-center gap-1.5 sm:gap-2 p-2 rounded-md hover:bg-gray-100 font-medium text-[#495057]"
              >
                <span className="text-lg">{btn.icon}</span>
                {btn.name}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="flex md:hidden items-center p-2 rounded-md bg-gray-100 hover:bg-gray-200"
          >
            <MdMoreVert className="text-xl text-gray-700" />
          </button>

          {/* Mobile Dropdown Menu */}
          {showMobileMenu && (
            <div className="absolute top-16 left-3 right-3 bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex flex-col z-50 animate-fadeIn">
              <button
                onClick={() => {
                  setActionModalOpen(true);
                  setShowMobileMenu(false);
                }}
                className="text-sm text-gray-800 px-3 py-2 rounded-md hover:bg-gray-100 text-left"
              >
                Take Action
              </button>
              {headerLinks.map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => {
                    btn.onClick();
                    setShowMobileMenu(false);
                  }}
                  className="text-sm text-gray-800 px-3 py-2 rounded-md hover:bg-gray-100 text-left flex items-center gap-2"
                >
                  {btn.icon}
                  {btn.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-1.5 sm:gap-2">

          <button className="border bg-gray-100 rounded-md p-1.5 sm:p-2 hover:bg-gray-200">
            <IoCloseOutline className="text-gray-700 text-lg" />
          </button>
        </div>
      </header>

      {/* MODALS */}
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        contactId={currentContact?.id}
      />
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        contactId={currentContact?.id}
      />
      <CallBackModal
        isOpen={isCallBackModalOpen}
        onClose={() => setCallBackModalOpen(false)}
        contactId={currentContact?.id}
      />
      <TakeActionModal
        isOpen={isActionModalOpen}
        onClose={() => setActionModalOpen(false)}
      />
    </>
  );
};

export default ContactDetailHeader;
