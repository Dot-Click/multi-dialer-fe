import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchContactFolders, fetchContactLists, assignContactToList } from '@/store/slices/contactSlice'
import mapIcon from "@/assets/mapicon.png"
import streeticon from "@/assets/streeticon.png"
import groupicon from "@/assets/groupicon.png"
import { CiMail } from "react-icons/ci";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoAddOutline } from "react-icons/io5";
import EditModal from '@/components/modal/editmodal';
import PhoneModal from '@/components/modal/phonemodal';
import EmailModal from '@/components/modal/emailmodal';
import editcontactdetail from "../../../assets/editcontactdetail.png"
import propertyicon from "../../../assets/propertyicon.png"
import kiticon from "../../../assets/kiticon.png"
import callsicon from "../../../assets/callsicon.png"
import mobileicon from "../../../assets/mobileicon.png"
import doticon from "../../../assets/doticon.png"
import toast from 'react-hot-toast'

const Detail = () => {
    const dispatch = useAppDispatch();
    const { currentContact, folders, lists } = useAppSelector((state) => state.contacts);
    const [showModal, setShowModal] = useState(false);
    const [phoneModal, setPhoneModal] = useState(false);
    const [emailModal, setEmailModal] = useState(false);
    const [openDesposition, setOpenDesposition] = useState("Call Back");

    const [selectedFolderId, setSelectedFolderId] = useState<string>('');
    const [selectedListId, setSelectedListId] = useState<string>('');

    useEffect(() => {
        dispatch(fetchContactFolders());
        dispatch(fetchContactLists());
    }, [dispatch]);

    useEffect(() => {
        if (currentContact && lists.length > 0) {
            // Try to find which list the contact belongs to
            const currentList = lists.find(l => l.contactIds.includes(currentContact.id));
            if (currentList) {
                setSelectedListId(currentList.id);
                // Now find the folder that contains this list
                const currentFolder = folders.find(f => f.listIds.includes(currentList.id));
                if (currentFolder) {
                    setSelectedFolderId(currentFolder.id);
                }
            }
        }
    }, [currentContact, lists, folders]);

    if (!currentContact) return null;

    const handleFolderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedFolderId(e.target.value);
        setSelectedListId(''); // Reset list selection when folder changes
    };

    const handleListChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedListId(e.target.value);
    };

    const handleUpdateOrg = async () => {
        if (!currentContact || !selectedListId) {
            toast.error("Please select both a folder and a list.");
            return;
        }
        try {
            await dispatch(assignContactToList({
                contactId: currentContact.id,
                listId: selectedListId
            })).unwrap();

            // Refresh lists to sync the internal contactIds arrays
            dispatch(fetchContactLists());
            toast.success("Success: Contact list assignment updated!");
        } catch (err: any) {
            console.error("Failed to update organization:", err);
            toast.error("Failed to update: " + err);
        }
    };

    if (!currentContact) return null;

    const stats = [
        { id: 1, name: "Calls", number: 0 },
        { id: 2, name: "Emails", number: currentContact.emails?.length || 0 },
        { id: 3, name: "SMS", number: 0 },
    ]

    const getPhoneIcon = (type: string) => {
        switch (type) {
            case 'MOBILE': return mobileicon;
            case 'TELEPHONE': return callsicon;
            case 'HOME': return kiticon;
            case 'WORK': return doticon;
            default: return callsicon;
        }
    }

    const despositions = [
        { id: 1, name: "Wrong Number" },
        { id: 2, name: "Not Interested" },
        { id: 3, name: "Answering Machine" },
        { id: 4, name: "Got Sale" },
        { id: 5, name: "DNC" },
        { id: 6, name: "Call Back" }
    ]

    const statusList = [
        { id: 1, name: "Permission" },
        { id: 2, name: "Want" },
        { id: 3, name: "Why" },
        { id: 4, name: "Status Quo" },
        { id: 5, name: "Timeline" },
        { id: 6, name: "Agent" }
    ]

    return (
        <section className='bg-white flex flex-col gap-8 px-6 py-5 w-[96%] mx-auto rounded-[24px]'>
            <div className='flex flex-col md:flex-row md:justify-between md:items-center'>
                <div className='flex flex-col lg:flex-row lg:gap-14 lg:items-center'>
                    <div className='flex flex-col'>
                        <div className='flex items-center gap-7'>
                            <h1 className='text-[20px] md:text-[28px] text-[#0E1011] font-medium'>
                                {currentContact.fullName || "Unnamed Contact"}
                            </h1>
                            <span className="bg-[#F7F7F7] p-2 rounded-[12px]">
                                <img
                                    src={editcontactdetail}
                                    onClick={() => setShowModal(true)}
                                    className="w-[18px] object-contain cursor-pointer"
                                    alt="edit"
                                />
                            </span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <span className='text-[14px] font-medium text-[#2B3034]'>
                                {currentContact.fullName}
                            </span>
                            <span className='text-[14px] font-normal text-[#495057]'>(Owner)</span>
                        </div>
                    </div>
                    <div className='flex items-center gap-5'>
                        {stats.map((dt) => (
                            <span key={dt.id} className='flex text-[14px] gap-1 items-center'>
                                <h1 className='text-[#2B3034] font-medium'>{dt.name}:</h1>
                                <h1 className='text-[#0E1011] font-semibold'>{dt.number}</h1>
                            </span>
                        ))}
                    </div>
                </div>
                <div className='flex items-center gap-3 '>
                    <span className='border p-1 rounded-lg border-gray-200'><img src={mapIcon} className='h-6 w-6 object-contain' alt="map" /></span>
                    <span className='border p-1 rounded-lg border-gray-200'><img src={streeticon} className='h-6 w-6 object-contain' alt="street" /></span>
                    <span className='border p-1 rounded-lg border-gray-200'><img src={groupicon} className='h-6 w-6 object-contain' alt="group" /></span>
                </div>
            </div>

            <div className='flex lg:flex-row flex-col justify-between gap-8 items-start'>
                <div className='flex w-full lg:w-1/3 flex-col gap-5'>
                    <div className='flex gap-1 items-start'>
                        <img src={propertyicon} className='w-[15px] translate-y-0.5 object-contain' alt="prop" />
                        <div className='flex flex-col gap-1'>
                            <span>
                                <h1 className='text-[14px] font-medium text-[#0E1011]'>Property Address:</h1>
                            </span>
                            <span>
                                <h1 className='text-[#495057] text-[14px] font-medium'>City: {currentContact.city || "-"}</h1>
                            </span>
                            <span>
                                <h1 className='text-[#495057] text-[14px] font-medium'>State: {currentContact.state || "-"}</h1>
                            </span>
                            <span>
                                <h1 className='text-[#495057] text-[14px] font-medium'>Zip code: {currentContact.zip || "-"}</h1>
                            </span>
                        </div>
                    </div>

                    <div className='flex gap-1 items-start'>
                        <h1><CiMail className='text-[19px] translate-y-0.5 font-medium text-[#0E1011]' /></h1>
                        <div className='flex flex-col gap-1'>
                            <span>
                                <h1 className='text-[14px] font-medium text-[#0E1011]'>Mailing Address:</h1>
                            </span>
                            <span>
                                <h1 className='text-[#495057] text-[14px] font-medium'>City: {currentContact.city || "-"}</h1>
                            </span>
                            <span>
                                <h1 className='text-[#495057] text-[14px] font-medium'>State: {currentContact.state || "-"}</h1>
                            </span>
                            <span>
                                <h1 className='text-[#495057] text-[14px] font-medium'>Zip code: {currentContact.zip || "-"}</h1>
                            </span>
                        </div>
                    </div>
                </div>

                <div className='flex w-full lg:w-1/3 flex-col gap-1'>
                    <div className='flex justify-between items-center'>
                        <h1 className='text-[14px] font-medium text-[#0E1011]'>Phones:</h1>
                        <span onClick={() => setPhoneModal(true)} className='p-1 rounded-[8px] bg-[#F7F7F7] cursor-pointer'><IoAddOutline className='text-[#495057] text-[18px]' /></span>
                    </div>
                    <div className='flex flex-col gap-1 '>
                        {currentContact.phones?.map((phone: any, index: number) => (
                            <div key={index} className='flex px-1 py-2 justify-between border-b border-gray-100 items-center gap-2'>
                                <div className='flex gap-4 items-center'>
                                    <img src={getPhoneIcon(phone.type)} alt="icon" />
                                    <span className='text-[#1D85F0] font-medium text-[14px]'>{phone.number}</span>
                                </div>
                                <div>
                                    <BsThreeDotsVertical className='text-[#2B3034] text-[15px] cursor-pointer' />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className='flex w-full lg:w-1/3 flex-col gap-1'>
                    <div className='flex justify-between items-center'>
                        <h1 className='text-[14px] font-medium text-[#0E1011]'>E-mails:</h1>
                        <span onClick={() => setEmailModal(true)} className='p-1 rounded-[8px] bg-[#F7F7F7] cursor-pointer'><IoAddOutline className='text-[#495057] text-[18px]' /></span>
                    </div>
                    <div className='flex flex-col gap-3'>
                        {currentContact.emails?.map((email: any, index: number) => (
                            <div key={index} className='flex px-1 py-2 justify-between border-b border-gray-100 items-center gap-2'>
                                <div className='flex gap-4 items-center'>
                                    <span className='text-[#1D85F0] font-medium text-[14px]'>{email.email}</span>
                                </div>
                                <div>
                                    <BsThreeDotsVertical className='text-[#2B3034] text-[15px] cursor-pointer' />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className='flex flex-col lg:flex-row w-full lg:items-center gap-6'>
                <div className='flex w-full items-center gap-4'>
                    <label htmlFor="folder" className='text-[14px] text-[#0E1011] font-medium whitespace-nowrap'>Folder:</label>
                    <select
                        id="folder"
                        value={selectedFolderId}
                        onChange={handleFolderChange}
                        className='border-b py-1 px-2 font-normal text-[#18181B] border-gray-300 flex-1 text-[16px] outline-none bg-transparent'
                    >
                        <option value="">Select Folder</option>
                        {folders.map(folder => (
                            <option key={folder.id} value={folder.id}>{folder.name}</option>
                        ))}
                    </select>
                </div>

                <div className='flex w-full items-center gap-4'>
                    <label htmlFor="list" className='text-[14px] text-[#0E1011] font-medium whitespace-nowrap'>List:</label>
                    <select
                        id="list"
                        value={selectedListId}
                        onChange={handleListChange}
                        disabled={!selectedFolderId}
                        className='border-b py-1 px-2 font-normal text-[#18181B] border-gray-300 flex-1 text-[16px] outline-none bg-transparent disabled:opacity-50'
                    >
                        <option value="">Select List</option>
                        {lists
                            .filter(list => {
                                const folder = folders.find(f => f.id === selectedFolderId);
                                return folder ? folder.listIds.includes(list.id) : false;
                            })
                            .map(list => (
                                <option key={list.id} value={list.id}>{list.name}</option>
                            ))
                        }
                    </select>
                </div>

                <div className='flex w-full items-center gap-4'>
                    <label htmlFor="tags" className='text-[14px] text-[#0E1011] font-medium whitespace-nowrap'>Tags:</label>
                    <input
                        type="text"
                        id="tags"
                        readOnly
                        value={currentContact.tags?.join(", ") || ""}
                        className='border-b py-1 px-2 font-normal text-[#18181B] border-gray-300 flex-1 text-[16px] outline-none'
                    />
                </div>

                <div className="flex items-center">
                    <button
                        onClick={handleUpdateOrg}
                        className="bg-[#0E1011] text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                        Update
                    </button>
                </div>
            </div>

            <div className='flex flex-col gap-3'>
                <h1 className='text-[14px] text-[#0E1011] font-medium'>Dispositions:</h1>
                <div className='flex gap-4 flex-wrap items-center'>
                    {despositions.map((disp) => (
                        <span key={disp.id} onClick={() => setOpenDesposition(disp.name)}
                            className={`${openDesposition === disp.name ? "bg-[#0E1011] text-[#FFFFFF]" : "bg-[#EBEDF0] text-[#18181B]"}  cursor-pointer rounded-[8px] text-[14px]  px-[16px] py-[5px] font-normal`}>
                            {disp.name}
                        </span>
                    ))}
                </div>
            </div>

            <div className="border-t border-gray-100 w-full"></div>

            <div className="flex gap-4 flex-wrap justify-center md:justify-around items-center">
                {statusList.map((stat) => (
                    <div key={stat.id} className="flex items-center flex-col gap-2">
                        <span className='border border-[#495057] h-2 w-2 p-2 rounded-[1.5px]'></span>
                        <span className='text-[14px] text-[#495057] inter font-normal'>{stat.name}</span>
                    </div>
                ))}
            </div>
            {showModal && <EditModal onClose={() => setShowModal(false)} />}
            {phoneModal && <PhoneModal isOpen={phoneModal} onClose={() => setPhoneModal(false)} />}
            {emailModal && <EmailModal isOpen={emailModal} onClose={() => setEmailModal(false)} />}
        </section>
    )
}

export default Detail
