import CallSection from '@/components/agent/contactinfo/callsection'
import ContactFooter from '@/components/agent/contactinfo/contactfooter'
import ContactInfoBottom from '@/components/agent/contactinfo/contactinfobottom'
import ContactInfoCallSentiment from '@/components/agent/contactinfo/contactinfocallsentiment'
import ContactInfoDisposition from '@/components/agent/contactinfo/contactinfodisposition'
import ContactInfoHeader from '@/components/agent/contactinfo/contactinfoheader'
import ContactInfoScript from '@/components/agent/contactinfo/contactinfoscript'
import LiveContactScript from '@/components/agent/contactinfo/livecallscript'

const ContactInfo = () => {
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

export default ContactInfo;