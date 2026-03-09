import { TbPointFilled } from "react-icons/tb";
import callsentimenticon from "../../../assets/callsentimenticon.png"

const ContactInfoCallSentiment = () => {
  return (
    <div className="bg-white flex flex-col gap-2 shadow-2xl  px-3 py-4 rounded-md">
        <div className="flex   justify-between items-center">
            <div className='flex w-full items-center gap-2'>
                <img src={callsentimenticon} alt="callsentimenticon" className="w-4  object-contain" />
                <h1 className='text-gray-700 text-[15px] font-medium'>Call Sentiment</h1>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-green-500"><TbPointFilled/></span>
                <span className="text-green-500">Positive</span>
            </div>
            <div>

            </div>
        </div>
        <div className="bg-gray-200 flex flex-col gap-1 px-3 py-3 rounded-md">
            <h1 className="text-sm font-medium">AI Sidekick:</h1>
            <p className="text-sm text-gray-600 font-medium">Customer sounds open and cooperative.</p>
        </div>
    </div>
  )
}

export default ContactInfoCallSentiment