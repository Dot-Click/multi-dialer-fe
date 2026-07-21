import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Box } from "@/components/ui/box";
import { useLeadStore } from "@/hooks/useLeadStore";
import type { LeadStoreSubscription } from "@/hooks/useLeadStore";

const StatusPill = ({ status }: { status: LeadStoreSubscription["status"] }) => {
  if (status === "ACTIVE") {
    return (
      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400">
        Active
      </span>
    );
  }
  return (
    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400">
      Pending Setup
    </span>
  );
};

const LeadStore = () => {
  const { services, subscriptions, isLoading, subscribe, cancel } = useLeadStore();

  const latestSubscriptionFor = (serviceId: string): LeadStoreSubscription | undefined => {
    const matches = subscriptions
      .filter((s) => s.serviceId === serviceId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return matches[0];
  };

  const handleSubscribe = (serviceId: string) => {
    subscribe.mutate(serviceId, {
      onSuccess: (data) => {
        if (data?.url) window.location.href = data.url;
      },
    });
  };

  return (
    <Box className="min-h-screen pr-10">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
        Lead Store
      </h1>

      {isLoading ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading…</p>
      ) : (
        <div className="space-y-4">
          {services.map((service) => {
            const activeSub = latestSubscriptionFor(service.id);
            const isLive = activeSub && activeSub.status !== "CANCELLED";

            return (
              <div
                key={service.id}
                className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm px-4 py-3"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                        {service.name}
                      </h2>
                      {isLive && <StatusPill status={activeSub!.status} />}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {service.description}
                    </p>
                  </div>
                  <ChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                </div>

                {/* Price + Button (LEFT ALIGNED) */}
                <div className="flex mt-3 flex-col items-start">
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      <span className="text-2xl">$</span>
                      {(service.price / 100).toFixed(0)}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      /per month
                    </span>
                  </div>

                  {isLive ? (
                    <Button
                      variant="outline"
                      disabled={cancel.isPending}
                      onClick={() => cancel.mutate(activeSub!.id)}
                      className="w-40"
                    >
                      Cancel
                    </Button>
                  ) : (
                    <Button
                      disabled={subscribe.isPending}
                      onClick={() => handleSubscribe(service.id)}
                      className="bg-yellow-400 w-40 hover:bg-yellow-500 text-gray-900 dark:text-black rounded-md px-6 py-2 text-sm font-medium"
                    >
                      Subscribe
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Box>
  );
};

export default LeadStore;
