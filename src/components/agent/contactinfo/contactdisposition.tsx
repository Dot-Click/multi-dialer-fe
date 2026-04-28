"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateContact, fetchContactGroups, assignContactToGroups } from "@/store/slices/contactSlice";
import { fetchDispositions } from "@/store/slices/dispositionSlice";
import toast from "react-hot-toast";
import { Phone, Check, Loader2, Users, Tag } from "lucide-react";
import { useTwilio } from "@/providers/twilio.provider";
import api from "@/lib/axios";

// ─── Icon + color maps (same as DispositionSettings) ─────────────────────────

import {
  CheckCircle2, XCircle, PhoneOff, PhoneMissed, PhoneIncoming,
  Flame, Thermometer, Snowflake, Clock, Ban, ThumbsDown,
  User
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  CheckCircle2, XCircle, Phone, PhoneOff, PhoneMissed,
  PhoneIncoming, Flame, Thermometer, Snowflake, Clock,
  Ban, ThumbsDown, Tag,
};

const COLOR_IDLE: Record<string, string> = {
  green: "border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950",
  red: "border-red-200 text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950",
  orange: "border-orange-200 text-orange-700 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-950",
  yellow: "border-yellow-300 text-yellow-700 hover:bg-yellow-50 dark:border-yellow-700 dark:text-yellow-400 dark:hover:bg-yellow-950",
  blue: "border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950",
  purple: "border-violet-200 text-violet-700 hover:bg-violet-50 dark:border-violet-800 dark:text-violet-400 dark:hover:bg-violet-950",
  gray: "border-gray-300 text-gray-600 hover:bg-gray-100 dark:border-slate-600 dark:text-gray-400 dark:hover:bg-slate-700",
  rose: "border-rose-200 text-rose-700 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-400 dark:hover:bg-rose-950",
  pink: "border-pink-200 text-pink-700 hover:bg-pink-50 dark:border-pink-900 dark:text-pink-400 dark:hover:bg-pink-950",
};

const COLOR_ACTIVE: Record<string, string> = {
  green: "bg-emerald-500 border-emerald-500 text-white",
  red: "bg-red-500 border-red-500 text-white",
  orange: "bg-orange-500 border-orange-500 text-white",
  yellow: "bg-yellow-400 border-yellow-400 text-gray-900",
  blue: "bg-blue-500 border-blue-500 text-white",
  purple: "bg-violet-500 border-violet-500 text-white",
  gray: "bg-gray-600 border-gray-600 text-white dark:bg-slate-500 dark:border-slate-500",
  rose: "bg-rose-500 border-rose-500 text-white",
  pink: "bg-pink-500 border-pink-500 text-white",
};

// Group pills have a simpler fixed style — they're not color-coded
const GROUP_IDLE = "border-gray-300 text-gray-600 hover:bg-gray-100 dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-700";
const GROUP_ACTIVE = "bg-gray-900 border-gray-900 text-white dark:bg-white dark:border-white dark:text-gray-900";

// ─── Component ────────────────────────────────────────────────────────────────

interface ContactDispositionProps {
  onNext?: () => void;
}

