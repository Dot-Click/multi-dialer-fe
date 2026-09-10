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
    return <div className="h-screen flex items-center justify-center bg-[#f7f7f7] dark:bg-slate-900"><Loader /></div>
  }

  if (error) {
    return <div className="h-screen flex items-center justify-center bg-[#f7f7f7] dark:bg-slate-900 text-red-500">{error}</div>
  }

  if (!currentContact) {
    return <div className="h-screen flex items-center justify-center bg-[#f7f7f7] dark:bg-slate-900 dark:text-gray-400">Contact not found</div>
  }

  return (
    <section className='flex flex-col bg-[#f7f7f7] dark:bg-slate-900 w-[96%] gap-y-6 h-full overflow-y-auto'>
      <ContactDetailHeader />
      <Detail />
      {/* The 460px floor lives here, not in the component. This page scrolls,
          so the panel needs a minimum height to push the page into overflow
          rather than be squeezed into whatever the siblings left over. 460px
          is the tab strip plus a panel worth reading. The dialer's contact-info
          layout deliberately does NOT apply it — there the column is a fixed
          height and the panel scrolls inside it. */}
      <div className="flex flex-col flex-1 min-h-[460px]">
        <BottomContactDetail />
      </div>
    </section>
  )
}

export default ContactDetail