import React, { useState } from 'react';
import { FiLoader, FiX } from 'react-icons/fi';
import stanppLogo from "../../../assets/stamnp.png";
import { useIntegrations, type Integration } from '../../../hooks/useSystemSettings';
import toast from 'react-hot-toast';

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  integrationName: string;
  onSave: (credentials: { apiKey: string; senderName: string }) => void;
  loading: boolean;
}

interface ManageModalProps {
  isOpen: boolean;
  onClose: () => void;
  integration: Integration;
  onDisconnect: () => void;
  onSave: (credentials: { apiKey: string; senderName: string }) => void;
  loading: boolean;
}

const ConnectModal: React.FC<ConnectModalProps> = ({ isOpen, onClose, integrationName, onSave, loading }) => {
  const [apiKey, setApiKey] = useState('');
  const [senderName, setSenderName] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (apiKey.trim()) {
      onSave({ apiKey, senderName });
      setApiKey('');
      setSenderName('');
    }
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

        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Connect {integrationName}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 font-medium">
          Enter your Stannp credentials to enable Direct Mail campaigns.
        </p>

        <div className="space-y-5 mb-8">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">Stannp API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your private API key"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">Sender Name</label>
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="e.g. CallScout Team"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all text-sm"
            />
          </div>
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
            disabled={loading || !apiKey}
            className="flex-2 py-3 text-sm font-bold text-black bg-yellow-400 hover:bg-yellow-500 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <FiLoader className="animate-spin" /> : 'Connect Integration'}
          </button>
        </div>
      </div>
    </div>
  );
};

const ManageModal: React.FC<ManageModalProps> = ({ isOpen, onClose, integration, onDisconnect, onSave, loading }) => {
  const [apiKey, setApiKey] = useState(integration.credentials?.apiKey || '');
  const [senderName, setSenderName] = useState(integration.credentials?.senderName || '');

  if (!isOpen) return null;

  const handleSave = () => {
     onSave({ apiKey, senderName });
  };

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

        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Manage Stannp</h2>
        <div className="flex items-center gap-2 mb-8">
           <div className={`w-2 h-2 rounded-full ${integration.status === 'CONNECTED' ? 'bg-green-500' : 'bg-red-500'}`}></div>
           <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{integration.status}</span>
        </div>

        <div className="space-y-5 mb-8">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">Stannp API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">Sender Name</label>
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all text-sm"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleSave}
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
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  const stannp = serverIntegrations?.find(i => i.provider === 'STANPP_DOT_COM');

  const handleSave = async (credentials: any) => {
    try {
      await upsertIntegration.mutateAsync({
        provider: 'STANPP_DOT_COM',
        credentials
      });
      toast.success('Stannp integration updated successfully!');
      setIsConnectModalOpen(false);
      setIsManageModalOpen(false);
    } catch (error) {
       toast.error('Failed to save integration settings.');
    }
  };

  const handleDisconnect = async () => {
    if (!stannp) return;
    try {
      await deleteIntegration.mutateAsync(stannp.id);
      toast.success('Stannp disconnected.');
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
        {/* Stannp Integration Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-20 bg-gray-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center p-3 shrink-0">
              <img src={stanppLogo} alt="Stannp" className="w-full h-full object-contain" />
            </div>
            
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center gap-3 mb-2">
                <h3 className="text-xl font-black text-gray-900 dark:text-white">Stannp.com</h3>
                {stannp && (
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] font-black uppercase tracking-widest rounded-full">
                    Connected
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-lg">
                Connect your Stannp.com account to send letters, postcards, and marketing mailers directly to your contacts from the dashboard.
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 sm:min-w-[150px]">
              {stannp ? (
                <button
                  onClick={() => {
                    // setSelectedIntegration(stannp);
                    setIsManageModalOpen(true);
                  }}
                  className="w-full px-6 py-3 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 transition-all text-sm"
                >
                  Edit Settings
                </button>
              ) : (
                <button
                  onClick={() => setIsConnectModalOpen(true)}
                  className="w-full px-6 py-3 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-500 transition-all shadow-lg hover:shadow-yellow-400/20 text-sm"
                >
                  Connect Stannp
                </button>
              )}
              {!stannp && <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Setup Required</span>}
            </div>
          </div>
        </div>
      </div>

      <ConnectModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        integrationName="Stannp.com"
        onSave={handleSave}
        loading={upsertIntegration.isPending}
      />

      {stannp && (
        <ManageModal
          isOpen={isManageModalOpen}
          onClose={() => setIsManageModalOpen(false)}
          integration={stannp}
          onDisconnect={handleDisconnect}
          onSave={handleSave}
          loading={upsertIntegration.isPending}
        />
      )}
    </div>
  );
};

export default Integrations;
