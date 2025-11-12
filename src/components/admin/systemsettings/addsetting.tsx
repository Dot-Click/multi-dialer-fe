import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddSetting: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    onHoldRecording1: '',
    onHoldRecording2: '',
    onHoldRecording3: '',
    answeringMachineRecording: '',
    enableAutoPause: false,
    enableRecording: false,
    sendScheduledAppointmentMail: false,
    makeCallsToDNC: 'No',
    callerId: 'CallScout ID',
    countryCode: '',
    numberOfLines: '',
    phoneRingTime: '',
    callScript: '',
    sendEmail: 'No',
    sendText: 'No',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    navigate('/admin/system-settings');
  };

  const handleCancel = () => {
    navigate('/admin/system-settings');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white ">
          {/* Header with Cancel and Save buttons */}
          <div className="flex bg-gray-100  justify-between items-center p-4 md:p-6 ">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Create Call Settings</h2>
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 text-sm font-medium text-black bg-yellow-400 hover:bg-yellow-500 rounded-lg transition-colors"
              >
                Save
              </button>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-4 md:p-6">
            <div className="space-y-6">
              {/* Name Field - Full Width */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter Name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-sm"
                />
              </div>

              {/* Voice Recordings Details - 2 Columns */}
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-4">Voice recordings Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      On-hold Recording 1
                    </label>
                    <select
                      name="onHoldRecording1"
                      value={formData.onHoldRecording1}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-sm bg-white appearance-none"
                    >
                      <option value="">Select</option>
                      <option value="recording1">Recording 1</option>
                      <option value="recording2">Recording 2</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      On-hold Recording 2
                    </label>
                    <select
                      name="onHoldRecording2"
                      value={formData.onHoldRecording2}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-sm bg-white appearance-none"
                    >
                      <option value="">Select</option>
                      <option value="recording1">Recording 1</option>
                      <option value="recording2">Recording 2</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      On-hold Recording 3
                    </label>
                    <select
                      name="onHoldRecording3"
                      value={formData.onHoldRecording3}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-sm bg-white appearance-none"
                    >
                      <option value="">Select</option>
                      <option value="recording1">Recording 1</option>
                      <option value="recording2">Recording 2</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Answering Machine Recordings
                    </label>
                    <select
                      name="answeringMachineRecording"
                      value={formData.answeringMachineRecording}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-sm bg-white appearance-none"
                    >
                      <option value="">Select</option>
                      <option value="recording1">Recording 1</option>
                      <option value="recording2">Recording 2</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* General Communication and Make Calls to DNC Numbers - Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* General Communication - Left Column */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-4">General Communication</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="enableAutoPause"
                        name="enableAutoPause"
                        checked={formData.enableAutoPause}
                        onChange={handleInputChange}
                        className="h-4 w-4 accent-black focus:ring-black border-gray-300 rounded cursor-pointer"
                      />
                      <label htmlFor="enableAutoPause" className="ml-3 text-sm text-gray-700 cursor-pointer">
                        Enable Auto Pause
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="enableRecording"
                        name="enableRecording"
                        checked={formData.enableRecording}
                        onChange={handleInputChange}
                        className="h-4 w-4 accent-black focus:ring-black border-gray-300 rounded cursor-pointer"
                      />
                      <label htmlFor="enableRecording" className="ml-3 text-sm text-gray-700 cursor-pointer">
                        Enable Recording
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="sendScheduledAppointmentMail"
                        name="sendScheduledAppointmentMail"
                        checked={formData.sendScheduledAppointmentMail}
                        onChange={handleInputChange}
                        className="h-4 w-4 accent-black focus:ring-black border-gray-300 rounded cursor-pointer"
                      />
                      <label htmlFor="sendScheduledAppointmentMail" className="ml-3 text-sm text-gray-700 cursor-pointer">
                        Send scheduled appointment mail in outlook format
                      </label>
                    </div>
                  </div>
                </div>

                {/* Make Calls to DNC Numbers - Right Column */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Make Calls to DNC Numbers
                  </label>
                  <div className="flex gap-6">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="dncNo"
                        name="makeCallsToDNC"
                        value="No"
                        checked={formData.makeCallsToDNC === 'No'}
                        onChange={() => handleRadioChange('makeCallsToDNC', 'No')}
                        className="h-4 w-4 accent-black focus:ring-black border-gray-300 cursor-pointer"
                      />
                      <label htmlFor="dncNo" className="ml-2 text-sm text-gray-700 cursor-pointer">
                        No
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="dncYes"
                        name="makeCallsToDNC"
                        value="Yes"
                        checked={formData.makeCallsToDNC === 'Yes'}
                        onChange={() => handleRadioChange('makeCallsToDNC', 'Yes')}
                        className="h-4 w-4 accent-black focus:ring-black border-gray-300 cursor-pointer"
                      />
                      <label htmlFor="dncYes" className="ml-2 text-sm text-gray-700 cursor-pointer">
                        Yes
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Caller ID and Country Code - Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Caller ID
                  </label>
                  <input
                    type="text"
                    name="callerId"
                    value={formData.callerId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country Code
                  </label>
                  <select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-sm bg-white appearance-none"
                  >
                    <option value="">Select</option>
                    <option value="+1">+1 (US/Canada)</option>
                    <option value="+44">+44 (UK)</option>
                    <option value="+91">+91 (India)</option>
                  </select>
                </div>
              </div>

              {/* No of Lines, Phone Ring Time, Call Script - Three Columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    No of Lines
                  </label>
                  <select
                    name="numberOfLines"
                    value={formData.numberOfLines}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-sm bg-white appearance-none"
                  >
                    <option value="">Select</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Ring Time
                  </label>
                  <select
                    name="phoneRingTime"
                    value={formData.phoneRingTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-sm bg-white appearance-none"
                  >
                    <option value="">Select</option>
                    <option value="15">15 seconds</option>
                    <option value="30">30 seconds</option>
                    <option value="45">45 seconds</option>
                    <option value="60">60 seconds</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Call Script
                  </label>
                  <select
                    name="callScript"
                    value={formData.callScript}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-sm bg-white appearance-none"
                  >
                    <option value="">Select</option>
                    <option value="script1">Script 1</option>
                    <option value="script2">Script 2</option>
                    <option value="script3">Script 3</option>
                  </select>
                </div>
              </div>

              {/* Send Email and Send Text - Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Send Email
                  </label>
                  <div className="flex gap-6">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="emailNo"
                        name="sendEmail"
                        value="No"
                        checked={formData.sendEmail === 'No'}
                        onChange={() => handleRadioChange('sendEmail', 'No')}
                        className="h-4 w-4 accent-black focus:ring-black border-gray-300 cursor-pointer"
                      />
                      <label htmlFor="emailNo" className="ml-2 text-sm text-gray-700 cursor-pointer">
                        No
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="emailYes"
                        name="sendEmail"
                        value="Yes"
                        checked={formData.sendEmail === 'Yes'}
                        onChange={() => handleRadioChange('sendEmail', 'Yes')}
                        className="h-4 w-4 accent-black focus:ring-black border-gray-300 cursor-pointer"
                      />
                      <label htmlFor="emailYes" className="ml-2 text-sm text-gray-700 cursor-pointer">
                        Yes
                      </label>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Send Text
                  </label>
                  <div className="flex gap-6">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="textNo"
                        name="sendText"
                        value="No"
                        checked={formData.sendText === 'No'}
                        onChange={() => handleRadioChange('sendText', 'No')}
                        className="h-4 w-4 accent-black focus:ring-black border-gray-300 cursor-pointer"
                      />
                      <label htmlFor="textNo" className="ml-2 text-sm text-gray-700 cursor-pointer">
                        No
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="textYes"
                        name="sendText"
                        value="Yes"
                        checked={formData.sendText === 'Yes'}
                        onChange={() => handleRadioChange('sendText', 'Yes')}
                        className="h-4 w-4 accent-black focus:ring-black border-gray-300 cursor-pointer"
                      />
                      <label htmlFor="textYes" className="ml-2 text-sm text-gray-700 cursor-pointer">
                        Yes
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSetting;
