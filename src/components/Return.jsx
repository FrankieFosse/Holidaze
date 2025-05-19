import { useNavigate } from "react-router";
import { FaLongArrowAltLeft } from "react-icons/fa";

export default function Return() {
    const navigate = useNavigate();
    return (
        <div className="fixed top-12 lg:left-75 left-3 z-40 bg-blackPrimary/75 border-1 border-grayPrimary rounded-full px-4 py-2 cursor-pointer duration-150 flex justify-center items-center hover:bg-blackPrimary/100 min-w-8 max-w-8 min-h-8 max-w-8 lg:min-w-12 lg:min-h-12 lg:text-2xl"
        onClick={() => navigate(-1)}>
        <div
        className="flex flex-col items-center justify-center"

        >
            <FaLongArrowAltLeft />
        </div>
      </div>
    )
}