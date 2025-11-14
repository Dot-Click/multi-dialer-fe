import React, { useState } from 'react';
import { FiLoader, FiX } from 'react-icons/fi';
import { BsCheckCircle, BsXCircle, BsExclamationTriangle } from 'react-icons/bs';

interface Integration {
  id: string;
  name: string;
  description: string;
  status: 'na' | 'processing' | 'connected' | 'failed' | 'setup';
  buttonText: 'Connect' | 'Manage';
  icon: React.ReactNode;
  apiKey?: string;
}

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  integrationName: string;
  onSave: (apiKey: string) => void;
}

interface ManageModalProps {
  isOpen: boolean;
  onClose: () => void;
  integration: Integration;
  onDisconnect: () => void;
  onSave: (apiKey: string) => void;
}

const ConnectModal: React.FC<ConnectModalProps> = ({ isOpen, onClose, integrationName, onSave }) => {
  const [apiKey, setApiKey] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (apiKey.trim()) {
      onSave(apiKey);
      setApiKey('');
      onClose();
    }
  };

  return (
    <div 
       className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-[1200] p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <FiX size={18} className="text-gray-600" />
        </button>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-4 pr-8">Connect {integrationName}</h2>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-6">
          Enter your API key or credentials for {integrationName} integration.
        </p>

        {/* API Key Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-900 mb-2">API Key</label>
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter API key"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-sm bg-gray-50"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-black bg-yellow-400 hover:bg-yellow-500 rounded-md transition-colors"
          >
            Save & Connect
          </button>
        </div>
      </div>
    </div>
  );
};

const ManageModal: React.FC<ManageModalProps> = ({ isOpen, onClose, integration, onDisconnect, onSave }) => {
  const [apiKey, setApiKey] = useState(integration.apiKey || '************************************');

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(apiKey);
    onClose();
  };

  const handleDisconnect = () => {
    onDisconnect();
    onClose();
  };

  const getStatusColor = () => {
    switch (integration.status) {
      case 'connected':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      case 'processing':
        return 'text-blue-500';
      case 'setup':
        return 'text-orange-500';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusText = () => {
    switch (integration.status) {
      case 'connected':
        return 'Connected';
      case 'failed':
        return 'Connection failed';
      case 'processing':
        return 'Processing...';
      case 'setup':
        return 'Need setup';
      default:
        return 'N/A';
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 bg-opacity-30 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <FiX size={18} className="text-gray-600" />
        </button>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-6 pr-8">Manage {integration.name} Integration</h2>

        {/* Status Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-900 mb-2">Status</label>
          <p className={`text-sm font-bold ${getStatusColor()}`}>{getStatusText()}</p>
        </div>

        {/* API Key Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-900 mb-2">API Key</label>
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-sm bg-gray-50"
            readOnly={integration.status === 'connected'}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleDisconnect}
            className="flex-1 px-4 py-2 text-sm font-medium text-black bg-red-100 hover:bg-red-200 rounded-md transition-colors"
          >
            Disconnect
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 text-sm font-medium text-black bg-yellow-400 hover:bg-yellow-500 rounded-md transition-colors"
          >
            Save & Connect
          </button>
        </div>
      </div>
    </div>
  );
};

const Integrations: React.FC = () => {
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'twilio',
      name: 'Twilio',
      description: 'Connect Twilio for calls, SMS, and number management.',
      status: 'na',
      buttonText: 'Connect',
      icon: (
        <div className="w-10 h-10 bg-red-600 rounded flex items-center justify-center">
          <div className="grid grid-cols-2 gap-0.5 p-0.5">
            <div className="w-3 h-3 bg-white rounded-sm"></div>
            <div className="w-3 h-3 bg-white rounded-sm"></div>
            <div className="w-3 h-3 bg-white rounded-sm"></div>
            <div className="w-3 h-3 bg-white rounded-sm"></div>
          </div>
        </div>
      ),
    },
    {
      id: 'google-maps',
      name: 'Google Maps',
      description: 'Use Google Maps and Street View for maps and addresses.',
      status: 'processing',
      buttonText: 'Manage',
      apiKey: '************************************',
      icon: (
        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
          <div className="w-4 h-4 bg-white rounded-full"></div>
        </div>
      ),
    },
    {
      id: 'realtor',
      name: 'Realtor.com',
      description: 'Connect Realtor.com for property data.',
      status: 'connected',
      buttonText: 'Manage',
      apiKey: '************************************',
      icon: (
        <div className="w-10 h-10 bg-red-600 rounded flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
        </div>
      ),
    },
    {
      id: 'bombbomb',
      name: 'BombBomb',
      description: 'Use BombBomb for video messages.',
      status: 'failed',
      buttonText: 'Manage',
      icon: (
        <div className="w-10 h-10 bg-black rounded flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M12 4v8l6 3" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        </div>
      ),
    },
    {
      id: 'gmail',
      name: 'Gmail',
      description: 'Connect Gmail to send emails through CallScout.',
      status: 'setup',
      buttonText: 'Manage',
      icon: (
        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded flex items-center justify-center">
          <span className="text-white font-bold text-lg">M</span>
        </div>
      ),
    },
    {
      id: 'stanpp',
      name: 'Stanpp.com',
      description: 'Connect Stanpp.com for direct mail.',
      status: 'connected',
      buttonText: 'Manage',
      apiKey: '************************************',
      icon: (
        <div className="w-10 h-10 border-2 border-red-600 rounded flex items-center justify-center">
          <div className="w-4 h-4 border border-white bg-white"></div>
        </div>
      ),
    },
    {
      id: 'myplusleads',
      name: 'MyPlusLeads',
      description: 'Use MyPlusLeads for daily lead imports.',
      status: 'connected',
      buttonText: 'Manage',
      apiKey: '************************************',
      icon: (
        <div className="w-10 h-10 bg-red-600 rounded flex items-center justify-center">
          <span className="text-white font-bold text-xl">+</span>
        </div>
      ),
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Integrate with HubSpot, Lofty, Salesforce, and others.',
      status: 'na',
      buttonText: 'Connect',
      icon: (
        <div className="w-10 h-10 bg-orange-500 rounded flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
      ),
    },
  ]);

  const getStatusDisplay = (status: Integration['status']) => {
    switch (status) {
      case 'na':
        return { text: 'N/A', color: 'text-gray-400', icon: null };
      case 'processing':
        return {
          text: 'Processing...',
          color: 'text-blue-500',
          icon: <FiLoader className="animate-spin" size={14} />,
        };
      case 'connected':
        return { text: 'Connected', color: 'text-green-600', icon: <BsCheckCircle size={14} /> };
      case 'failed':
        return { text: 'Connection failed', color: 'text-red-600', icon: <BsXCircle size={14} /> };
      case 'setup':
        return {
          text: 'Need setup',
          color: 'text-orange-500',
          icon: <BsExclamationTriangle size={14} />,
        };
      default:
        return { text: 'N/A', color: 'text-gray-400', icon: null };
    }
  };

  const handleConnect = (integration: Integration) => {
    setSelectedIntegration(integration);
    setIsConnectModalOpen(true);
  };

  const handleManage = (integration: Integration) => {
    setSelectedIntegration(integration);
    setIsManageModalOpen(true);
  };

  const handleSaveConnect = (apiKey: string) => {
    if (selectedIntegration) {
      setIntegrations((prev) =>
        prev.map((int) =>
          int.id === selectedIntegration.id
            ? { ...int, status: 'connected' as const, buttonText: 'Manage' as const, apiKey }
            : int
        )
      );
    }
  };

  const handleSaveManage = (apiKey: string) => {
    if (selectedIntegration) {
      setIntegrations((prev) =>
        prev.map((int) =>
          int.id === selectedIntegration.id ? { ...int, apiKey } : int
        )
      );
    }
  };

  const handleDisconnect = () => {
    if (selectedIntegration) {
      setIntegrations((prev) =>
        prev.map((int) =>
          int.id === selectedIntegration.id
            ? { ...int, status: 'na' as const, buttonText: 'Connect' as const, apiKey: undefined }
            : int
        )
      );
    }
  };

  return (
    <>
      <div className="min-h-screen">
        <div className="space-y-4">
          {integrations.map((integration) => {
            const statusDisplay = getStatusDisplay(integration.status);
            const isConnectButton = integration.buttonText === 'Connect';

            return (
              <div
                key={integration.id}
                className="bg-white rounded-lg px-4 py-3 border border-gray-200 hover:shadow-sm transition-shadow"
              >
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 flex-shrink-0">

                  {/* Left Side: Icon, Name, Description */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="flex-shrink-0">{integration.icon}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 mb-1">{integration.name}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{integration.description}</p>
                    </div>
                  </div>

                  {/* Right Side: Status and Button */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 flex-shrink-0">
                    <div className={`flex items-center gap-2 ${statusDisplay.color}`}>
                      {statusDisplay.icon}
                      <span className="text-sm font-medium whitespace-nowrap">{statusDisplay.text}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => (isConnectButton ? handleConnect(integration) : handleManage(integration))}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                        isConnectButton
                          ? 'bg-yellow-400 text-black hover:bg-yellow-500'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {integration.buttonText}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Connect Modal */}
      {selectedIntegration && (
        <ConnectModal
          isOpen={isConnectModalOpen}
          onClose={() => {
            setIsConnectModalOpen(false);
            setSelectedIntegration(null);
          }}
          integrationName={selectedIntegration.name}
          onSave={handleSaveConnect}
        />
      )}

      {/* Manage Modal */}
      {selectedIntegration && (
        <ManageModal
          isOpen={isManageModalOpen}
          onClose={() => {
            setIsManageModalOpen(false);
            setSelectedIntegration(null);
          }}
          integration={selectedIntegration}
          onDisconnect={handleDisconnect}
          onSave={handleSaveManage}
        />
      )}
    </>
  );
};

export default Integrations;
