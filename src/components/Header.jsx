import { PiHouseSimple } from "react-icons/pi";
import { PiList } from "react-icons/pi";
import Navbar from "./Navbar";

function Header() {


  return (
    <header>
        <div className="bg-blackPrimary/25 w-full h-16 flex flex-row items-center justify-between fixed z-40">
            <div>
                <img src="/public/images/Holidaze Logo v1.png" className="top-1 relative max-w-24 min-w-24 max-h-24 min-h-24 ml-4 overflow-hidden"></img>
            </div>
            <div>
                <PiList className="text-gray-100 text-4xl mr-6" />
            </div>
        </div>
        <Navbar />
        
      <nav className="">
        
      </nav>
    </header>
  )
}

export default Header;