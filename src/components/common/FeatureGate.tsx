import React from 'react';
import { useAccessStatus } from '@/hooks/useAccessStatus';
import FeatureLockedOverlay from './FeatureLockedOverlay';

interface FeatureGateProps {
  /** Human-readable name of the feature/tab being gated (shown in the lock card). */
  featureName: string;
  children: React.ReactNode;
}

/**
 * Wraps a route/page and overlays a subscription lock when the account's access
 * is locked (trial expired + no active subscription). Renders children normally
 * while loading or when unlocked, so there's no flash of the lock screen.
 */
const FeatureGate: React.FC<FeatureGateProps> = ({ featureName, children }) => {
  const { data } = useAccessStatus();

  if (!data?.locked) {
    return <>{children}</>;
  }

  return (
    <div className="relative min-h-screen w-full">
      {children}
      <FeatureLockedOverlay featureName={featureName} canPurchase={data.canPurchase} />
    </div>
  );
};

export default FeatureGate;
