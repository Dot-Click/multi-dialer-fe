

// const SMS = () => {
//     return (
//         <div className='flex gap-6 flex-col min-h-40'>
//             <h1 className='test-[#0E1011] text-[18px] font-[500]'>SMS:</h1>

//             <div className='flex justify-center items-center mt-[20px] w-full text-center md:w-[50%]  flex-col'>
//                 <h1 className='text-[#000000] text-[14px] font-[500]'>No Data Available</h1>
//                 <p className='text-[#848C94] text-[14px] font-[400]'>There have been no SMS sent to this contact</p>

//             </div>
//         </div>
//     )
// }

// export default SMS

const SMS = () => {
const messageHistory = [
{
id: 1,
text: "Hi John, just checking in on our previous conversation.",
date: "Sent January 10, 2026",
},
{
id: 2,
text: "Thank you for your time today!",
date: "Sent January 8, 2026",
},
];
return (
<div className="w-full min-h-screen bg-white p-4 md:p-8 font-sans">
<div className="w-full max-w-full">
{/* Header */}
<h2 className="text-[#0E1011] text-[18px] font-semibold mb-10">
SMS Messaging
</h2>

{/* Input Form Section */}
    <div className="space-y-10 mb-6">
      {/* SMS Templates Input */}
      <div className="w-full">
        <label className="block text-[#0E1011] text-[14px] font-medium mb-1">
          SMS Templates
        </label>
        <div className="border-b border-[#E5E7EB] w-full">
          <input
            type="text"
            className="w-full bg-transparent outline-none py-2 text-[15px] placeholder:text-gray-300"
            placeholder=""
          />
        </div>
      </div>

      {/* Message Input */}
      <div className="w-full">
        <label className="block text-[#0E1011] text-[14px] font-medium mb-1">
          Message
        </label>
        <div className="border-b border-[#E5E7EB] w-full">
          <textarea
            className="w-full bg-transparent outline-none py-2 text-[15px] resize-none min-h-[40px]"
            rows={1}
          />
        </div>
      </div>
    </div>

    {/* Send SMS Button */}
    <button className="w-full bg-[#FECD56] cursor-pointer  transition-all duration-200 rounded-lg py-3.5 flex items-center justify-center gap-3 mb-10 shadow-sm mt-4">
      {/* Paper Plane Icon matches the design tilt */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transform -rotate-12"
      >
        <path
          d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2"
          stroke="#0E1011"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-[#0E1011] text-[15px] font-semibold">Send SMS</span>
    </button>

    {/* Message History Feed */}
    <div className="space-y-2">
      {messageHistory.map((msg) => (
        <div
          key={msg.id}
          className="bg-[#F3F4F6] py-3 px-4 rounded-xl transition-all"
        >
          <p className="text-[#0E1011] text-[16px] font-medium leading-relaxed">
            {msg.text}
          </p>
          <p className="text-[#848C94] text-[13px] mt-2 font-normal">
            {msg.date}
          </p>
        </div>
      ))}
    </div>
  </div>
</div>
);
};
export default SMS;