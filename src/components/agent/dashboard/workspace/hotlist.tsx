import { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";
import api from "@/lib/axios";

interface HotlistContact {
  id: string;
  fullName: string;
  phone: string | null;
  totalDialingTime: number; // seconds
  avgConfidence: number;
  sentiment: string;
}

function formatSeconds(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function SentimentBadge({ sentiment }: { sentiment: string }) {
  const colors: Record<string, string> = {
    positive: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    neutral: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    negative: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  };
  return (
    <span
      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
        colors[sentiment] ?? colors.neutral
      }`}
    >
      {sentiment}
    </span>
  );
}

const HotList = () => {
  const [contacts, setContacts] = useState<HotlistContact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotlist = async () => {
      try {
        const res = await api.get("/contact/hotlist");
        setContacts(res.data?.data ?? []);
      } catch (err) {
        console.error("Failed to fetch hotlist", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotlist();
  }, []);

  return (
    <section className="bg-white dark:bg-slate-800 flex h-fit md:h-[35vh] lg:h-[50vh] flex-col gap-3 rounded-[32px] px-[24px] pt-[24px] pb-[32px] lg:w-[45%] w-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[20px] dark:text-white text-[#000000] font-[500]">
            Hotlist
          </h1>
          <p className="text-[11px] text-[#6c757d] dark:text-gray-400 mt-0.5">
            Top contacts by dialing time
          </p>
        </div>
        <Link
          to="/data-dialer"
          className="flex gap-1 dark:text-gray-300 dark:hover:text-white text-[#2B3034] items-center"
        >
          <span className="text-[14px] font-[500]">See all</span>
          <span>
            <IoIosArrowForward className="text-[16px]" />
          </span>
        </Link>
      </div>

      <div className="flex flex-col gap-2 overflow-auto custom-scrollbar">
        {loading ? (
          /* Skeleton loaders */
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex mx-1 rounded-lg border gap-2 items-center border-[#F3F4F7] dark:border-slate-700 animate-pulse"
            >
              <div className="bg-gray-200 dark:bg-slate-700 rounded-l-lg w-14 h-14" />
              <div className="flex flex-col gap-1.5 py-2 flex-1 pr-3">
                <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-3/5" />
                <div className="h-2.5 bg-gray-200 dark:bg-slate-700 rounded w-2/5" />
              </div>
            </div>
          ))
        ) : contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-8 gap-2 text-center">
            <span className="text-3xl">📋</span>
            <p className="text-[13px] text-[#6c757d] dark:text-gray-400">
              No hotlist data yet.
            </p>
            <p className="text-[11px] text-[#adb5bd] dark:text-gray-500">
              Data appears after contacts are called.
            </p>
          </div>
        ) : (
          contacts.map((cont, idx) => (
            <div
              key={cont.id}
              className="flex mx-1 rounded-lg border gap-0 items-center border-[#F3F4F7] dark:border-slate-700 hover:border-orange-200 dark:hover:border-orange-900/50 transition-colors duration-150"
            >
              {/* Rank / Dialing time badge */}
              <div className="bg-[#FFF7DB] dark:bg-orange-900/30 rounded-l-lg text-[#D66400] dark:text-orange-400 flex flex-col items-center justify-center px-3 py-3 min-w-[52px]">
                <span className="text-[13px] font-bold">#{idx + 1}</span>
                <span className="text-[9px] font-medium leading-tight text-center mt-0.5">
                  {formatSeconds(cont.totalDialingTime)}
                </span>
              </div>

              {/* Contact info */}
              <div className="flex justify-between w-full pr-3 pl-3 items-center">
                <div>
                  <h1 className="text-[14px] font-[500] text-[#000000] dark:text-white leading-tight">
                    {cont.fullName}
                  </h1>
                  <p className="text-[12px] font-[400] text-[#495057] dark:text-gray-400">
                    {cont.phone ?? "No phone"}
                  </p>
                </div>

                {/* Confidence + Sentiment */}
                <div className="flex flex-col items-end gap-1">
                  <SentimentBadge sentiment={cont.sentiment} />
                  <span className="text-[10px] text-[#6c757d] dark:text-gray-400">
                    {Math.round(cont.avgConfidence * 100)}% conf.
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default HotList;