// import { useLocation } from 'react-router-dom';
import CallSection from '@/components/admin/contactinfo/callsection'
import ContactFooter from '@/components/admin/contactinfo/contactfooter'
import ContactInfoBottom from '@/components/admin/contactinfo/contactinfobottom'
import ContactInfoCallSentiment from '@/components/admin/contactinfo/contactinfocallsentiment'
import ContactInfoDisposition from '@/components/admin/contactinfo/contactinfodisposition'
import ContactInfoHeader from '@/components/admin/contactinfo/contactinfoheader'
import ContactInfoScript from '@/components/admin/contactinfo/contactinfoscript'
import LiveContactScript from '@/components/admin/contactinfo/livecallscript'

const AdminContactInfo = () => {
    // const location = useLocation();
    // const contactData = location.state?.contact || null;

    return (
        // Overall page container
        <div className="bg-gray-100 min-h-screen">
            <ContactInfoHeader />

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

                    <LiveContactScript />
                    <ContactInfoCallSentiment />
                </div>
            </div>

            <ContactFooter />
        </div>
    )
}

export default AdminContactInfo;