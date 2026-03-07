// import { Button } from '@/components/ui/button'
// import callIcon from "../../../assets/callsicon.png"
import { BsBell } from "react-icons/bs";


const Navbar = () => {
  return (
    <nav className="border border-[#EBEDF0] w-full h-16  bg-white flex justify-end items-center gap-5 pt-3 pb-4 px-9">
      <div>

        {/* <Button className='bg-transparent text-gray-600 cursor-pointer hover:text-gray-900 hover:bg-gray-200 border border-gray-400'>
          <img src={callIcon} className='w-3 object-contain' alt="callIcon" />
          <span>Quick Call</span>
        </Button> */}
      </div>

      <div className='border border-gray-400 cursor-pointer hover:text-gray-900 hover:bg-gray-200  rounded-full p-1.5'>
        <span><BsBell className='text-gray-600 text-xl' /></span>
      </div>
    </nav>
  )
}

export default Navbar