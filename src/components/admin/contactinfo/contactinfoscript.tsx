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
    <div className="bg-white dark:bg-slate-800  rounded-2xl shadow-sm p-3 w-full  flex flex-col">
      <div className="flex items-center gap-3 mb-4 shrink-0">
        <img src={scripticon} alt="scripticon" className="w-3 object-contain" />
        <h3 className="text-base font-medium text-gray-700 dark:text-white">Script</h3>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="w-6 h-6 animate-spin text-yellow-500" />
        </div>
      ) : script ? (
        <div className="text-[13px] text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto custom-scrollbar">
          {script.scriptText}
        </div>
      ) : (
        <p className="text-[13px] text-gray-400 dark:text-gray-500 italic">Script not found.</p>
      )}
    </div>
  );
};

export default ContactInfoScript;