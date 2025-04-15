import { Link } from "react-router";

function Navbar() {


    return (
        <div className="flex flex-col text-whitePrimary bg-blackPrimary/75 absolute top-16 z-50 w-full h-2/4">
            <Link to="/">Home</Link>
            <Link to="/browse">Browse</Link>
            <Link to="/bookings">Bookings</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/login">Log in</Link>
        </div>
    )
}

export default Navbar;