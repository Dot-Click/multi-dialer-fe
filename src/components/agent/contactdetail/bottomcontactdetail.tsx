import { useEffect, useRef, useState } from "react";
import Notes from "@/components/agent/contactdetail/notes";
import SMS from "@/components/agent/contactdetail/sms";
import TouchPoint from "@/components/agent/contactdetail/touchpoint";
import Attachments from "@/components/agent/contactdetail/attachments";
import Misc from "@/components/agent/contactdetail/misc";
import Activities from "@/components/agent/contactdetail/activities";
import History from "@/components/agent/contactdetail/history";
import LeadSheet from "@/components/agent/contactdetail/leadsheet";
import AiCallSentiment from "@/components/agent/contactdetail/aicallsentiment";
import ActionPlans from "@/components/agent/contactdetail/actionplans";
import Email from "./email";

const BottomContactDetail = () => {
    const [openStatus, setOpenStatus] = useState("Profile");
    const tabStripRef = useRef<HTMLDivElement>(null);

    // A vertical wheel gesture does not scroll a horizontally-overflowing
    // container. Browsers only scroll sideways for shift+wheel, a tilt wheel,
    // or a trackpad's two-finger sideways swipe — so with an ordinary mouse the
    // tab strip showed a scrollbar that did nothing when you scrolled on it.
    // Translate vertical wheel movement into horizontal scrolling.
    useEffect(() => {
        const strip = tabStripRef.current;
        if (!strip) return;

        const onWheel = (event: WheelEvent) => {
            // Leave real horizontal gestures alone — the browser handles those.
            if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
            // Nothing overflowing: let the gesture fall through to the page,
            // otherwise a wide viewport would swallow vertical scrolling here.
            if (strip.scrollWidth <= strip.clientWidth) return;

            event.preventDefault();
            strip.scrollBy({ left: event.deltaY, behavior: "auto" });
        };

        // Must be non-passive: preventDefault() is ignored on a passive
        // wheel listener, which is the default for wheel events.
        strip.addEventListener("wheel", onWheel, { passive: false });
        return () => strip.removeEventListener("wheel", onWheel);
    }, []);

    const stages = [
        { id: 8, name: "Profile" },
        { id: 1, name: "Notes" },
        { id: 4, name: "Activities" },
        { id: 5, name: "History" },
        { id: 6, name: "Emails" },
        { id: 7, name: "SMS" },
        { id: 9, name: "Touch Point" },
        { id: 10, name: "Lead Sheet" },
        { id: 11, name: "Attachments" },
        { id: 12, name: "AI Sidekick" },
        { id: 13, name: "Action Plans" },
    ];

    return (
        // flex-1, not h-full. The parent page is `flex flex-col h-full` holding
        // the header, the detail card and this section; h-full here asked for
        // 100% of a container the siblings had already taken 451px of, and a
        // flex item with a percentage height still shrinks — so this collapsed
        // to the ~90px left over. Nothing overflowed, so the page's
        // overflow-y-auto had nothing to scroll and no scrollbar appeared: the
        // panel was compressed in place rather than pushed off-screen.
        //
        // The min-height is the floor that makes the page overflow instead of
        // squashing this. On a tall viewport flex-1 wins and the panel scrolls
        // internally, as designed; on a short one the page scrolls. 460px is
        // the 60px tab strip plus a panel worth reading.
        //
        // min-h-0 is deliberately NOT also present. Two min-height utilities on
        // one element is settled by stylesheet order, not by which you wrote
        // last. The inner content div below keeps its own flex-1 min-h-0, which
        // is what actually lets it scroll.
        <section className="bg-white dark:bg-slate-800 flex flex-col flex-1 min-h-[460px] w-full mx-auto rounded-[24px] shadow-sm overflow-hidden border border-gray-100 dark:border-slate-700">
            {/* Tabs — no min-width floor. Eleven tabs at min-w-[100px] plus gaps
                and padding came to 1156px inside a 1095px strip, which cut
                "Action Plans" in half; with no-scrollbar there was no scrollbar
                to reach it either. px-4 and whitespace-nowrap already size each
                tab to its label. custom-scrollbar so a narrower viewport that
                does overflow still has something to grab. */}
            <div
                ref={tabStripRef}
                /* .custom-scrollbar sets `scroll-behavior: smooth`, and under
                   that value a programmatic scroll of this element is dropped
                   rather than animated — measured: `scrollLeft = 200` stays 0
                   with smooth and lands on 200 with auto, and passing
                   `behavior: "auto"` to scrollBy does NOT override the CSS.
                   Native scrollbar dragging still works under smooth, which is
                   why this went unnoticed until a horizontal strip needed to be
                   scrolled from script. Overridden here rather than globally so
                   the rest of the app keeps its scrolling feel. */
                style={{ scrollBehavior: "auto" }}
                className="flex bg-gray-50 dark:bg-slate-900/50 gap-1 overflow-x-auto custom-scrollbar p-2 shrink-0"
            >
                {stages.map((stg) => (
                    <button
                        key={stg.id}
                        onClick={() => setOpenStatus(stg.name)}
                        className={`${openStatus === stg.name
                            ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm"
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}
                            px-4 py-3.5 rounded-xl cursor-pointer text-xs font-bold transition-all whitespace-nowrap`}
                    >
                        {stg.name}
                    </button>
                ))}
            </div>

            {/* Content Section - Scrollable internally */}
            <div className="flex-1 min-h-0 overflow-y-auto p-6 custom-scrollbar">
                {openStatus === "Notes" && (<Notes />)}
                {openStatus === "Profile" && (<Misc />)}
                {openStatus === "Activities" && (<Activities />)}
                {openStatus === "History" && (<History />)}
                {openStatus === "Emails" && (<Email />)}
                {openStatus === "SMS" && (<SMS />)}
                {openStatus === "Touch Point" && (<TouchPoint />)}
                {openStatus === "Lead Sheet" && (<LeadSheet />)}
                {openStatus === "Attachments" && (<Attachments />)}
                {openStatus === "AI Sidekick" && (<AiCallSentiment />)}
                {openStatus === "Action Plans" && (<ActionPlans />)}
            </div>
        </section>
    );
};

export default BottomContactDetail;
