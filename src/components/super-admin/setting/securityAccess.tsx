import { useState } from 'react';
import { Shield, ChevronDown } from 'lucide-react';

/* ---------- Types ---------- */

type ToggleKey =
  | 'requireSpecialChars'
  | 'requireNumbers'
  | 'requireUppercase'
  | 'sessionSpecialChars'
  | 'required2FA'
  | 'optional2FA';

type ToggleProps = {
  active: boolean;
  onClick: () => void;
};

type SettingsInputProps = {
  label: string;
  value: string;
  isSelect?: boolean;
};

/* ---------- Component ---------- */

const SecurityAccess = () => {
  // State for Toggles
  const [toggles, setToggles] = useState<Record<ToggleKey, boolean>>({
    requireSpecialChars: true,
    requireNumbers: true,
    requireUppercase: true,
    sessionSpecialChars: true,
    required2FA: true,
    optional2FA: true,
  });

  const handleToggle = (key: ToggleKey) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Shared Toggle Component
  const Toggle = ({ active, onClick }: ToggleProps) => (
    <button
      onClick={onClick}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
        active ? 'bg-[#030213]' : 'bg-[#DADBDB]'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 ${
          active ? 'translate-x-[22px]' : 'translate-x-[2px]'
        }`}
      />
    </button>
  );

  // Input Field Helper Component
  const SettingsInput = ({
    label,
    value,
    isSelect = false,
  }: SettingsInputProps) => (
    <div className="bg-[#F3F4F7] py-3 px-3 rounded-[12px] mb-4 work-sans w-full">
      <label className="text-[12px] font-[500] text-[#495057] block mb-0.5">
        {label}
      </label>
      <div className="flex justify-between items-center">
        <span className="text-[16px] font-[400] text-[#848C94] work-sans">
          {value}
        </span>
        {isSelect && <ChevronDown className="w-4 h-4 text-[#828291]" />}
      </div>
    </div>
  );

  return (
    <div className="bg-white p-4 work-sans md:px-8 md:py-[23px] rounded-[22px] shadow-sm w-full max-w-full mx-auto">
      <h2 className="text-[18px] font-[500] inter text-[#343434] mb-5">
        Security & Access
      </h2>

      {/* --- Password Policy Section --- */}
      <div className="mb-8">
        <div className="flex items-center gap-6 mb-5">
          <div className="bg-[#F4F4F5] p-2 rounded-lg">
            <Shield className="w-5 h-5 text-[#343434]" />
          </div>
          <h3 className="font-[600] text-[18px] inter text-[#343434]">
            Password Policy
          </h3>
        </div>

        <div className="space-y-2 mb-6">
          <SettingsInput label="Minimum Password Length" value="8 characters" />
          <SettingsInput
            label="Password Reset Frequency"
            value="Every 90 days"
          />
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h4 className="text-[14px] font-[500] text-[#34363B]">
                Require Special Characters
              </h4>
              <p className="text-xs md:text-[16px] font-[400] text-[#828291]">
                Password must include symbols (!@#$%^&*)
              </p>
            </div>
            <Toggle
              active={toggles.requireSpecialChars}
              onClick={() => handleToggle('requireSpecialChars')}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <h4 className="text-[14px] font-[500] text-[#34363B]">
                Require Numbers
              </h4>
              <p className="text-xs md:text-[16px] font-[400] text-[#828291]">
                Password must include numeric characters
              </p>
            </div>
            <Toggle
              active={toggles.requireNumbers}
              onClick={() => handleToggle('requireNumbers')}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <h4 className="text-[14px] font-[500] text-[#34363B]">
                Require Uppercase Letters
              </h4>
              <p className="text-xs md:text-[16px] font-[400] text-[#828291]">
                Password must include capital letters
              </p>
            </div>
            <Toggle
              active={toggles.requireUppercase}
              onClick={() => handleToggle('requireUppercase')}
            />
          </div>
        </div>
      </div>

      <div className="h-[1px] bg-gray-100 w-full mb-5" />

      {/* --- Session Management Section --- */}
      <div className="mb-8">
        <h3 className="font-[600] text-[18px] inter text-[#343434] mb-6 ml-1">
          Session Management
        </h3>

        <SettingsInput
          label="Session Timeout Duration"
          value="30 minutes"
          isSelect
        />

        <div className="flex items-center justify-between gap-4 mt-6">
          <div>
            <h4 className="text-[14px] font-[500] text-[#34363B]">
              Require Special Characters
            </h4>
            <p className="text-xs md:text-[16px] font-[400] text-[#828291]">
              Password must include symbols (!@#$%^&*)
            </p>
          </div>
          <Toggle
            active={toggles.sessionSpecialChars}
            onClick={() => handleToggle('sessionSpecialChars')}
          />
        </div>
      </div>

      <div className="h-[1px] bg-gray-100 w-full mb-5" />

      {/* --- Two-Factor Authentication Section --- */}
      <div>
        <h3 className="font-[600] text-[18px] inter text-[#343434] mb-6 ml-1">
          Two-Factor Authentication
        </h3>

        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h4 className="text-[14px] font-[500] text-[#34363B]">
                Required Two-Factor Authentication
              </h4>
              <p className="text-xs md:text-[16px] font-[400] text-[#828291]">
                Mandatory 2FA for all admin users
              </p>
            </div>
            <Toggle
              active={toggles.required2FA}
              onClick={() => handleToggle('required2FA')}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <h4 className="text-[14px] font-[500] text-[#34363B]">
                Allow Optional 2FA for Users
              </h4>
              <p className="text-xs md:text-[16px] font-[400] text-[#828291]">
                Let non-admin users enable 2FA
              </p>
            </div>
            <Toggle
              active={toggles.optional2FA}
              onClick={() => handleToggle('optional2FA')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityAccess;
