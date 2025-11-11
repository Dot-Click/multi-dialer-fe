import { Button } from '@/components/ui/button'
import { BsBell } from "react-icons/bs";
import callIcon from "../../../assets/callsicon.png"


const AdminNavbar = () => {
  return (
    <nav className="shadow-2xl w-full h-16  bg-white flex justify-end items-center gap-5 pt-3 pb-4 px-9">
      <div>

        <Button className='bg-transparent text-gray-600 cursor-pointer hover:text-gray-900 hover:bg-gray-200 border border-gray-400'>
          <img src={callIcon} className='w-3 object-contain' alt="callIcon" />
          <span>Quick Call</span>
        </Button>
      </div>

      <div className='border border-gray-400 cursor-pointer  rounded-full p-1.5'>
        <span><BsBell className='text-gray-600 text-xl' /></span>
      </div>
      <div className=' bg-gray-600 text-lg flex justify-center items-center text-gray-200    cursor-pointer  rounded-full px-3.5 py-1.5'>
        <h1>C</h1>
      </div>
    </nav>
  )
}

export default AdminNavbar