import React from "react";
import { IoClose } from "react-icons/io5";

const EditModal = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="bg-white rounded-2xl w-full max-w-3xl p-6 shadow-xl">
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-3">
                    <h2 className="text-xl font-semibold text-gray-900">Edit</h2>
                    <button onClick={onClose}>
                        <IoClose className="text-2xl text-gray-600 hover:text-black" />
                    </button>
                </div>

                {/* Form Section */}
                <form className="mt-6 space-y-5 max-h-[75vh] overflow-y-auto">
                    <div className="bg-[#F3F4F7] flex flex-col gap-1 px-3 py-1.5 w-[50%] rounded-lg">
                        <label className="block  text-[#495057] font-medium text-[12px]">
                            Full Name
                        </label>
                        <input
                            type="text"
                            placeholder="Enter name"
                            className="w-full  placeholder:text-sm text-sm outline-none"
                        />
                    </div>

                    {/* Property Address */}
                    <div>
                        <h3 className="text-gray-800 font-medium mb-2">Property Address</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-[#F3F4F7] flex flex-col gap-1 px-3 py-1.5 w-full rounded-lg">
                                <label className="block  text-[#495057] font-medium text-[12px]">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter Lead's Address"
                                    className="w-full  placeholder:text-sm text-sm outline-none"
                                />
                            </div>


                            <div className="bg-[#F3F4F7] flex flex-col gap-1 px-3 py-1.5 w-full rounded-lg">
                                <label className="block  text-[#495057] font-medium text-[12px]">
                                    City
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter Lead's City"
                                    className="w-full  placeholder:text-sm text-sm outline-none"
                                />
                            </div>


                           <div className="bg-[#F3F4F7] flex flex-col gap-1 px-3 py-1.5 w-full rounded-lg">
                                <label className="block  text-[#495057] font-medium text-[12px]">
                                    State
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter Lead's State"
                                    className="w-full  placeholder:text-sm text-sm outline-none"
                                />
                            </div>


                          <div className="bg-[#F3F4F7] flex flex-col gap-1 px-3 py-1.5 w-full rounded-lg">
                                <label className="block  text-[#495057] font-medium text-[12px]">
                                    Zip
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter Lead's Zip"
                                    className="w-full  placeholder:text-sm text-sm outline-none"
                                />
                            </div>


                        </div>
                    </div>

                    {/* Mailing Address */}
                    <div>
                        <h3 className="text-gray-800 font-medium mb-2">Mailing Address</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-[#F3F4F7] flex flex-col gap-1 px-3 py-1.5 w-full rounded-lg">
                                <label className="block  text-[#495057] font-medium text-[12px]">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter Lead's Address"
                                    className="w-full  placeholder:text-sm text-sm outline-none"
                                />
                            </div>


                            <div className="bg-[#F3F4F7] flex flex-col gap-1 px-3 py-1.5 w-full rounded-lg">
                                <label className="block  text-[#495057] font-medium text-[12px]">
                                    City
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter Lead's City"
                                    className="w-full  placeholder:text-sm text-sm outline-none"
                                />
                            </div>


                           <div className="bg-[#F3F4F7] flex flex-col gap-1 px-3 py-1.5 w-full rounded-lg">
                                <label className="block  text-[#495057] font-medium text-[12px]">
                                    State
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter Lead's State"
                                    className="w-full  placeholder:text-sm text-sm outline-none"
                                />
                            </div>


                          <div className="bg-[#F3F4F7] flex flex-col gap-1 px-3 py-1.5 w-full rounded-lg">
                                <label className="block  text-[#495057] font-medium text-[12px]">
                                    Zip
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter Lead's Zip"
                                    className="w-full  placeholder:text-sm text-sm outline-none"
                                />
                            </div>

                        </div>
                    </div>
                </form>

                {/* Buttons */}
                <div className="flex justify-center  w-full items-center border-t gap-3 mt-6 pt-4">
                    <button
                        onClick={onClose}
                        className="bg-gray-100 w-1/2 hover:bg-gray-200 px-5 py-2 rounded-lg font-medium"
                    >
                        Cancel
                    </button>
                    <button className="bg-yellow-400 w-1/2 hover:bg-yellow-500 px-6 py-2 rounded-lg font-medium">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditModal;
