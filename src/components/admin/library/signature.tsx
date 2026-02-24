import { FiMoreHorizontal, FiImage } from 'react-icons/fi';
import { AiOutlineWarning } from 'react-icons/ai';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignature } from '@/hooks/useSignature';
import type { Signature as SignatureType } from '@/hooks/useSignature';

// interface SignatureLinkProps {
//   href: string;
//   children: ReactNode;
// }

// const SignatureLink: React.FC<SignatureLinkProps> = ({ href, children }) => (
//   <a href={href} className="text-sm text-blue-600 hover:underline pb-0.5">
//     {children}
//   </a>
// );

const Signature: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [signature, setSignature] = useState<SignatureType | null>(null);
  const { getSignature, loading } = useSignature();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSignature = async () => {
      const data = await getSignature();
      setSignature(data);
    };
    fetchSignature();
  }, []);

  const handleEdit = () => {
    navigate('/admin/edit-signature');
    setDropdownOpen(false);
  };

  const handleDelete = () => {
    setModalOpen(true);
    setDropdownOpen(false);
  };

  const confirmDelete = () => {
    // TODO: یہاں ڈیلیٹ کرنے کی منطق یا API کال شامل کریں
    console.log('Signature deleted');
    setModalOpen(false);
  };

  return (
    <div className="bg-gray-50 min-h-fit rounded-lg flex px-3 py-2 font-sans">
      <div className="w-full">
        {/* Header Section */}
        <header className="flex justify-between items-center mb-3 px-2 relative">
          <h1 className="text-xl font-semibold text-gray-800">Signature</h1>
          <div className="relative">
            <button
              className="text-gray-500 hover:text-gray-700 p-2 rounded-full"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <FiMoreHorizontal size={20} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-md z-10">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={handleEdit}
                >
                  Edit
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Signature Card */}
        <div className="rounded-xl border border-gray-100 relative bg-white min-h-[520px]">
          <div className="p-6 overflow-y-auto h-[520px] custom-scrollbar">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : signature ? (
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: signature.content }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
                <div className="bg-gray-100 rounded-md w-[80%] aspect-video flex items-center justify-center border border-gray-200">
                  <FiImage className="text-gray-400" size={32} />
                </div>
                <p>No signature found. Click Edit to create one.</p>
              </div>
            )}
          </div>

          {/* Bottom decorative line */}
          <div className="absolute bottom-4 left-6 right-6 h-1 bg-gray-200 rounded-full"></div>
        </div>
      </div>

      {/* Delete Modal - اپ ڈیٹ شدہ */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white rounded-lg p-8 w-full max-w-md mx-auto">
            <div className="flex flex-col items-center text-center">
              {/* Warning Icon */}
              <div className="text-red-500 mb-4">
                <AiOutlineWarning size={48} />
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Delete Signature?
              </h2>

              {/* Description */}
              <p className="text-gray-600 mb-8">
                Once deleted, this action cannot be undone. Are you sure you
                want to proceed?
              </p>

              {/* Buttons */}
              <div className="flex justify-center gap-4 w-full">
                <button
                  className="flex-1 px-6 py-3 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 px-6 py-3 rounded-lg bg-yellow-500 text-gray-950 font-semibold hover:bg-yellow-600"
                  onClick={confirmDelete}
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signature;