import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { updateContact } from '@/store/slices/contactSlice'
import toast from 'react-hot-toast'

const Notes = () => {
    const dispatch = useAppDispatch();
    const { currentContact } = useAppSelector((state) => state.contacts);
    const [value, setValue] = useState("");

    useEffect(() => {
        if (currentContact?.notes) {
            setValue(currentContact.notes);
        }
    }, [currentContact]);

    const handleSave = async () => {
        if (!currentContact) return;
        try {
            await dispatch(updateContact({
                id: currentContact.id,
                payload: { notes: value }
            })).unwrap();
            toast.success("Notes saved successfully");
        } catch (error: any) {
            toast.error("Failed to save notes: " + error);
        }
    };

    return (
        <div className='w-full flex flex-col gap-4'>
            <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder='Type your note here'
                className='w-full h-40 p-[16px] rounded-[12px] resize-none bg-[#F7F7F7] border border-transparent focus:border-[#FFCA06] transition-all outline-none text-[#495057] font-normal text-[16px]'
            ></textarea>
            <div className='flex justify-end'>
                <button
                    onClick={handleSave}
                    className="bg-[#0E1011] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                    Save Notes
                </button>
            </div>
        </div>
    )
}

export default Notes