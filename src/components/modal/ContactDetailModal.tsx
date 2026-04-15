import React, { useEffect } from 'react';
import { Modal, ConfigProvider, theme } from 'antd';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchContactById } from '@/store/slices/contactSlice';
import ContactDetailHeader from '@/components/agent/contactdetail/contactdetailheader';
import Detail from '@/components/agent/contactdetail/detail';
import BottomContactDetail from '@/components/agent/contactdetail/bottomcontactdetail';
import Loader from '@/components/common/Loader';
import { IoClose } from 'react-icons/io5';

interface ContactDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactId: string | undefined;
}

const ContactDetailModal: React.FC<ContactDetailModalProps> = ({ isOpen, onClose, contactId }) => {
  const dispatch = useAppDispatch();
  const { currentContact, isLoading, error } = useAppSelector((state) => state.contacts);

  useEffect(() => {
    if (isOpen && contactId) {
      dispatch(fetchContactById(contactId));
    }
  }, [isOpen, contactId, dispatch]);

  const isDarkMode = document.documentElement.classList.contains('dark');

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <Modal
        open={isOpen}
        onCancel={onClose}
        footer={null}
        width="95%"
        style={{ maxWidth: '1200px', top: 20 }}
        className="contact-detail-modal-custom"
        closeIcon={<IoClose className="text-2xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />}
        destroyOnClose
      >
        <div className="dark:bg-slate-900 rounded-xl overflow-hidden min-h-[400px]">
          {isLoading && !currentContact ? (
            <div className="flex items-center justify-center p-20">
              <Loader />
            </div>
          ) : error ? (
            <div className="p-20 text-center text-red-500">
              {error}
            </div>
          ) : currentContact ? (
            <section className='flex flex-col w-full gap-y-6 p-4 md:p-6 max-h-[85vh] overflow-y-auto custom-scrollbar transition-colors'>
              <ContactDetailHeader />
              <Detail />
              <BottomContactDetail />
            </section>
          ) : (
            <div className="p-20 text-center text-gray-500 dark:text-gray-400">
              Contact not found
            </div>
          )}
        </div>
        <style>{`
          .contact-detail-modal-custom .ant-modal-content {
            padding: 0 !important;
            border-radius: 16px !important;
            overflow: hidden;
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 10px;
          }
          .dark .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #334155;
          }
        `}</style>
      </Modal>
    </ConfigProvider>
  );
};

export default ContactDetailModal;
