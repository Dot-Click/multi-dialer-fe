import { useEffect, useState, useMemo } from "react";
import { useScript, type ScriptData } from "@/hooks/useScript";
import { Loader2 } from "lucide-react";
import { useTwilio } from "@/providers/twilio.provider";

interface Props {
  scriptId: string | null;
  contactId?: string;
}

const normalize = (word: string) => word.toLowerCase().replace(/[^a-z0-9']/g, "");

const getSpokenWordIndices = (
  scriptWords: string[],
  transcriptWords: string[]
): Set<number> => {
  const spoken = new Set<number>();
  if (transcriptWords.length === 0 || scriptWords.length === 0) return spoken;

  const ns = scriptWords.map(normalize);
  const nt = transcriptWords.map(normalize);

  let si = 0; // Current position in script

  for (let ti = 0; ti < nt.length; ti++) {
    // Look ahead in the script to find the current transcript word.
    // We allow a window of up to 5 words to catch up if the agent skipped some script text.
    for (let lookahead = 0; lookahead <= 5 && si + lookahead < ns.length; lookahead++) {
      if (nt[ti] === ns[si + lookahead]) {
        // Match found! Mark all words up to this matched word as spoken.
        for (let j = 0; j <= si + lookahead; j++) {
          spoken.add(j);
        }
        si = si + lookahead + 1; // Advance script pointer to the next word
        break;
      }
    }
  }

  return spoken;
};

const LiveContactScript = ({ scriptId, contactId }: Props) => {
  const { getScripts } = useScript();
  const [script, setScript] = useState<ScriptData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { transcriptionLogs, isCalling } = useTwilio();

  const [logOffset, setLogOffset] = useState(0);

  useEffect(() => {
    if (!scriptId) return;
    setIsLoading(true);
    getScripts()
      .then((scripts) => {
        const found = scripts.find((s) => s.id === scriptId) || null;
        setScript(found);
      })
      .finally(() => setIsLoading(false));
  }, [scriptId]);

  useEffect(() => {
    setLogOffset(transcriptionLogs.length);
  }, [contactId]);

  useEffect(() => {
    if (isCalling) {
      setLogOffset(transcriptionLogs.length);
    }
  }, [isCalling]);


  useEffect(() => {
    if (logOffset > transcriptionLogs.length) {
      setLogOffset(0);
    }
  }, [transcriptionLogs.length, logOffset]);


  const currentSessionLogs = useMemo(() => {
    return transcriptionLogs.slice(logOffset);
  }, [transcriptionLogs, logOffset]);

  const scriptWords = useMemo(
    () => (script?.scriptText ?? "").split(/\s+/).filter(Boolean), [script]
  );

  const transcriptWords = useMemo(
    () => currentSessionLogs
      .filter((log: any) => log.speaker === 'AGENT') // match agent words only
      .map((log: any) => log.text)
      .join(" ")
      .split(/\s+/)
      .filter(Boolean),
    [transcriptionLogs]
  );

  const spokenIndices = useMemo(
    () => getSpokenWordIndices(scriptWords, transcriptWords),
    [scriptWords, transcriptWords]
  );

  if (!scriptId) return null;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[15px] font-semibold text-gray-800 dark:text-white">
          Live Script Tracker
        </h2>
        {transcriptionLogs.length > 0 && (
          <span className="flex items-center gap-1.5 text-[11px] text-green-500 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Live
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="w-6 h-6 animate-spin text-yellow-500" />
        </div>
      ) : script ? (
        <>
          {/* Legend */}
          <div className="flex items-center gap-4 mb-3 text-[11px] text-gray-400 dark:text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-yellow-500" />
              Spoken
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-gray-800 dark:bg-white" />
              Pending
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-1.5 mb-4">
            <div
              className="bg-yellow-400 h-1.5 rounded-full transition-all duration-500"
              style={{
                width: `${scriptWords.length > 0
                  ? Math.round((spokenIndices.size / scriptWords.length) * 100)
                  : 0}%`,
              }}
            />
          </div>

          {/* Script words with spoken/pending styling */}
          <div className="text-[13px] leading-7 max-h-72 overflow-y-auto custom-scrollbar">
            {scriptWords.map((word, i) => (
              <span
                key={i}
                className={`transition-colors duration-300 ${spokenIndices.has(i)
                  ? "text-yellow-600 dark:text-yellow-400 font-medium" // Spoken — highlighted in yellow
                  : "text-gray-800 dark:text-white" // Pending — vivid
                  }`}
              >
                {word}{" "}
              </span>
            ))}
          </div>

          {/* Completion message */}
          {scriptWords.length > 0 &&
            spokenIndices.size === scriptWords.length && (
              <div className="mt-3 text-center text-[12px] font-medium text-green-500">
                Script complete
              </div>
            )}
        </>
      ) : (
        <p className="text-[13px] text-gray-400 dark:text-gray-500 italic">
          Script not found.
        </p>
      )}
    </div>
  );
};

export default LiveContactScript;