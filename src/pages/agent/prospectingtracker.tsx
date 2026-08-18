import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PeriodSelector } from "@/components/agent/prospecting/PeriodSelector";
import { DashboardTab } from "@/components/agent/prospecting/DashboardTab";
import { BusinessPlanTab } from "@/components/agent/prospecting/BusinessPlanTab";
import { ActivityLogTab } from "@/components/agent/prospecting/ActivityLogTab";
import type { DashboardPeriod } from "@/hooks/useTracker";

const ProspectingTracker = () => {
  const [period, setPeriod] = useState<DashboardPeriod>("this_month");

  return (
    <section className="w-full pb-6 min-h-full pr-3 lg:pr-6">
      <Tabs defaultValue="dashboard">
        <div className="flex flex-wrap justify-between items-start gap-3 mb-4">
          <div>
            <h1 className="text-[#0E1011] text-[20px] md:text-[26px] dark:text-white lg:text-[28px] font-medium">
              Prospecting Tracker
            </h1>
            <p className="text-sm text-muted-foreground">
              Business plan · targets derived on read, never stored
            </p>
          </div>
          <div className="flex items-center gap-3">
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="business-plan">Business plan</TabsTrigger>
              <TabsTrigger value="activity-log">Activity log</TabsTrigger>
            </TabsList>
            <PeriodSelector value={period} onChange={setPeriod} />
          </div>
        </div>

        <TabsContent value="dashboard">
          <DashboardTab period={period} />
        </TabsContent>
        <TabsContent value="business-plan">
          <BusinessPlanTab />
        </TabsContent>
        <TabsContent value="activity-log">
          <ActivityLogTab />
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default ProspectingTracker;
