// import CallSection from '@/components/agent/contactinfo/callsection'
// import ContactInfoDisposition from '@/components/agent/contactinfo/contactinfodisposition'
// import ContactInfoHeader from '@/components/agent/contactinfo/contactinfoheader'
// import ContactInfoScript from '@/components/agent/contactinfo/contactinfoscript'

// const ContactInfo = () => {
//     return (
//         <div>
//             <ContactInfoHeader />


//             <div className='flex w-full  gap-3'>

//             <div className='w-[65%]'>
//             <CallSection />
//             <ContactInfoDisposition/>
//             </div>

//             <div className='w-[35%]'>
//                 <ContactInfoScript/>
//             </div>

//             </div>
//         </div>
//     )
// }

// export default ContactInfo


import CallSection from '@/components/agent/contactinfo/callsection'
import ContactInfoBottom from '@/components/agent/contactinfo/contactinfobottom'
import ContactInfoDisposition from '@/components/agent/contactinfo/contactinfodisposition'
import ContactInfoHeader from '@/components/agent/contactinfo/contactinfoheader'
import ContactInfoScript from '@/components/agent/contactinfo/contactinfoscript'

const ContactInfo = () => {
    return (
        // Overall page container
        <div className="bg-gray-100 min-h-screen">
            <ContactInfoHeader />

            {/* Main content area */}
            <div className='w-full p-4 lg:flex lg:gap-4 space-y-4 lg:space-y-0'>

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

            <ContactInfoBottom />
        </div>
    )
}

export default ContactInfo;