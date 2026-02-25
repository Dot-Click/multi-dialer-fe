import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchContactById, setQueue } from '@/store/slices/contactSlice';
import CallSection from '@/components/agent/contactinfo/callsection';
import ContactInfoBottom from '@/components/agent/contactinfo/contactinfobottom';
import ContactInfoCallSentiment from '@/components/agent/contactinfo/contactinfocallsentiment';
import ContactInfoDisposition from '@/components/agent/contactinfo/contactinfodisposition';
import ContactInfoHeader from '@/components/agent/contactinfo/contactinfoheader';
import ContactInfoScript from '@/components/agent/contactinfo/contactinfoscript';

const ContactInfo = () => {
    const location = useLocation();
    const dispatch = useAppDispatch();
    const { queue, currentContact } = useAppSelector((state) => state.contacts);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Initialize queue from location state
    useEffect(() => {
        const selectedContacts = location.state?.contacts;
        if (selectedContacts && selectedContacts.length > 0) {
            dispatch(setQueue(selectedContacts));
            setCurrentIndex(0);
        }
    }, [location.state, dispatch]);

    // Fetch contact data whenever the current index changes
    useEffect(() => {
        if (queue.length > 0 && queue[currentIndex]) {
            const contactId = queue[currentIndex].id;
            dispatch(fetchContactById(contactId));
        }
    }, [currentIndex, queue, dispatch]);

    const handleNextContact = () => {
        if (currentIndex < queue.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            console.log("End of queue reached");
        }
    };

    const handlePreviousContact = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <ContactInfoHeader 
                contact={currentContact} 
                onNext={handleNextContact}
                onPrev={handlePreviousContact}
                currentIndex={currentIndex}
                totalContacts={queue.length}
            />

            {/* Main content area */}
            <div className='w-full p-4  lg:flex lg:gap-4 space-y-4 lg:space-y-0'>

                {/* Left Column (takes 65% width on large screens) */}
                <div className='w-full lg:w-[65%] space-y-4'>
                    <CallSection />
                    <ContactInfoDisposition />
                </div>

                {/* Right Column (takes 35% width on large screens) */}
                <div className='w-full lg:w-[35%]'>
                    <ContactInfoScript />
                </div>
            </div>

            <div className='w-full p-4  lg:flex lg:gap-4 space-y-4 lg:space-y-0'>
                <div className='w-full lg:w-[65%]'>
                    <ContactInfoBottom />
                </div>
                <div className='w-full h-fit flex flex-col gap-2 lg:w-[35%]'>
                    <ContactInfoCallSentiment />
                </div>
            </div>
        </div>
    );
};

export default ContactInfo;