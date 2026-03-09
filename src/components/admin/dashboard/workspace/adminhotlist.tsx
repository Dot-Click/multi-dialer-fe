import { IoIosArrowForward } from "react-icons/io";
import { BsThreeDots } from "react-icons/bs";
import { Link } from "react-router-dom";

const AdminHotList = () => {
  const contacts = [
    { id: 1, name: "Person Name", contact: "(832) 704-2910", number: 121 },
    { id: 2, name: "Person Name", contact: "(832) 704-2910", number: 121 },
    { id: 3, name: "Person Name", contact: "(832) 704-2910", number: 121 },
    { id: 4, name: "Person Name", contact: "(832) 704-2910", number: 121 },
    { id: 5, name: "Person Name", contact: "(832) 704-2910", number: 121 },
    { id: 6, name: "Person Name", contact: "(832) 704-2910", number: 121 },
    { id: 7, name: "Person Name", contact: "(832) 704-2910", number: 121 },
  ];

  return (
    <section className="bg-white dark:bg-slate-800 flex h-fit md:h-[35vh] lg:h-[50vh] flex-col gap-5 rounded-[32px] px-[24px] pt-[24px] pb-[32px]   lg:w-[45%] w-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[20px] text-[#000000] dark:text-white font-[500]">
            Hotlist
          </h1>
        </div>
        <Link
          to="/admin/data-dialer"
          className="flex gap-1 text-[#2B3034] dark:text-gray-300 dark:hover:text-white items-center "
        >
          <span className="text-[16px] font-[500]">See all contacts</span>
          <span>
            <IoIosArrowForward className="text-[19px] font-[400]" />
          </span>
        </Link>
      </div>

      <div className="flex flex-col gap-5 overflow-auto custom-scrollbar">
        {contacts.map((cont) => (
          <div
            key={cont.id}
            className="flex mx-2 rounded-md border gap-2 items-center border-[#F3F4F7] dark:border-slate-700"
          >
            <div className="bg-[#FFF7DB] dark:bg-orange-900/30 rounded-tr-md rounded-br-md  text-[#D66400] dark:text-orange-400 text-[14px] font-[500] px-3 py-3">
              {cont.number}
            </div>
            <div className="flex justify-between w-full  pr-3 items-center">
              <div>
                <h1 className="text-[16px] font-[500] text-[#000000] dark:text-white">
                  {cont.name}
                </h1>
                <h1 className="text-[14px] font-[400] text-[#495057] dark:text-gray-400">
                  {cont.contact}
                </h1>
              </div>
              <div className="bg-gray-200 dark:bg-slate-700 dark:text-white rounded-sm p-2 ">
                <BsThreeDots />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdminHotList;
