import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "@/components/admin/common/adminsidebar";
import AdminNavbar from "@/components/admin/common/adminnavbar";
import { useAppSelector } from "@/store/hooks";
import { useAccessStatus } from "@/hooks/useAccessStatus";
import FeatureLockedOverlay from "@/components/common/FeatureLockedOverlay";

const AdminDashboardLayout = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { session } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const { data: accessStatus } = useAccessStatus();

  // Billing must always stay reachable — it's the only way a locked account
  // can pay and unlock itself again.
  const isBillingPage = location.pathname.startsWith("/admin/billing");
  const isLocked = !!accessStatus?.locked && !isBillingPage;

  return (
    <div className="    min-h-screen w-full relative">
      {/* agent pages  */}
      <div className="fixed top-0 z-1000">
        <AdminSidebar
          session={session}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          isMobile={isMobile}
          setIsMobile={setIsMobile}
        />
      </div>
      <div className="fixed z-999 top-0 w-full">
        <AdminNavbar />
      </div>

      <div
        className={`absolute top-16 pt-4 min-h-full  bg-[#F7F7F7] dark:bg-slate-900 w-full   transition-all duration-300
                     ${isMobile ? "pl-4" : isOpen ? "pl-72" : "pl-20"} `}
      >
        {isLocked ? (
          <div className="relative min-h-screen w-full">
            <Outlet />
            <FeatureLockedOverlay
              featureName="Dialer Access"
              canPurchase={accessStatus?.canPurchase}
              message="Your account has no active subscription. Please subscribe to a plan to continue using the dialer."
            />
          </div>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
