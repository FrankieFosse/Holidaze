import { useNavigate } from "react-router";
import { FaLongArrowAltLeft } from "react-icons/fa";

export default function Return() {
    const navigate = useNavigate();
    return (
        <div className="fixed top-12 left-3 z-40 bg-blackPrimary/75 border-1 border-grayPrimary rounded-full px-4 py-2 cursor-pointer duration-150 hover:bg-blackPrimary/100 w-8 h-8"
        onClick={() => navigate(-1)}>
        <div
        className="flex flex-col items-center justify-center"

        >
            <FaLongArrowAltLeft />
        </div>
      </div>
    )
}