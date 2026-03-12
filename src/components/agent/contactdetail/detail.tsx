import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
    fetchContactFolders,
    fetchContactLists,
    updateContact,
    fetchContactGroups,
    assignContactToGroups,
    assignContactToList,
} from '@/store/slices/contactSlice'
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
    const { currentContact, folders, lists, groups } = useAppSelector((state) => state.contacts);
    const [showModal, setShowModal] = useState(false);
    const [phoneModal, setPhoneModal] = useState(false);
    const [editingPhone, setEditingPhone] = useState<any>(null);
    const [editingPhoneIndex, setEditingPhoneIndex] = useState<number | undefined>(undefined);

    const [emailModal, setEmailModal] = useState(false);
    const [editingEmail, setEditingEmail] = useState<any>(null);
    const [editingEmailIndex, setEditingEmailIndex] = useState<number | undefined>(undefined);

    const [selectedFolderId, setSelectedFolderId] = useState<string>('');
    const [selectedListId, setSelectedListId] = useState<string>('');
    const [tagsInput, setTagsInput] = useState<string>('');
    const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);

    useEffect(() => {
        dispatch(fetchContactFolders());
        dispatch(fetchContactLists());
        dispatch(fetchContactGroups());
    }, [dispatch]);

    useEffect(() => {
        if (currentContact) {
            setTagsInput(currentContact.tags?.join(", ") || "");

            // Initialize groups the contact belongs to
            const memberGroupIds = groups
                .filter(group => group.contactIds.includes(currentContact.id))
                .map(group => group.id);
            setSelectedGroupIds(memberGroupIds);

            if (lists.length > 0) {
                const currentList = lists.find(l => l.contactIds.includes(currentContact.id));
                if (currentList) {
                    setSelectedListId(currentList.id);
                    const currentFolder = folders.find(f => f.listIds.includes(currentList.id));
                    if (currentFolder) {
                        setSelectedFolderId(currentFolder.id);
                    }
                }
            }
        }
    }, [currentContact, lists, folders, groups]);

    if (!currentContact) return null;

    const handleFolderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedFolderId(e.target.value);
        setSelectedListId('');
    };

    const handleListChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedListId(e.target.value);
    };

    const handleUpdateOrg = async () => {
        if (!currentContact) {
            toast.error("Contact not found");
            return;
        }
        try {
            // 1. Handle List Assignment — use assignContactToList, NOT assignAgentsToList
            const currentList = lists.find(l => l.contactIds.includes(currentContact.id));
            if (selectedListId && selectedListId !== currentList?.id) {
                await dispatch(assignContactToList({
                    contactId: currentContact.id,
                    listId: selectedListId,
                })).unwrap();
                dispatch(fetchContactLists());
            }

            // 2. Handle Groups Assignment
            await dispatch(assignContactToGroups({
                contactId: currentContact.id,
                groupIds: selectedGroupIds,
            })).unwrap();
            dispatch(fetchContactGroups());

            // 3. Handle Tags
            const tagsArray = tagsInput
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag !== "");
            await dispatch(updateContact({
                id: currentContact.id,
                payload: { tags: tagsArray },
            })).unwrap();

            toast.success("Contact updated successfully!");
        } catch (err: any) {
            console.error("Failed to update contact:", err);
            toast.error("Failed to update: " + err);
        }
    };

    const stats = [
        { id: 1, name: "Calls", number: 0 },
        { id: 2, name: "Emails", number: currentContact.emails?.length || 0 },
        { id: 3, name: "SMS", number: 0 },
    ];

    const getPhoneIcon = (type: string) => {
        switch (type) {
            case 'MOBILE': return mobileicon;
            case 'TELEPHONE': return callsicon;
            case 'HOME': return kiticon;
            case 'WORK': return doticon;
            default: return callsicon;
        }
    };

    return (
        <section className='bg-white dark:bg-slate-800 flex flex-col gap-8 px-6 py-5 w-[96%] mx-auto rounded-[24px] transition-colors'>
            <div className='flex flex-col md:flex-row md:justify-between md:items-center'>
                <div className='flex flex-col lg:flex-row lg:gap-14 lg:items-center'>
                    <div className='flex flex-col'>
                        <div className='flex items-center gap-7'>
                            <h1 className='text-[20px] md:text-[28px] text-[#0E1011] dark:text-white font-medium'>
                                {currentContact.fullName || "Unnamed Contact"}
                            </h1>
                            <span className="bg-[#F7F7F7] dark:bg-gray-700 p-2 rounded-[12px]">
                                <img
                                    src={editcontactdetail}
                                    onClick={() => setShowModal(true)}
                                    className="w-[18px] object-contain cursor-pointer"
                                    alt="edit"
                                />
                            </span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <span className='text-[14px] font-medium text-[#2B3034] dark:text-gray-300'>
                                {currentContact.fullName}
                            </span>
                            <span className='text-[14px] font-normal text-[#495057] dark:text-gray-400'>(Owner)</span>
                        </div>
                    </div>
                    <div className='flex items-center gap-5'>
                        {stats.map((dt) => (
                            <span key={dt.id} className='flex text-[14px] gap-1 items-center'>
                                <h1 className='text-[#2B3034] dark:text-gray-300 font-medium'>{dt.name}:</h1>
                                <h1 className='text-[#0E1011] dark:text-white font-semibold'>{dt.number}</h1>
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className='flex lg:flex-row flex-col justify-between gap-8 items-start'>
                <div className='flex w-full lg:w-1/3 flex-col gap-5'>
                    <div className='flex gap-1 items-start'>
                        <img src={propertyicon} className='w-[15px] translate-y-0.5 object-contain' alt="prop" />
                        <div className='flex flex-col gap-1'>
                            <span>
                                <h1 className='text-[14px] font-medium text-[#0E1011] dark:text-white'>Property Address:</h1>
                            </span>
                            <span>
                                <h1 className='text-[#495057] dark:text-gray-400 text-[14px] font-medium'>Address: {currentContact.address || '-'}</h1>
                            </span>
                            <span>
                                <h1 className='text-[#495057] dark:text-gray-400 text-[14px] font-medium'>City: {currentContact.city || '-'}</h1>
                            </span>
                            <span>
                                <h1 className='text-[#495057] dark:text-gray-400 text-[14px] font-medium'>State: {currentContact.state || '-'}</h1>
                            </span>
                            <span>
                                <h1 className='text-[#495057] dark:text-gray-400 text-[14px] font-medium'>Zip code: {currentContact.zip || '-'}</h1>
                            </span>
                        </div>
                    </div>

                    <div className='flex gap-1 items-start'>
                        <h1><CiMail className='text-[19px] translate-y-0.5 font-medium text-[#0E1011] dark:text-white' /></h1>
                        <div className='flex flex-col gap-1'>
                            <span>
                                <h1 className='text-[14px] font-medium text-[#0E1011] dark:text-white'>Mailing Address:</h1>
                            </span>
                            <span>
                                <h1 className='text-[#495057] dark:text-gray-400 text-[14px] font-medium'>Address: {currentContact.mailingAddress || '-'}</h1>
                            </span>
                            <span>
                                <h1 className='text-[#495057] dark:text-gray-400 text-[14px] font-medium'>City: {currentContact.mailingCity || '-'}</h1>
                            </span>
                            <span>
                                <h1 className='text-[#495057] dark:text-gray-400 text-[14px] font-medium'>State: {currentContact.mailingState || '-'}</h1>
                            </span>
                            <span>
                                <h1 className='text-[#495057] dark:text-gray-400 text-[14px] font-medium'>Zip code: {currentContact.mailingZip || '-'}</h1>
                            </span>
                        </div>
                    </div>
                </div>

                <div className='flex w-full lg:w-1/3 flex-col gap-1'>
                    <div className='flex justify-between items-center'>
                        <h1 className='text-[14px] font-medium text-[#0E1011] dark:text-white'>Phones:</h1>
                        <span
                            onClick={() => {
                                setEditingPhone(null);
                                setEditingPhoneIndex(undefined);
                                setPhoneModal(true);
                            }}
                            className='p-1 rounded-[8px] bg-[#F7F7F7] dark:bg-gray-700 cursor-pointer'
                        >
                            <IoAddOutline className='text-[#495057] dark:text-white text-[18px]' />
                        </span>
                    </div>
                    <div className='flex flex-col gap-1'>
                        {currentContact.phones?.map((phone: any, index: number) => (
                            <div key={index} className='flex px-1 py-2 justify-between border-b border-gray-100 dark:border-gray-700 items-center gap-2'>
                                <div className='flex gap-4 items-center'>
                                    <img src={getPhoneIcon(phone.type)} alt="icon" className="dark:brightness-200" />
                                    <span className='text-[#1D85F0] font-medium text-[14px]'>{phone.number}</span>
                                </div>
                                <div>
                                    <BsThreeDotsVertical
                                        onClick={() => {
                                            setEditingPhone(phone);
                                            setEditingPhoneIndex(index);
                                            setPhoneModal(true);
                                        }}
                                        className='text-[#2B3034] dark:text-gray-300 text-[15px] cursor-pointer hover:text-blue-500'
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className='flex w-full lg:w-1/3 flex-col gap-1'>
                    <div className='flex justify-between items-center'>
                        <h1 className='text-[14px] font-medium text-[#0E1011] dark:text-white'>E-mails:</h1>
                        <span
                            onClick={() => {
                                setEditingEmail(null);
                                setEditingEmailIndex(undefined);
                                setEmailModal(true);
                            }}
                            className='p-1 rounded-[8px] bg-[#F7F7F7] dark:bg-gray-700 cursor-pointer'
                        >
                            <IoAddOutline className='text-[#495057] dark:text-white text-[18px]' />
                        </span>
                    </div>
                    <div className='flex flex-col gap-3'>
                        {currentContact.emails?.map((email: any, index: number) => (
                            <div key={index} className='flex px-1 py-2 justify-between border-b border-gray-100 dark:border-gray-700 items-center gap-2'>
                                <div className='flex gap-4 items-center'>
                                    <span className='text-[#1D85F0] font-medium text-[14px]'>{email.email}</span>
                                </div>
                                <div>
                                    <BsThreeDotsVertical
                                        onClick={() => {
                                            setEditingEmail(email);
                                            setEditingEmailIndex(index);
                                            setEmailModal(true);
                                        }}
                                        className='text-[#2B3034] dark:text-gray-300 text-[15px] cursor-pointer hover:text-blue-500'
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className='flex flex-col lg:flex-row w-full lg:items-center gap-6'>
                <div className='flex w-full items-center gap-4'>
                    <label htmlFor="folder" className='text-[14px] text-[#0E1011] dark:text-white font-medium whitespace-nowrap'>Folder:</label>
                    <select
                        id="folder"
                        value={selectedFolderId}
                        onChange={handleFolderChange}
                        className='border-b py-1 px-2 font-normal text-[#18181B] dark:text-white border-gray-300 dark:border-gray-700 flex-1 text-[16px] outline-none bg-transparent'
                    >
                        <option value="" className="dark:bg-slate-800">Select Folder</option>
                        {folders.map(folder => (
                            <option key={folder.id} value={folder.id} className="dark:bg-slate-800">{folder.name}</option>
                        ))}
                    </select>
                </div>

                <div className='flex w-full items-center gap-4'>
                    <label htmlFor="list" className='text-[14px] text-[#0E1011] dark:text-white font-medium whitespace-nowrap'>List:</label>
                    <select
                        id="list"
                        value={selectedListId}
                        onChange={handleListChange}
                        disabled={!selectedFolderId}
                        className='border-b py-1 px-2 font-normal text-[#18181B] dark:text-white border-gray-300 dark:border-gray-700 flex-1 text-[16px] outline-none bg-transparent disabled:opacity-50'
                    >
                        <option value="" className="dark:bg-slate-800">Select List</option>
                        {lists
                            .filter(list => {
                                const folder = folders.find(f => f.id === selectedFolderId);
                                return folder ? folder.listIds.includes(list.id) : false;
                            })
                            .map(list => (
                                <option key={list.id} value={list.id} className="dark:bg-slate-800">{list.name}</option>
                            ))
                        }
                    </select>
                </div>

                <div className='flex w-full items-center gap-4'>
                    <label htmlFor="tags" className='text-[14px] text-[#0E1011] dark:text-white font-medium whitespace-nowrap'>Tags:</label>
                    <input
                        type="text"
                        id="tags"
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                        placeholder="Tag1, Tag2..."
                        className='border-b py-1 px-2 font-normal text-[#18181B] dark:text-white border-gray-300 dark:border-gray-700 flex-1 text-[16px] outline-none bg-transparent'
                    />
                </div>

                <div className="flex items-center">
                    <button
                        onClick={handleUpdateOrg}
                        className="bg-[#0E1011] dark:bg-[#FFCA06] text-white dark:text-[#2B3034] px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-800 dark:hover:bg-[#ffd633] transition-colors"
                    >
                        Update
                    </button>
                </div>
            </div>

            <div className='flex flex-col gap-3'>
                <h1 className='text-[14px] text-[#0E1011] dark:text-white font-medium'>Groups:</h1>
                <div className='flex gap-4 flex-wrap items-center'>
                    {groups.map((group) => {
                        const isSelected = selectedGroupIds.includes(group.id);
                        return (
                            <span
                                key={group.id}
                                onClick={() => {
                                    setSelectedGroupIds(prev =>
                                        isSelected
                                            ? prev.filter(id => id !== group.id)
                                            : [...prev, group.id]
                                    );
                                }}
                                className={`${isSelected ? "bg-[#0E1011] dark:bg-[#FFCA06] text-[#FFFFFF] dark:text-[#2B3034]" : "bg-[#EBEDF0] dark:bg-gray-700 text-[#18181B] dark:text-white"} cursor-pointer rounded-[8px] text-[14px] px-[16px] py-[5px] font-normal transition-colors`}
                            >
                                {group.name}
                            </span>
                        );
                    })}
                    {groups.length === 0 && (
                        <span className="text-gray-400 dark:text-gray-500 text-sm">No groups available</span>
                    )}
                </div>
            </div>

            {showModal && <EditModal onClose={() => setShowModal(false)} />}
            {phoneModal && (
                <PhoneModal
                    isOpen={phoneModal}
                    onClose={() => {
                        setPhoneModal(false);
                        setEditingPhone(null);
                        setEditingPhoneIndex(undefined);
                    }}
                    initialData={editingPhone}
                    index={editingPhoneIndex}
                />
            )}
            {emailModal && (
                <EmailModal
                    isOpen={emailModal}
                    onClose={() => {
                        setEmailModal(false);
                        setEditingEmail(null);
                        setEditingEmailIndex(undefined);
                    }}
                    initialData={editingEmail}
                    index={editingEmailIndex}
                />
            )}
        </section>
    );
};

export default Detail;