const ContactDisposition = ({ onNext }: ContactDispositionProps) => {
  const dispatch = useAppDispatch();
  const { endCall, dropVoicemail, isCalling } = useTwilio();

  const { currentContact, groups } = useAppSelector(s => s.contacts);
  const { dispositions } = useAppSelector(s => s.dispositions);

  // ── Disposition state ──
  const [selectedDisp, setSelectedDisp] = useState<string | null>(null);
  const [savedDisp, setSavedDisp] = useState<string | null>(null);
  const [savingDisp, setSavingDisp] = useState(false);

  // ── Group state ──
  const [savedGroupIds, setSavedGroupIds] = useState<Set<string>>(new Set());
  const [selectedGroupIds, setSelectedGroupIds] = useState<Set<string>>(new Set());
  const [savingGroups, setSavingGroups] = useState(false);

  const SMART_VALUES = ["CONTACT", "NO_ANSWER", "BAD_NUMBER", "VOICEMAIL", "DNC_CONTACT", "DNC_NUMBER"];

  // Load dispositions + groups if not already loaded
  useEffect(() => {
    if (dispositions.length === 0) dispatch(fetchDispositions());
    if (groups.length === 0) dispatch(fetchContactGroups());
  }, []);

  // Sync when contact changes (next/prev navigation)
  useEffect(() => {
    const d = currentContact?.disposition ?? null;
    setSelectedDisp(d);
    setSavedDisp(d);

    if (currentContact?.id) {
      const contactId = currentContact.id;
      const inGroups = new Set(
        groups
          .filter(g => g.contactIds.includes(contactId))
          .map(g => g.id)
      );
      setSavedGroupIds(inGroups);
      setSelectedGroupIds(new Set(inGroups));
    } else {
      setSavedGroupIds(new Set());
      setSelectedGroupIds(new Set());
    }
  }, [currentContact?.id, groups]);

  const [_, setSessionCounts] = useState<Record<string, number>>({});

  // ── Helpers ──
  const activeDispositions = dispositions.filter(d => d.isActive);
  function getDispLabel(value: string) {
    return dispositions.find(d => d.value === value)?.label ?? value;
  }

  // ── Smart Disposition Actions (Mojo Logic) ──
  async function handleSmartAction(label: string, value: string) {
    if (!currentContact?.id) { toast.error("No contact loaded"); return; }
    
    setSelectedDisp(value);
    setSavingDisp(true);
    try {
      await dispatch(
        updateContact({ 
          id: currentContact.id, 
          payload: { disposition: value, status: value } 
        })
      );
      setSavedDisp(value);
      
      // Update session count locally
      setSessionCounts(prev => ({
        ...prev,
        [value]: (prev[value] || 0) + 1
      }));

      toast.success(`Outcome: ${label}`);

      const upperVal = value.toUpperCase();
      switch (upperVal) {
        case "NO_ANSWER":
        case "BAD_NUMBER":
          if (isCalling) await endCall();
          if (onNext) onNext();
          break;
        case "VOICEMAIL":
          await dropVoicemail();
          if (onNext) onNext();
          break;
        case "DNC_CONTACT":
        case "DNC_NUMBER":
        case "DO_NOT_CALL":
          if (isCalling) await endCall();
          await api.post(`/contact/${currentContact.id}/move-to-dnc`, {
            phoneIds: upperVal === "DNC_NUMBER" ? [currentContact.phones?.[0]?.id] : []
          });
          if (onNext) onNext();
          break;
        case "CONTACT":
          break;
        default:
          break;
      }
    } finally {
      setSavingDisp(false);
    }
  }

  function toggleGroup(groupId: string) {
    setSelectedGroupIds(prev => {
      const next = new Set(prev);
      next.has(groupId) ? next.delete(groupId) : next.add(groupId);
      return next;
    });
  }

  async function handleSaveGroups() {
    if (!currentContact?.id) { toast.error("No contact loaded"); return; }
    const unchanged =
      selectedGroupIds.size === savedGroupIds.size &&
      [...selectedGroupIds].every(id => savedGroupIds.has(id));
    if (unchanged) { toast("No group changes to save"); return; }

    setSavingGroups(true);
    const result = await dispatch(
      assignContactToGroups({
        contactId: currentContact.id,
        groupIds: [...selectedGroupIds],
      })
    );
    if (assignContactToGroups.fulfilled.match(result)) {
      setSavedGroupIds(new Set(selectedGroupIds));
      toast.success("Groups updated");
    } else {
      toast.error((result.payload as string) ?? "Failed to update groups");
    }
    setSavingGroups(false);
  }

  const isDispDirty = selectedDisp !== savedDisp;
  const isGroupsDirty = !(
    selectedGroupIds.size === savedGroupIds.size &&
    [...selectedGroupIds].every(id => savedGroupIds.has(id))
  );

  const smartItems = activeDispositions.filter(d => SMART_VALUES.includes(d.value.toUpperCase()));
  const otherItems = activeDispositions.filter(d => !SMART_VALUES.includes(d.value.toUpperCase()));

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 w-full">

      {/* ── DISPOSITIONS ──────────────────────────────────────────────────── */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
              Call Outcomes
            </p>
          </div>
          {savedDisp && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 px-2.5 py-1 rounded-full">
              <Check className="w-3 h-3 text-emerald-500" />
              {getDispLabel(savedDisp)}
            </span>
          )}
        </div>

        {/* Smart Dispositions (Mojo Set from DB) */}
        {smartItems.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-gray-100 dark:border-slate-700">
            {smartItems.map(d => {
              const Icon = ICON_MAP[d.icon] ?? User;
              const isActive = selectedDisp === d.value;
              return (
                <button
                  key={d.id}
                  onClick={() => handleSmartAction(d.label, d.value)}
                  disabled={savingDisp}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-sm rounded-full border font-medium transition-all duration-150 active:scale-95 ${
                    isActive
                      ? (COLOR_ACTIVE[d.color] || COLOR_ACTIVE.red)
                      : (COLOR_IDLE[d.color] || COLOR_IDLE.red)
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  {d.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Other Custom Dispositions (from DB) */}
        {otherItems.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {otherItems.map(d => {
              const Icon = ICON_MAP[d.icon] ?? Tag;
              const isActive = selectedDisp === d.value;
              return (
                <button
                  key={d.id}
                  onClick={() => setSelectedDisp(prev => prev === d.value ? null : d.value)}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-sm rounded-full border font-medium transition-all duration-150 active:scale-95 ${
                    isActive
                      ? (COLOR_ACTIVE[d.color] ?? COLOR_ACTIVE.gray)
                      : (COLOR_IDLE[d.color]   ?? COLOR_IDLE.gray)
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  {d.label}
                </button>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {isDispDirty && selectedDisp
              ? `Selected: ${getDispLabel(selectedDisp)}`
              : !selectedDisp
              ? "No disposition selected"
              : "Up to date"}
          </p>
          <div className="flex gap-2">
            {isDispDirty && selectedDisp && !SMART_VALUES.includes(selectedDisp.toUpperCase()) && (
              <button
                onClick={() => handleSmartAction(getDispLabel(selectedDisp), selectedDisp)}
                disabled={savingDisp}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-[#FFCA06] hover:bg-[#f0bc00] text-gray-900 shadow-sm hover:shadow active:scale-95 transition-all"
              >
                {savingDisp ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Check className="w-3.5 h-3.5" /> Save</>}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── GROUPS ────────────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
              Groups
            </p>
          </div>
          {savedGroupIds.size > 0 && (
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 px-2.5 py-1 rounded-full">
              {savedGroupIds.size} assigned
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {groups.map(g => {
            const isActive = selectedGroupIds.has(g.id);
            return (
              <button
                key={g.id}
                onClick={() => toggleGroup(g.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-sm rounded-full border font-medium transition-all duration-150 active:scale-95 ${
                  isActive ? GROUP_ACTIVE : GROUP_IDLE
                }`}
              >
                {isActive && <Check className="w-3 h-3 shrink-0" />}
                {g.name}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {isGroupsDirty ? `${selectedGroupIds.size} selected` : "Up to date"}
          </p>
          {isGroupsDirty && (
            <button
              onClick={handleSaveGroups}
              disabled={savingGroups}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-[#FFCA06] hover:bg-[#f0bc00] text-gray-900 shadow-sm active:scale-95 transition-all"
            >
              {savingGroups ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Update Groups"}
            </button>
          )}
        </div>
      </div>

    </div>
  );
};

export default ContactDisposition;