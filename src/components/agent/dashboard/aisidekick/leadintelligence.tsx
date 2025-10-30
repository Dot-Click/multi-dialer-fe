import React from 'react'
import { IoIosArrowForward } from 'react-icons/io'
import { BsThreeDots } from "react-icons/bs";


const LeadIntelligence = () => {

    const data = [
        { id: 1, name: "Avg AI Lead Score", number: "62%" },
        { id: 2, name: "Engagement Prediction", number: "45%" },
        { id: 3, name: "Urgent Leads", number: "62%" },
    ]

    return ( 
        <section className='bg-white flex flex-col h-[35vh] md:h-[28vh] lg:h-[45vh] gap-5 rounded-4xl px-6 py-5 md:w-[50%]  w-full '>
            <div className="">
                <h1 className="text-[20px] font-[500]">Lead Intelligence</h1>
            </div>

            <div>
                <div className='flex flex-col gap-4'>
                    {data.map((dt) => (
                        <span key={dt.id} className='flex flex-col gap-1'>
                            <h1 className='text-[14px] text-[#495057] font-[500]'>{dt.name}</h1>
                            <h1 className='text-[16px] text-gray-950 font-[600]'>{dt.number}</h1>
                        </span>
                    ))}

                </div>          
            
            </div>




        </section>
    )
}

export default LeadIntelligence