interface AnalyticCardProps {
  icon: string; // Can pass any SVG or icon component
  label: string;
  value: string;
}

const AnalyticCard: React.FC<AnalyticCardProps> = ({ icon, label, value }) => {
  return (
    <div className="bg-white border border-[#EBEDF0] dark:bg-slate-800 dark:border-slate-700 rounded-[16px] p-[24px]  flex  items-center pl-5 gap-2">
      <div className="bg-[#F3F4F7] dark:bg-slate-700 flex items-center justify-center p-2 rounded-[12px] h-[40px] w-[40px]">
        <img
          src={icon}
          alt={"icon"}
          className="h-[20px] w-[20px] object-contain dark:invert"
        />
      </div>
      <div>
        <p className="text-[12px] font-[400] text-[#495057] dark:text-gray-400">
          {label}
        </p>
        <p className="text-[14px] font-[500] text-[#2B3034] dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
};

export default AnalyticCard;
