import React from 'react'

const ContactFooter = () => {

    const footerData = [
        { id: 1, heading: "Caller ID:", value: "(111)-111-00" },
        { id: 2, heading: "Total:", value: "1/49" },
        { id: 3, heading: "Daily dialing time:", value: "00:00:33" },
        { id: 4, heading: "Daily contacts:", value: "0" },
        { id: 5, heading: "Daily dials:", value: "0" },
    ]

    return (
        <footer className='w-full px-5 pb-3'>
            <div className='flex w-full flex-nowrap overflow-auto justify-around  gap-3 items-center'>
                {footerData.map((foot) => (
                    <div key={foot.id} className='flex whitespace-nowrap w-fit md:w-72 justify-center px-3 py-2 text-[12px] md:text-xs items-center gap-2 border bg-white rounded-md'>
                        <span>{foot.heading}</span>
                        <span className='font-medium'>{foot.value}</span>
                    </div>
                ))}
            </div>
        </footer>
    )
}

export default ContactFooter