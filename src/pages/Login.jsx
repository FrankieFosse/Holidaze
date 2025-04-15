import { FaLongArrowAltRight } from "react-icons/fa";

const Login = () => {
    return (
        <>
            <div className="relative w-full h-screen overflow-hidden">
                {/* Background Video */}
                <video
                    className="absolute top-0 left-0 w-full h-full object-cover brightness-50"
                    autoPlay
                    loop
                    muted
                    playsInline
                >
                    <source src="/images/video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>

                {/* Form Content */}
                <div className="relative z-20 flex justify-center items-center w-full h-full">
                    <form className="bg-blackPrimary/90 w-3/4 h-max py-8 px-8 flex justify-start items-center flex-col">
                        <input
                            type="text"
                            placeholder="E-mail"
                            className="bg-whitePrimary p-2 w-full mb-16 mt-8 outline-none text-blackPrimary"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="bg-whitePrimary p-2 w-full outline-none text-blackPrimary"
                        />
                        <button
                            className="bg-buttonPrimary text-whitePrimary py-4 px-6 flex flex-row justify-center items-center gap-4 mt-8 mb-16 duration-150 cursor-pointer hover:bg-buttonSecondary"
                        >
                            Log in
                            <FaLongArrowAltRight />
                        </button>
                        <p className="text-whitePrimary">Don't have an account?</p>
                        <h2 className="text-whitePrimary text-xl">Sign Up</h2>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Login;
