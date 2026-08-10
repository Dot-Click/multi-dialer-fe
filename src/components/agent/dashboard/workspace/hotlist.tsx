import { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";
import api from "@/lib/axios";
import dayjs from "dayjs";

interface HotlistContact {
  id: string;
  fullName: string;
  phone: string | null;
  markedAt: string;
  markedBy: string | null;
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
    <section className="bg-white dark:bg-slate-800 flex h-fit md:h-[35vh] lg:h-[50vh] flex-col gap-3 rounded-[32px] px-[24px] pt-[24px] pb-[32px] lg:w-[45%] w-full shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[20px] text-yellow-500 font-bold">
            Hotlist
          </h1>
          <p className="text-[11px] font-bold text-black mt-0.5">
            Marked as Lead today
          </p>
        </div>
        <Link
          to="/data-dialer"
          className="flex gap-1 text-black items-center"
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
            <p className="text-[13px] text-black">
              No leads marked yet today.
            </p>
            <p className="text-[11px] text-black">
              Contacts appear here as soon as they're marked as a Lead.
            </p>
          </div>
        ) : (
          contacts.map((cont, idx) => (
            <Link
              key={cont.id}
              to={`/data-dialer/contact-detail/${cont.id}`}
              className="flex mx-1 rounded-lg border gap-0 items-center border-[#F3F4F7] dark:border-slate-700 hover:border-orange-200 dark:hover:border-orange-900/50 transition-colors duration-150"
            >
              {/* Rank badge */}
              <div className="bg-[#FFF7DB] dark:bg-orange-900/30 rounded-l-lg text-[#D66400] dark:text-orange-400 flex flex-col items-center justify-center px-3 py-3 min-w-[52px]">
                <span className="text-[13px] font-bold">#{idx + 1}</span>
                <span className="text-[9px] font-medium leading-tight text-center mt-0.5 tabular-nums">
                  {dayjs(cont.markedAt).format("h:mm A")}
                </span>
              </div>

              {/* Contact info */}
              <div className="flex justify-between w-full pr-3 pl-3 items-center">
                <div>
                  <h1 className="text-[14px] font-[500] text-[#000000] dark:text-white leading-tight">
                    {cont.fullName}
                  </h1>
                  <p className="text-[12px] font-[400] text-black tabular-nums">
                    {cont.phone ?? "No phone"}
                  </p>
                </div>

                {cont.markedBy && (
                  <span className="text-[10px] text-black text-right">
                    by {cont.markedBy}
                  </span>
                )}
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
};

export default HotList;
