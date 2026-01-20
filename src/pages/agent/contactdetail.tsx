import BottomContactDetail from '@/components/agent/contactdetail/bottomcontactdetail'
import ContactDetailHeader from '@/components/agent/contactdetail/contactdetailheader'
import Detail from '@/components/agent/contactdetail/detail'

const ContactDetail = () => {
  return (
    <section className='flex flex-col  bg-[#f7f7f7] overflow-auto gap-6'>
        <ContactDetailHeader/>
        <Detail/>
        <BottomContactDetail/>

    </section>
  )
}

export default ContactDetail