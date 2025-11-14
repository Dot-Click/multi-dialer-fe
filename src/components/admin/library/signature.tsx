// import { FiMoreHorizontal, FiImage } from 'react-icons/fi';
// import React, { useState } from 'react';
// import type { ReactNode } from 'react';
// import { useNavigate } from 'react-router-dom';

// interface SignatureLinkProps {
//   href: string;
//   children: ReactNode;
// }

// const SignatureLink: React.FC<SignatureLinkProps> = ({ href, children }) => (
//   <a href={href} className="text-sm text-blue-600 hover:underline pb-0.5">
//     {children}
//   </a>
// );

// const Signature: React.FC = () => {
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [modalOpen, setModalOpen] = useState(false);

//   const navigate = useNavigate()

//   const handleEdit = () => {
//     navigate("/admin/edit-signature")
//     setDropdownOpen(false);
//   };

//   const handleDelete = () => {
//     setModalOpen(true);
//     setDropdownOpen(false);
//   };

//   const confirmDelete = () => {
//     // TODO: Call delete API or logic here
//     console.log('Signature deleted');
//     setModalOpen(false);
//   };

//   return (
//     <div className="bg-gray-50 min-h-fit rounded-lg flex px-3 py-2 font-sans">
//       <div className="w-full">
//         {/* Header Section */}
//         <header className="flex justify-between items-center mb-3 px-2 relative">
//           <h1 className="text-xl font-semibold text-gray-800">Signature</h1>
//           <div className="relative">
//             <button
//               className="text-gray-500 hover:text-gray-700 p-2 rounded-full"
//               onClick={() => setDropdownOpen(!dropdownOpen)}
//             >
//               <FiMoreHorizontal size={20} />
//             </button>

//             {/* Dropdown Menu */}
//             {dropdownOpen && (
//               <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-md z-10">
//                 <button
//                   className="block w-full text-left px-4 py-2 hover:bg-gray-100"
//                   onClick={handleEdit}
//                 >
//                   Edit
//                 </button>
//                 <button
//                   className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
//                   onClick={handleDelete}
//                 >
//                   Delete
//                 </button>
//               </div>
//             )}
//           </div>
//         </header>

//         {/* Signature Card */}
//         <div className="rounded-xl border border-gray-100 relative">
//           <div className="p-6 overflow-y-auto h-[520px] custom-scrollbar">
//             {/* Image Placeholder */}
//             <div className="bg-gray-100 rounded-md w-[55%] mx-auto h-40 flex items-center justify-center mb-6 border border-gray-200">
//               <FiImage className="text-gray-400" size={32} />
//             </div>

//             {/* Personal Details */}
//             <div className="mb-6">
//               <p className="font-semibold text-gray-800 text-base mb-2">
//                 Jason Henry Sousa
//               </p>
//               <div className="text-sm text-gray-500 space-y-1">
//                 <p>Realtor</p>
//                 <p>TREC #817869</p>
//                 <p>512-588-3223</p>
//               </div>
//             </div>

//             {/* Main Links */}
//             <div className="flex flex-wrap gap-x-5 gap-y-2 mb-6">
//               <SignatureLink href="#">Go to My Website</SignatureLink>
//               <SignatureLink href="#">Home Valuation</SignatureLink>
//               <SignatureLink href="#">Like Me on Facebook</SignatureLink>
//               <SignatureLink href="#">Submit a Review</SignatureLink>
//             </div>

//             {/* Divider */}
//             <hr className="border-gray-200 my-6" />

//             {/* Secondary Links */}
//             <div className="flex flex-col items-start gap-3">
//               <SignatureLink href="#">IABS</SignatureLink>
//               <SignatureLink href="#">Consumer Protection Notice</SignatureLink>
//             </div>
//           </div>

//           {/* Bottom decorative line */}
//           <div className="absolute bottom-4 left-6 right-6 h-1 bg-gray-200 rounded-full"></div>
//         </div>
//       </div>

//       {/* Delete Modal */}
//       {modalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
//           <div className="bg-white rounded-lg p-6 w-96">
//             <h2 className="text-lg font-semibold mb-4">Delete Signature?</h2>
//             <p className="mb-6 text-gray-600">
//               Are you sure you want to delete this signature? This action cannot
//               be undone.
//             </p>
//             <div className="flex justify-end gap-3">
//               <button
//                 className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
//                 onClick={() => setModalOpen(false)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
//                 onClick={confirmDelete}
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Signature;



import { FiMoreHorizontal, FiImage } from 'react-icons/fi';
import { AiOutlineWarning } from 'react-icons/ai'; // آئیکن امپورٹ کریں
import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface SignatureLinkProps {
  href: string;
  children: ReactNode;
}

const SignatureLink: React.FC<SignatureLinkProps> = ({ href, children }) => (
  <a href={href} className="text-sm text-blue-600 hover:underline pb-0.5">
    {children}
  </a>
);

const Signature: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();

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
        <div className="rounded-xl border border-gray-100 relative">
          <div className="p-6 overflow-y-auto h-[520px] custom-scrollbar">
            {/* Image Placeholder */}
            <div className="bg-gray-100 rounded-md w-[55%] mx-auto h-40 flex items-center justify-center mb-6 border border-gray-200">
              <FiImage className="text-gray-400" size={32} />
            </div>

            {/* Personal Details */}
            <div className="mb-6">
              <p className="font-semibold text-gray-800 text-base mb-2">
                Jason Henry Sousa
              </p>
              <div className="text-sm text-gray-500 space-y-1">
                <p>Realtor</p>
                <p>TREC #817869</p>
                <p>512-588-3223</p>
              </div>
            </div>

            {/* Main Links */}
            <div className="flex flex-wrap gap-x-5 gap-y-2 mb-6">
              <SignatureLink href="#">Go to My Website</SignatureLink>
              <SignatureLink href="#">Home Valuation</SignatureLink>
              <SignatureLink href="#">Like Me on Facebook</SignatureLink>
              <SignatureLink href="#">Submit a Review</SignatureLink>
            </div>

            {/* Divider */}
            <hr className="border-gray-200 my-6" />

            {/* Secondary Links */}
            <div className="flex flex-col items-start gap-3">
              <SignatureLink href="#">IABS</SignatureLink>
              <SignatureLink href="#">Consumer Protection Notice</SignatureLink>
            </div>
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