import { useState } from "react";
import Sidebar from "@/components/agent/common/sidebar";
import Navbar from "@/components/agent/common/navbar";
import { Outlet } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { useAccessStatus } from "@/hooks/useAccessStatus";
import FeatureLockedOverlay from "@/components/common/FeatureLockedOverlay";

const DashboardLayout = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { session } = useAppSelector((state) => state.auth);
  const { data: accessStatus } = useAccessStatus();
  const isLocked = !!accessStatus?.locked;

  return (
    <div className="min-h-screen w-full relative">
      {/* agent pages  */}
      <div className="fixed top-0 z-1000">
        <Sidebar
          session={session}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          isMobile={isMobile}
          setIsMobile={setIsMobile}
        />
      </div>
      <div className="fixed z-999 top-0 w-full">
        <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>

      <div
        className={`absolute top-16 pt-4 min-h-full bg-[#F7F7F7] dark:bg-slate-900 w-full   transition-all duration-300
                     ${isMobile ? "pl-4" : isOpen ? "pl-72" : "pl-20"} `}
      >
        {isLocked ? (
          <div className="relative min-h-screen w-full">
            <Outlet />
            <FeatureLockedOverlay
              featureName="Dialer Access"
              canPurchase={accessStatus?.canPurchase}
              message="Your account subscription has expired. Please contact your account admin to renew the subscription and restore access."
            />
          </div>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
};

export default DashboardLayout;
