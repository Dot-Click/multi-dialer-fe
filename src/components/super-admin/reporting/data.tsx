import { FaArrowTrendUp } from 'react-icons/fa6';

const Data = () => {
  return (
    <div className="bg-white  work-sans h-[375px] justify-center rounded-[32px] px-10 py-7 shadow-lg 
    flex flex-col gap-6 w-full md:w-[65%]">
      {/* Renewal Success Rate Card */}
      <div className="bg-[#6FD19524] rounded-[12px] p-7 flex justify-between items-center">
        <div>
          <p className="text-[#1D2C45B5] text-[14px] font-[400]">Renewal Success Rate</p>
          <h3 className="text-[rgb(29,44,69)] text-[22px] font-[600] ">95.3%</h3>
          <p className="text-[#1D2C45B5] text-[14px] font-[400]">1,189 / 1,247R</p>
        </div>
        <div className="flex items-center gap-1 text-[#0DAD4B] font-[500] text-[16px]">
         <span><FaArrowTrendUp /></span>
          <span>-5.2%</span>
        </div>
      </div>

      {/* Outstanding Invoices Card */}
      <div className="bg-[#FEFCE8] rounded-[12px] p-7 flex justify-between items-center">
        <div>
          <p className="text-[#1D2C45B5] text-[14px] font-[400]">Outstanding Invoices</p>
          <h3 className="text-[rgb(29,44,69)] text-[22px] font-[600]">$12,450</h3>
          <p className="text-[#1D2C45B5] text-[14px] font-[400]">18 invoices</p>
        </div>
        <div className="flex items-center gap-1 text-[#0DAD4B] font-[500] text-[16px]">
         <span><FaArrowTrendUp /></span>
          <span>-5.2%</span>
        </div>
      </div>
    </div>
  );
};

export default Data;