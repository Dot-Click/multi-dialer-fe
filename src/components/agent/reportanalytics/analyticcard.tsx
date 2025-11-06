
interface AnalyticCardProps {
    icon: string; // Can pass any SVG or icon component
    label: string;
    value: string;
}

const AnalyticCard: React.FC<AnalyticCardProps> = ({ icon, label, value }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-xl px-2 py-3 shadow-sm flex gap-2 items-center pl-5 gap-2">
            <div className="bg-gray-100 p-2 rounded-full">
                <img src={icon} alt={"icon"} className="h-5 w-5 object-contain" />
            </div>
            <div>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-lg font-semibold text-gray-800">{value}</p>
            </div>
        </div>
    );
};

export default AnalyticCard;