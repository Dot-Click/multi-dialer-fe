import BottomContactDetail from '@/components/agent/contactdetail/bottomcontactdetail'
import ContactDetailHeader from '@/components/agent/contactdetail/contactdetailheader'
import Detail from '@/components/agent/contactdetail/detail'
import React from 'react'

const ContactDetail = () => {
  return (
    <section className='flex flex-col max-w-screen overflow-auto gap-6'>
        <ContactDetailHeader/>
        <Detail/>
        <BottomContactDetail/>

    </section>
  )
}

export default ContactDetail