import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLock } from 'react-icons/fi';

interface FeatureLockedOverlayProps {
  featureName: string;
  message?: string;
}

const FeatureLockedOverlay: React.FC<FeatureLockedOverlayProps> = ({ 
  featureName, 
  message = "Your trial has expired. Upgrade to continue using this feature." 
}) => {
  const navigate = useNavigate();

  return (
    <div className="absolute inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 backdrop-blur-md rounded-3xl animate-in fade-in duration-500">
      <div className="bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-700 max-w-md w-full text-center transform transition-all hover:scale-[1.02] duration-300">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 mb-6 shadow-lg shadow-yellow-500/20">
          <FiLock className="w-10 h-10 text-white" />
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
          {featureName} Locked
        </h2>
        
        <p className="text-gray-600 dark:text-slate-400 mb-8 leading-relaxed">
          {message}
        </p>
        
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate('/admin/upgrade')}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-orange-500/20 active:scale-95"
          >
            Upgrade Now
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 font-semibold py-4 px-6 rounded-2xl transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeatureLockedOverlay;
