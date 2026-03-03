import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchContactById } from '@/store/slices/contactSlice'
import BottomContactDetail from '@/components/agent/contactdetail/bottomcontactdetail'
import ContactDetailHeader from '@/components/agent/contactdetail/contactdetailheader'
import Detail from '@/components/agent/contactdetail/detail'
import Loader from '@/components/common/Loader'

const ContactDetail = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const { currentContact, isLoading, error } = useAppSelector((state) => state.contacts)

  useEffect(() => {
    if (id) {
      dispatch(fetchContactById(id))
    }
  }, [id, dispatch])

  if (isLoading && !currentContact) {
    return <div className="h-screen flex items-center justify-center bg-[#f7f7f7]"><Loader /></div>
  }

  if (error) {
    return <div className="h-screen flex items-center justify-center bg-[#f7f7f7] text-red-500">{error}</div>
  }

  if (!currentContact) {
    return <div className="h-screen flex items-center justify-center bg-[#f7f7f7]">Contact not found</div>
  }

  return (
    <section className='flex flex-col bg-[#f7f7f7] overflow-auto gap-6'>
      <ContactDetailHeader />
      <Detail />
      <BottomContactDetail />
    </section>
  )
}

export default ContactDetail