// Step 1: Import the desired icon from the react-icons library
import { IoChevronDown } from 'react-icons/io5';

const SendEmailContactInfo = () => {
    return (
        <div className="">

            {/* Header: Title and Template Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-20 mb-6">
                <h2 className="text-sm font-semibold text-gray-700 flex-shrink-0">
                    Send Email
                </h2>

                <div className="relative w-full sm:w-auto sm:min-w-[200px]">
                    {/* The `appearance-none` class hides the default browser dropdown arrow */}
                    <select
                        className="w-full  text-sm bg-transparent border-b border-gray-300 text-gray-600 py-1 pl-1 pr-8 appearance-none focus:outline-none focus:border-gray-500 transition cursor-pointer"
                        defaultValue=""
                    >
                        <option value="" disabled>Select Text Template</option>
                        <option value="template1">Template 1: Welcome Message</option>
                        <option value="template2">Template 2: Follow-up</option>
                        <option value="template3">Template 3: Special Promotion</option>
                    </select>

                    {/* Step 2: Use the imported React Icon component */}
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <IoChevronDown className="h-5 w-5 text-gray-500" />
                    </div>
                </div>
            </div>

            {/* Textarea for message input */}
            <div className="mb-8 flex flex-col gap-3">
                <div className="relative bg-gray-100 rounded-lg px-4 py-2 ">
                    {/* Floating Label */}
                    <label className="absolute top-2 left-4 text-xs font-medium text-gray-700">
                        Subject
                    </label>
                    {/* Textarea Input Field */}
                    <input
                        className="w-full text-sm bg-transparent text-gray-800 placeholder-gray-400 pt-5 resize-none focus:outline-none"
                        placeholder="Type here.."
                    />
                </div>
                <div className="relative bg-gray-100 rounded-lg px-4 py-3 h-36">
                    {/* Floating Label */}
                    <label className="absolute top-2 left-4 text-xs font-medium text-gray-700">
                        Text
                    </label>
                    {/* Textarea Input Field */}
                    <textarea
                        className="w-full h-full text-sm bg-transparent text-gray-800 placeholder-gray-400 pt-5 resize-none focus:outline-none"
                        placeholder="Type or Select a Template..."
                    ></textarea>
                </div>
            </div>

            {/* Send Button */}
            <div className="flex justify-end">
                <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-5 rounded-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
                    Send
                </button>
            </div>

        </div>
    );
};

export default SendEmailContactInfo;