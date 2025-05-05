import { PiList } from "react-icons/pi";
import { Link } from "react-router";
import Navbar from "./Navbar";

function Header() {


  return (
    <header>
        <div className="bg-blackPrimary/25 w-full h-10 flex flex-row items-center justify-between fixed z-40 top-0">
            <Link to="/">
                <img src="/images/Holidaze Logo v1.png" className="top-1 relative max-w-18 min-w-16 max-h-18 min-h-16 ml-4 overflow-hidden"></img>
            </Link>
        </div>
        <Navbar />
        
      <nav className="">
        
      </nav>
    </header>
  )
}

export default Header;