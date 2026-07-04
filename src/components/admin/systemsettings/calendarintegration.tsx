import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { PiMicrosoftOutlookLogo } from "react-icons/pi";
import { CheckCircle, XCircle, Loader2, CalendarDays } from "lucide-react";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

interface ConnectedProvider {
  provider: "GOOGLE" | "OUTLOOK";
  calendarId: string | null;
  expiresAt: string;
  createdAt: string;
  connected: boolean;
}

function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function CalendarIntegration() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [connected, setConnected] = useState<ConnectedProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const result = searchParams.get("calendar_sync");
    if (result === "google_connected") {
      toast.success("Google Calendar connected successfully!");
      searchParams.delete("calendar_sync");
      setSearchParams(searchParams, { replace: true });
      fetchStatus();
    } else if (result === "outlook_connected") {
      toast.success("Outlook Calendar connected successfully!");
      searchParams.delete("calendar_sync");
      setSearchParams(searchParams, { replace: true });
      fetchStatus();
    } else if (result === "error") {
      const reason = searchParams.get("reason") || "Unknown error";
      toast.error(`Calendar connection failed: ${reason}`);
      searchParams.delete("calendar_sync");
      searchParams.delete("reason");
      setSearchParams(searchParams, { replace: true });
    }
  }, []);

  async function fetchStatus() {
    try {
      setLoading(true);
      const res = await axios.get(`${BACKEND_URL}/api/calendar-sync/status`, {
        headers: authHeader(),
      });
      setConnected(res.data?.data ?? []);
    } catch {
      // Silently fail — not critical
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStatus();
  }, []);

  async function connectProvider(provider: "GOOGLE" | "OUTLOOK") {
    try {
      setActionLoading(provider);
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const endpoint = provider === "GOOGLE"
        ? `${BACKEND_URL}/api/calendar-sync/auth/google/url`
        : `${BACKEND_URL}/api/calendar-sync/auth/outlook/url`;
      const res = await axios.get(endpoint, {
        headers: authHeader(),
        params: { timezone },
      });
      const url = res.data?.data?.url;
      if (url) {
        window.location.href = url;
      } else {
        toast.error(`Failed to get ${provider === "GOOGLE" ? "Google" : "Outlook"} auth URL.`);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to start auth.";
      toast.error(msg);
    } finally {
      setActionLoading(null);
    }
  }

  async function disconnect(provider: "GOOGLE" | "OUTLOOK") {
    try {
      setActionLoading(provider);
      await axios.delete(`${BACKEND_URL}/api/calendar-sync/${provider}`, {
        headers: authHeader(),
      });
      toast.success(`${provider === "GOOGLE" ? "Google" : "Outlook"} Calendar disconnected.`);
      fetchStatus();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to disconnect.");
    } finally {
      setActionLoading(null);
    }
  }

  const isConnected = (provider: "GOOGLE" | "OUTLOOK") =>
    connected.some((c) => c.provider === provider && c.connected);

  const providerInfo = (provider: "GOOGLE" | "OUTLOOK") =>
    connected.find((c) => c.provider === provider);

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-10 text-gray-400">
        <Loader2 size={18} className="animate-spin" />
        <span className="text-sm">Loading calendar connections…</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h2 className="text-lg font-semibold text-[#0E1011] dark:text-white flex items-center gap-2">
          <CalendarDays size={20} />
          Calendar Integration
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Connect your calendar so that appointments, callbacks, and tasks created on Slingvo are
          automatically synced as events.
        </p>
      </div>

      <ProviderCard
        icon={<FcGoogle size={28} />}
        name="Google Calendar"
        description="Sync appointments, callbacks, and tasks to your Google Calendar in real-time."
        connected={isConnected("GOOGLE")}
        info={providerInfo("GOOGLE")}
        actionLoading={actionLoading === "GOOGLE"}
        onConnect={() => connectProvider("GOOGLE")}
        onDisconnect={() => disconnect("GOOGLE")}
      />

      <ProviderCard
        icon={<PiMicrosoftOutlookLogo size={26} color="#0078D4" />}
        name="Outlook Calendar"
        description="Sync appointments, callbacks, and tasks to your Microsoft Outlook Calendar in real-time."
        connected={isConnected("OUTLOOK")}
        info={providerInfo("OUTLOOK")}
        actionLoading={actionLoading === "OUTLOOK"}
        onConnect={() => connectProvider("OUTLOOK")}
        onDisconnect={() => disconnect("OUTLOOK")}
      />
    </div>
  );
}

interface ProviderCardProps {
  icon: React.ReactNode;
  name: string;
  description: string;
  connected: boolean;
  info?: ConnectedProvider;
  actionLoading: boolean;
  comingSoon?: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

function ProviderCard({
  icon,
  name,
  description,
  connected,
  info,
  actionLoading,
  comingSoon,
  onConnect,
  onDisconnect,
}: ProviderCardProps) {
  return (
    <div className="flex items-start gap-4 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl px-5 py-4 shadow-sm">
      <div className="flex-shrink-0 mt-0.5">{icon}</div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-[#0E1011] dark:text-white text-sm">{name}</span>
          {comingSoon ? (
            <span className="text-[10px] bg-gray-100 dark:bg-slate-600 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full font-medium">
              Coming Soon
            </span>
          ) : connected ? (
            <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
              <CheckCircle size={10} /> Connected
            </span>
          ) : (
            <span className="text-[10px] bg-gray-100 dark:bg-slate-600 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
              <XCircle size={10} /> Not connected
            </span>
          )}
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>

        {connected && info && (
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
            Syncing to:{" "}
            <span className="font-medium text-gray-600 dark:text-gray-300">
              {info.calendarId || "primary"}
            </span>{" "}
            · Connected {new Date(info.createdAt).toLocaleDateString()}
          </p>
        )}
      </div>

      <div className="flex-shrink-0">
        {comingSoon ? null : connected ? (
          <button
            onClick={onDisconnect}
            disabled={actionLoading}
            className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 transition-colors flex items-center gap-1"
          >
            {actionLoading ? <Loader2 size={12} className="animate-spin" /> : null}
            Disconnect
          </button>
        ) : (
          <button
            onClick={onConnect}
            disabled={actionLoading}
            className="text-xs px-3 py-1.5 rounded-lg bg-[#FFCA06] hover:bg-yellow-500 text-black font-medium disabled:opacity-50 transition-colors flex items-center gap-1"
          >
            {actionLoading ? <Loader2 size={12} className="animate-spin" /> : null}
            Connect
          </button>
        )}
      </div>
    </div>
  );
}
