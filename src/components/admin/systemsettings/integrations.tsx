import React, { useState } from 'react';
import { FiLoader, FiX } from 'react-icons/fi';
import stanppLogo from "../../../assets/stamnp.png";
import bombLogo from "../../../assets/bomb.png";
import { useIntegrations, type Integration } from '../../../hooks/useSystemSettings';
import toast from 'react-hot-toast';

interface IntegrationDef {
  id: string;
  name: string;
  description: string;
  logo: string;
  credentialFields: {
    name: string;
    label: string;
    type: string;
    placeholder: string;
  }[];
}

const INTEGRATION_DEFS: IntegrationDef[] = [
  {
    id: 'STANPP_DOT_COM',
    name: 'Stannp.com',
    description: 'Connect your Stannp.com account to send letters, postcards, and marketing mailers directly to your contacts from the dashboard.',
    logo: stanppLogo,
    credentialFields: [
      { name: 'apiKey', label: 'Stannp API Key', type: 'password', placeholder: 'Enter your private API key' },
      { name: 'senderName', label: 'Sender Name', type: 'text', placeholder: 'e.g. CallScout Team' }
    ]
  },
  {
    id: 'BOMB_BOMB',
    name: 'BombBomb',
    description: 'Connect your BombBomb account to send personalized video messages via SMS and Email.',
    logo: bombLogo,
    credentialFields: [
      { name: 'apiKey', label: 'BombBomb API Key', type: 'password', placeholder: 'Enter your API key' }
    ]
  }
];

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  integrationDef: IntegrationDef;
  onSave: (credentials: any) => void;
  loading: boolean;
}

interface ManageModalProps {
  isOpen: boolean;
  onClose: () => void;
  integration: Integration;
  integrationDef: IntegrationDef;
  onDisconnect: () => void;
  onSave: (credentials: any) => void;
  loading: boolean;
}

const ConnectModal: React.FC<ConnectModalProps> = ({ isOpen, onClose, integrationDef, onSave, loading }) => {
  const [credentials, setCredentials] = useState<any>({});

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(credentials);
    setCredentials({});
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-1200 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full p-8 relative border dark:border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
        >
          <FiX size={18} className="text-gray-600 dark:text-gray-300" />
        </button>

        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Connect {integrationDef.name}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 font-medium">
          Enter your credentials to enable {integrationDef.name} integration.
        </p>

        <div className="space-y-5 mb-8">
          {integrationDef.credentialFields.map((field) => (
            <div key={field.name}>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">{field.label}</label>
              <input
                type={field.type}
                value={credentials[field.name] || ''}
                onChange={(e) => setCredentials({ ...credentials, [field.name]: e.target.value })}
                placeholder={field.placeholder}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all text-sm"
              />
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 text-sm font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 rounded-xl hover:bg-gray-200 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading || Object.keys(credentials).length === 0}
            className="flex-2 py-3 text-sm font-bold text-black bg-yellow-400 hover:bg-yellow-500 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <FiLoader className="animate-spin" /> : 'Connect Integration'}
          </button>
        </div>
      </div>
    </div>
  );
};

const ManageModal: React.FC<ManageModalProps> = ({ isOpen, onClose, integration, integrationDef, onDisconnect, onSave, loading }) => {
  const [credentials, setCredentials] = useState<any>(integration.credentials || {});

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full p-8 relative border dark:border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
        >
          <FiX size={18} className="text-gray-600 dark:text-gray-300" />
        </button>

        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Manage {integrationDef.name}</h2>
        <div className="flex items-center gap-2 mb-8">
           <div className={`w-2 h-2 rounded-full ${integration.status === 'CONNECTED' ? 'bg-green-500' : 'bg-red-500'}`}></div>
           <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{integration.status}</span>
        </div>

        <div className="space-y-5 mb-8">
          {integrationDef.credentialFields.map((field) => (
            <div key={field.name}>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">{field.label}</label>
              <input
                type={field.type}
                value={credentials[field.name] || ''}
                onChange={(e) => setCredentials({ ...credentials, [field.name]: e.target.value })}
                placeholder={field.placeholder}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all text-sm"
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => onSave(credentials)}
            disabled={loading}
            className="w-full py-4 text-sm font-bold text-black bg-yellow-400 hover:bg-yellow-500 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            {loading ? <FiLoader className="animate-spin" /> : 'Update Settings'}
          </button>
          <button
            onClick={onDisconnect}
            className="w-full py-4 text-sm font-bold text-red-500 bg-red-50 dark:bg-red-900/10 rounded-xl hover:bg-red-100 transition-all"
          >
            Disconnect Integration
          </button>
        </div>
      </div>
    </div>
  );
};

const Integrations: React.FC = () => {
  const { data: serverIntegrations, isLoading, upsertIntegration, deleteIntegration } = useIntegrations();
  const [selectedDef, setSelectedDef] = useState<IntegrationDef | null>(null);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  const handleSave = async (credentials: any) => {
    if (!selectedDef) return;
    try {
      await upsertIntegration.mutateAsync({
        provider: selectedDef.id,
        credentials
      });
      toast.success(`${selectedDef.name} updated successfully!`);
      setIsConnectModalOpen(false);
      setIsManageModalOpen(false);
    } catch (error) {
       toast.error('Failed to save integration settings.');
    }
  };

  const handleDisconnect = async (integration: Integration) => {
    try {
      await deleteIntegration.mutateAsync(integration.id);
      toast.success('Integration disconnected.');
      setIsManageModalOpen(false);
    } catch (error) {
      toast.error('Failed to disconnect.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <FiLoader className="animate-spin text-yellow-400 text-3xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="space-y-6">
        {INTEGRATION_DEFS.map((def) => {
          const integration = serverIntegrations?.find(i => i.provider === def.id);
          
          return (
            <div key={def.id} className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-20 h-20 bg-gray-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center p-3 shrink-0">
                  <img src={def.logo} alt={def.name} className="w-full h-full object-contain" />
                </div>
                
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row items-center gap-3 mb-2">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white">{def.name}</h3>
                    {integration && (
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] font-black uppercase tracking-widest rounded-full">
                        Connected
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-lg">
                    {def.description}
                  </p>
                </div>

                <div className="flex flex-col items-center gap-3 sm:min-w-[150px]">
                  {integration ? (
                    <button
                      onClick={() => {
                        setSelectedDef(def);
                        setIsManageModalOpen(true);
                      }}
                      className="w-full px-6 py-3 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 transition-all text-sm"
                    >
                      Edit Settings
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedDef(def);
                        setIsConnectModalOpen(true);
                      }}
                      className="w-full px-6 py-3 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-500 transition-all shadow-lg hover:shadow-yellow-400/20 text-sm"
                    >
                      Connect {def.name}
                    </button>
                  )}
                  {!integration && <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Setup Required</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedDef && (
        <ConnectModal
          isOpen={isConnectModalOpen}
          onClose={() => setIsConnectModalOpen(false)}
          integrationDef={selectedDef}
          onSave={handleSave}
          loading={upsertIntegration.isPending}
        />
      )}

      {selectedDef && isManageModalOpen && (
        <ManageModal
          isOpen={isManageModalOpen}
          onClose={() => setIsManageModalOpen(false)}
          integration={serverIntegrations?.find(i => i.provider === selectedDef.id)!}
          integrationDef={selectedDef}
          onDisconnect={() => handleDisconnect(serverIntegrations?.find(i => i.provider === selectedDef.id)!)}
          onSave={handleSave}
          loading={upsertIntegration.isPending}
        />
      )}
    </div>
  );
};

export default Integrations;
