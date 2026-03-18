import { useState, useEffect, useRef } from "react";
import { FiChevronUp, FiChevronDown, FiUser, FiMail, FiHash } from "react-icons/fi";
import { Loader2, Check, X, Camera } from "lucide-react";
import "react-phone-number-input/style.css";
import { authClient } from "../../lib/auth-client";
import api from "../../lib/axios";
import toast from "react-hot-toast";

const AdminAccountSetting = () => {
  const { data: sessionData, refetch } = authClient.useSession();
  const [isPersonalInfoOpen, setPersonalInfoOpen] = useState(true);

  const [fullName, setFullName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isUpdatingName, setIsUpdatingName] = useState(false);

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  console.log(sessionData)

  useEffect(() => {
    if (sessionData?.user) {
      setFullName(sessionData.user.name || "");
      // Assuming phone might be in custom properties or not yet supported
      // setPhoneNumber((sessionData.user as any).phone || "");
    }
  }, [sessionData]);


  const handleNameUpdate = async () => {
    if (!fullName.trim() || fullName === sessionData?.user?.name) {
      setIsEditingName(false);
      return;
    }

    setIsUpdatingName(true);
    try {
      await authClient.updateUser({
        name: fullName
      });
      await refetch();
      toast.success("Name updated successfully");
      setIsEditingName(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to update name");
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (e.g., 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size too large (max 5MB)");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    setIsUploadingImage(true);
    try {
      // 1. Upload to our backend
      const { data } = await api.post("/user/profile-image", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (data.success && data.data.url) {
        // 2. Update user profile in BetterAuth
        await authClient.updateUser({
          image: data.data.url
        });
        await refetch();
        toast.success("Profile image updated");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to upload image");
    } finally {
      setIsUploadingImage(false);
    }
  };

  return (
    <section className="w-full pr-3 lg:pr-6 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-gray-900 dark:text-white text-2xl md:text-3xl font-bold">
              Account Settings
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your personal information and preferences</p>
          </div>
          {sessionData?.user && (
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg text-sm font-medium border border-green-100 dark:border-green-900/30">
              <Check size={16} />
              <span>Verified Account</span>
            </div>
          )}
        </header>

        <main className="space-y-6">
          {/* Personal Info Card */}
          <div className="bg-white dark:bg-slate-800 rounded-[24px] shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
            {/* Collapsible Header */}
            <button
              className="flex items-center justify-between w-full p-6 text-left hover:bg-gray-50/50 dark:hover:bg-slate-700/50 transition-colors"
              onClick={() => setPersonalInfoOpen(!isPersonalInfoOpen)}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-400/10 rounded-lg">
                  <FiUser className="text-yellow-600 dark:text-yellow-400 w-5 h-5" />
                </div>
                <h2 className="text-[20px] font-bold text-[#17181B] dark:text-white">
                  Personal Information
                </h2>
              </div>
              <div className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-all">
                {isPersonalInfoOpen ? <FiChevronUp size={20} className="text-gray-400" /> : <FiChevronDown size={20} className="text-gray-400" />}
              </div>
            </button>

            {isPersonalInfoOpen && (
              <div className="px-6 pb-8 space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
                {/* Profile Photo Section */}
                <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-gray-50/50 dark:bg-slate-900/20 border border-gray-100 dark:border-slate-700/50">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-md bg-white dark:bg-slate-700 flex items-center justify-center">
                      {sessionData?.user?.image ? (
                        <img
                          src={sessionData.user.image}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FiUser size={40} className="text-gray-300" />
                      )}
                    </div>
                    <button
                      onClick={handleImageClick}
                      className="absolute bottom-0 right-0 p-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded-full shadow-lg transition-transform active:scale-90"
                    >
                      {isUploadingImage ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      className="hidden"
                      accept="image/*"
                    />
                  </div>

                  <div className="text-center sm:text-left">
                    <h3 className="text-[18px] font-bold text-gray-900 dark:text-white">Profile Picture</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
                      Update your profile picture. JPG or PNG allowed, max 5MB.
                    </p>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={handleImageClick}
                        disabled={isUploadingImage}
                        className="text-sm font-semibold text-yellow-600 hover:text-yellow-700 dark:text-yellow-400"
                      >
                        Change Photo
                      </button>
                    </div>
                  </div>
                </div>

                {/* Form Fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <FiUser size={14} className="text-gray-400" />
                      Full Name
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          setIsEditingName(true);
                        }}
                        className={`w-full px-4 py-3 bg-white dark:bg-slate-900 border ${isEditingName ? 'border-yellow-400 ring-2 ring-yellow-400/10' : 'border-gray-200 dark:border-slate-700'} rounded-xl text-[15px] font-medium text-gray-900 dark:text-white outline-none transition-all placeholder:text-gray-400`}
                        placeholder="Your full name"
                      />
                      {isEditingName && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                          <button
                            onClick={handleNameUpdate}
                            disabled={isUpdatingName}
                            className="p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all shadow-sm"
                          >
                            {isUpdatingName ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                          </button>
                          <button
                            onClick={() => {
                              setFullName(sessionData?.user?.name || "");
                              setIsEditingName(false);
                            }}
                            className="p-1.5 bg-gray-100 dark:bg-slate-800 text-gray-500 rounded-lg hover:bg-gray-200 transition-all"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Email (Read Only) */}
                  <div className="space-y-2 opacity-80">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <FiMail size={14} className="text-gray-400" />
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={sessionData?.user?.email || ""}
                        readOnly
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700/50 rounded-xl text-[15px] font-medium text-gray-500 cursor-not-allowed outline-none"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300">
                        <FiHash size={16} />
                      </div>
                    </div>
                  </div>

                  {/* Contact Number */}
                  {/* <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <FiPhone size={14} className="text-gray-400" />
                        Contact Number
                    </label>
                    <div className="phone-input-container">
                        <PhoneInput
                            international
                            defaultCountry="US"
                            value={phoneNumber}
                            onChange={handlePhoneChange}
                            className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-[15px] font-medium outline-none transition-all"
                        />
                    </div>
                  </div> */}

                  {/* User Role */}
                  <div className="space-y-2 opacity-80">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <FiHash size={14} className="text-gray-400" />
                      Account Role
                    </label>
                    <input
                      type="text"
                      value={sessionData?.user?.role || "ADMIN"}
                      readOnly
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700/50 rounded-xl text-[15px] font-medium text-gray-500 cursor-not-allowed outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-slate-700 flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <p className="text-sm text-gray-500 italic">
                    * Email and Role are managed by the system administrator.
                  </p>
                  <button
                    className="w-full sm:w-auto px-6 py-2.5 bg-gray-900 dark:bg-slate-800 hover:bg-black dark:hover:bg-slate-700 text-white rounded-xl font-semibold transition-all shadow-sm active:scale-95"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <style>
        {`
            .phone-input-container .PhoneInputInput {
                border: none;
                background-color: transparent;
                font-weight: 500;
                color: #111827;
                outline: none;
                font-family: inherit;
            }
            .dark .phone-input-container .PhoneInputInput {
                color: white !important;
            }
            .PhoneInputCountryIcon {
                box-shadow: none !important;
                border: 0.5px solid #E5E7EB;
            }
            .dark .PhoneInputCountryIcon {
                border-color: #334155;
            }
        `}
      </style>
    </section>
  );
};

export default AdminAccountSetting;
