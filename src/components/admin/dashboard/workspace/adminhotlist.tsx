import { IoIosArrowForward } from 'react-icons/io'
import { BsThreeDots } from "react-icons/bs";


const AdminHotList = () => {

    const contacts = [
        { id: 1, name: "Person Name", contact: "(832) 704-2910", number: 121 },
        { id: 2, name: "Person Name", contact: "(832) 704-2910", number: 121 },
        { id: 3, name: "Person Name", contact: "(832) 704-2910", number: 121 },
        { id: 4, name: "Person Name", contact: "(832) 704-2910", number: 121 },
        { id: 5, name: "Person Name", contact: "(832) 704-2910", number: 121 },
        { id: 6, name: "Person Name", contact: "(832) 704-2910", number: 121 },
        { id: 7, name: "Person Name", contact: "(832) 704-2910", number: 121 },
    ]

    return (
        <section className='bg-white flex h-fit md:h-[35vh] lg:h-[50vh] flex-col gap-5 rounded-4xl px-6 py-5  lg:w-[45%] w-full'>
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-[20px] font-[500]">Hotlist</h1>
                </div>
                <div className="flex gap-1 items-center ">
                    <span className="text-[16px] font-[500]">See all contacts</span>
                    <span ><IoIosArrowForward className="text-[19px] font-[400]" /></span>
                </div>
            </div>


            <div className='flex flex-col gap-5 overflow-auto custom-scrollbar'>
                {contacts.map((cont) => (
                    <div key={cont.id} className='flex mx-2 rounded-md border gap-2 items-center border-gray-100'>
                        <div  className='bg-[#FFF7DB] rounded-tr-md rounded-br-md  text-[#D66400] text-[18px] font-[500] px-3 py-3'>{cont.number}</div>
                        <div className="flex justify-between w-full pr-3 items-center">
                            <div>
                            <h1 className="text-[19px] font-[500] text-gray-950">{cont.name}</h1>
                            <h1 className="text-[13px] font-[400] text-[#495057]">{cont.contact}</h1>
                            </div>
                            <div className="bg-gray-200 rounded-sm p-2 ">
                                <BsThreeDots/>
                            </div>
                        </div>
                    </div>
                ))}
            </div>



        </section>
    )
}

export default AdminHotList