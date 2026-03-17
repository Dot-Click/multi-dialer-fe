import { useState, useEffect } from 'react';
import { Check, Loader2 } from 'lucide-react';
import emailIcon from '@/assets/emailIcon.png';
import bellIcon from '@/assets/bellIcon.png';
import { 
  subscribeToPush, 
  unsubscribeFromPush, 
  checkPushPermission, 
  requestPushPermission 
} from '@/utils/push-notification';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createCompanySetting } from '@/store/slices/companySettingSlice';
import Loader from '@/components/common/Loader';

/* ---------- Types ---------- */

type ToggleKey =
  | 'failedPayment'
  | 'renewalReminders'
  | 'criticalErrors';

type EmailKey =
  | 'newUser'
  | 'securityAlerts';

type ToggleProps = {
  active: boolean;
  onClick: () => void;
};

type CustomCheckboxProps = {
  active: boolean;
  onClick: () => void;
  label: string;
};

/* ---------- Component ---------- */

const NotificationSetting = () => {
  // State for Toggles
  const [toggles, setToggles] = useState<Record<ToggleKey, boolean>>({
    failedPayment: true,
    renewalReminders: true,
    criticalErrors: true,
  });

  // State for Checkboxes
  const [emails, setEmails] = useState<Record<EmailKey, boolean>>({
    newUser: false,
    securityAlerts: true,
  });

  const [recipientEmail, setRecipientEmail] = useState('');

  const [isUpdating, setIsUpdating] = useState<Record<ToggleKey, boolean>>({
    failedPayment: false,
    renewalReminders: false,
    criticalErrors: false,
  });

  const dispatch = useAppDispatch();
  const { loading: isCompanyLoading } = useAppSelector((state) => state.companySetting);

  useEffect(() => {
    const checkStatus = async () => {
      const permission = await checkPushPermission();
      if (permission === 'granted') {
        setToggles(prev => ({ ...prev, criticalErrors: true }));
      } else {
        setToggles(prev => ({ ...prev, criticalErrors: false }));
      }
    };
    checkStatus();
  }, []);

  const handleToggle = async (key: ToggleKey) => {
    if (key === 'criticalErrors') {
      setIsUpdating(prev => ({ ...prev, [key]: true }));
      
      const currentActive = toggles[key];
      
      try {
        if (!currentActive) {
          // Attempting to turn ON
          const permission = await requestPushPermission();
          if (!permission) {
            toast.error("Notification permission denied");
            setIsUpdating(prev => ({ ...prev, [key]: false }));
            return;
          }
          
          const success = await subscribeToPush(api);
          if (success) {
            setToggles(prev => ({ ...prev, [key]: true }));
            toast.success("Push notifications enabled");
          } else {
            toast.error("Failed to enable push notifications");
          }
        } else {
          // Attempting to turn OFF
          const success = await unsubscribeFromPush(api);
          if (success) {
            setToggles(prev => ({ ...prev, criticalErrors: false }));
            toast.success("Push notifications disabled");
          } else {
            toast.error("Failed to disable push notifications");
          }
        }
      } catch (err) {
        console.error(err);
        toast.error("An error occurred");
      } finally {
        setIsUpdating(prev => ({ ...prev, [key]: false }));
      }
    } else {
      setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const handleCheckbox = (key: EmailKey) => {
    setEmails((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    handleSaveEmailPreferences(); // Reuse the same logic since it sends all relevant fields
  };

  const handleSaveEmailPreferences = () => {
    const data = {
      email: recipientEmail,
      newUserSignup: emails.newUser,
      loginAlerts: emails.securityAlerts,
      notifyFailedPayment: toggles.failedPayment,
      notifyUpcomingRenewal: toggles.renewalReminders,
      notifyCriticalError: toggles.criticalErrors,
      companyName: "My Business", // Required as per example
    };

    console.log("Saving Email Preferences:", data);
    
    dispatch(createCompanySetting(data))
      .unwrap()
      .then((res) => {
        toast.success(res.message || "Settings updated successfully");
      })
      .catch((err) => {
        toast.error(err || "Failed to update settings");
      });
  };

  // Custom Toggle Component
  const Toggle = ({ active, onClick }: ToggleProps) => (
    <button
      onClick={onClick}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${active ? 'bg-[#030213]' : 'bg-[#DADBDB]'
        }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 ${active ? 'translate-x-[22px]' : 'translate-x-[2px]'
          }`}
      />
    </button>
  );

  // Custom Checkbox Component
  const CustomCheckbox = ({
    active,
    onClick,
    label,
  }: CustomCheckboxProps) => (
    <div
      className="flex items-center gap-5 cursor-pointer group"
      onClick={onClick}
    >
      <div
        className={`w-5 h-5 rounded-[2px] flex items-center justify-center transition-all border ${active
          ? 'bg-[#2B3034] border-[#333]'
          : 'bg-white border-gray-300'
          }`}
      >
        {active && (
          <Check className="text-white w-3.5 h-3.5" strokeWidth={2} />
        )}
      </div>
      <span className="text-[14px] work-sans font-[400] text-[#495057] group-hover:text-gray-800 transition-colors dark:text-white">
        {label}
      </span>
    </div>
  );

  const isEmailInputEnabled = emails.newUser || emails.securityAlerts;

  return (
    <div className="relative bg-white dark:bg-slate-800 p-4 work-sans md:px-8 md:py-[23px] rounded-[22px] shadow-sm w-full max-w-full mx-auto">
      {isCompanyLoading && <Loader />}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-[18px] font-[500] inter text-[#343434] dark:text-white">
          Notifications Settings
        </h2>
        <button 
          onClick={handleSave}
          className="bg-[#2B3034] text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-[#1a1e21] transition-colors"
        >
          Save
        </button>
      </div>

      {/* --- System Alerts Section --- */}
      <div className="mb-8">
        <div className="flex items-center gap-6 mb-8">
          <div className="bg-[#F4F4F5] p-1.5 rounded-lg">
            <img
              src={bellIcon}
              alt="bellIcon"
              className="h-[21.5] object-contain"
            />
          </div>
          <h3 className="font-[600] text-[18px] inter text-[#343434] dark:text-white">
            System Alerts
          </h3>
        </div>

        <div className="space-y-4">
          {/* <div className="flex items-center justify-between gap-4">
            <div>
              <h4 className="text-[14px] font-[500] text-[#34363B] dark:text-gray-400">
                Failed Payment Alerts
              </h4>
              <p className="text-xs md:text-[16px] font-[400] text-[#828291] dark:text-white">
                Notify when customer payments fail
              </p>
            </div>
            <Toggle
              active={toggles.failedPayment}
              onClick={() => handleToggle('failedPayment')}
            />
          </div> */}

          {/* <div className="flex items-center justify-between gap-4">
            <div>
              <h4 className="text-[14px] font-[500] text-[#34363B] dark:text-gray-400">
                Upcoming Renewal Reminders
              </h4>
              <p className="text-xs md:text-[16px] font-[400] text-[#828291] dark:text-white">
                Notify about scheduled maintenance
              </p>
            </div>
            <Toggle
              active={toggles.renewalReminders}
              onClick={() => handleToggle('renewalReminders')}
            />
          </div> */}



          <div className="flex items-center justify-between gap-4">
            <div>
              <h4 className="text-[14px] font-[500] text-[#34363B] dark:text-gray-400">
                Critical Error Alerts
              </h4>
              <p className="text-xs md:text-[16px] font-[400] text-[#828291] dark:text-white">
                Immediate notification for system errors
              </p>
            </div>
            {isUpdating.criticalErrors ? (
              <Loader2 className="w-5 h-5 animate-spin text-[#030213]" />
            ) : (
              <Toggle
                active={toggles.criticalErrors}
                onClick={() => handleToggle('criticalErrors')}
              />
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-[1px] bg-gray-100 w-full mb-8" />

      {/* --- Email Notification Preferences Section --- */}
      <div>
        <div className="flex items-center gap-6 mb-8">
          <div className="bg-[#F4F4F5] p-1.5 rounded-lg">
            <img
              src={emailIcon}
              alt="emailIcon"
              className="h-[18] object-contain"
            />
          </div>
          <h3 className="font-[600] text-[18px] inter text-[#34363B] dark:text-white">
            Email Notification Preferences
          </h3>
        </div>

        <div className="space-y-3.5 ml-3">
          <CustomCheckbox
            label="New user signups"
            active={emails.newUser}
            onClick={() => handleCheckbox('newUser')}
          />
          <CustomCheckbox
            label="Security and login alerts"
            active={emails.securityAlerts}
            onClick={() => handleCheckbox('securityAlerts')}
          />
        </div>

        {/* Send To Input Section */}
        <div className={`flex mt-6 items-center gap-4 transition-opacity duration-200 ${isEmailInputEnabled ? 'opacity-100' : 'opacity-50'}`}>
          <div className="flex flex-col gap-1">
            <label className="text-[14px] font-[500] text-[#34363B] dark:text-gray-400">
              Send To
            </label>
            <div className="flex items-center gap-3">
              <input
                type="email"
                placeholder="Enter email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                disabled={!isEmailInputEnabled}
                className={`w-48 px-0 py-1 border-b text-[13px] transition-all outline-none ${
                  isEmailInputEnabled 
                    ? 'border-b-gray-300 focus:border-[#2B3034] bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white' 
                    : 'border-b-gray-200 bg-gray-50 cursor-not-allowed dark:bg-slate-800 dark:border-slate-700'
                }`}
              />
              <button
                onClick={handleSaveEmailPreferences}
                disabled={!isEmailInputEnabled}
                className={`px-3 py-1 rounded text-[12px] font-medium transition-colors ${
                  isEmailInputEnabled
                    ? 'bg-[#FFCA06] text-black hover:bg-[#e6b605]'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSetting;
