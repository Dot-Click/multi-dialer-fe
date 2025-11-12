// Icons from react-icons library
import { FiMoreHorizontal, FiImage } from 'react-icons/fi';
import React  from 'react';
import type {  ReactNode } from 'react';


// ✅ Props interface for SignatureLink
interface SignatureLinkProps {
  href: string;
  children: ReactNode;
}

// Reusable Link component for styling consistency
const SignatureLink: React.FC<SignatureLinkProps> = ({ href, children }) => (
  <a href={href} className="text-sm text-blue-600 hover:underline pb-0.5">
    {children}
  </a>
);

const Signature: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-fit rounded-lg flex px-3 py-2 font-sans">
      <div className="w-full">
        
        {/* Header Section */}
        <header className="flex justify-between items-center mb-3 px-2">
          <h1 className="text-xl font-semibold text-gray-800">Signature</h1>
          <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full">
            <FiMoreHorizontal size={20} />
          </button>
        </header>

        {/* Signature Card */}
        <div className="rounded-xl border border-gray-100 relative">
          {/* Custom Scrollbar Styling */}
          <style>
            {`
              .custom-scrollbar::-webkit-scrollbar {
                width: 6px;
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                background: transparent;
                margin-top: 20px;
                margin-bottom: 20px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background: #cccccc;
                border-radius: 10px;
              }
            `}
          </style>

          <div className="p-6 overflow-y-auto h-[520px] custom-scrollbar">
            {/* Image Placeholder */}
            <div className="bg-gray-100 rounded-md w-[55%] mx-auto h-40 flex items-center justify-center mb-6 border border-gray-200">
              <FiImage className="text-gray-400" size={32} />
            </div>

            {/* Personal Details */}
            <div className="mb-6">
              <p className="font-semibold text-gray-800 text-base mb-2">Jason Henry Sousa</p>
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
    </div>
  );
};

export default Signature;
