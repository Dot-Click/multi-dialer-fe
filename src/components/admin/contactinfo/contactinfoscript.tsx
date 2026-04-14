import scripticon from "../../../assets/scripticon.png"
import { useScript, type ScriptData } from "@/hooks/useScript";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  scriptId: string | null;

}
const ContactInfoScript = ({ scriptId }: Props) => {

  const { getScripts } = useScript();
  const [script, setScript] = useState<ScriptData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!scriptId) return;
    setIsLoading(true);
    getScripts().then((scripts) => {
      const found = scripts.find((s) => s.id === scriptId) || null;
      setScript(found);
    }).finally(() => setIsLoading(false));
  }, [scriptId]);

  if (!scriptId) return null;


  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm flex flex-col h-[200px]">
      <div className="flex items-center gap-3 mb-4 shrink-0">
        <img src={scripticon} alt="scripticon" className="w-4 h-4 object-contain" />
        <h3 className="text-base font-semibold text-gray-800 dark:text-white uppercase tracking-wider">Script</h3>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
        </div>
      ) : script ? (
        <div className="text-[14px] text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap overflow-y-auto custom-scrollbar flex-1 pr-2">
          {script.scriptText}
        </div>
      ) : (
        <p className="text-sm text-gray-400 dark:text-gray-500 italic">Script not found.</p>
      )}
    </div>
  );
};

export default ContactInfoScript;