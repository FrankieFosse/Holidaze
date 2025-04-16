import { useState } from "react";
import { FaLongArrowAltRight } from "react-icons/fa";
import { useNavigate } from "react-router";
import Register from "../components/Register";

async function getToken(email, password) {
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      };
      const response = await fetch("https://v2.api.noroff.dev/auth/login?_holidaze=true", options);
  
      if (response.ok) {
        const data = await response.json();
  
        const { name, accessToken, venueManager } = data.data;
  
        localStorage.setItem("name", name);
        localStorage.setItem("email", email);
        localStorage.setItem("token", accessToken);
        localStorage.setItem("venueManager", venueManager); // Optional: store for future use
  
        console.log("Logged in");
  
        if (venueManager === true) {
          console.log("This user is a Venue Manager");
        }
  
        return { success: true };
      } else {
        console.log("Wrong username or password");
        return { success: false, message: "Wrong username or password" };
      }
    } catch (error) {
      console.error(error.message);
      return { success: false, message: error.message };
    }
  }
  

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await getToken(email, password);
    if (!result.success) {
      setErrorMsg(result.message);
    } else {
      setErrorMsg("");
      navigate("/");
    }
  };

  return (
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

      {/* Content */}
      <div className="relative z-20 flex justify-center items-center w-full h-full">
            {showRegister ? (
                <Register onCancel={() => setShowRegister(false)} />
                ) : (
          <form
            className="bg-blackPrimary/90 w-3/4 max-w-md h-max py-8 px-8 flex justify-start items-center flex-col"
            onSubmit={handleLogin}
          >
            <input
              type="email"
              placeholder="E-mail"
              className="bg-whitePrimary p-2 w-full mb-8 mt-8 outline-none text-blackPrimary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="bg-whitePrimary p-2 w-full outline-none text-blackPrimary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errorMsg && <p className="text-red-500 mt-4">{errorMsg}</p>}
            <button
              type="submit"
              className="bg-buttonPrimary text-whitePrimary py-4 px-6 flex flex-row justify-center items-center gap-4 mt-8 mb-8 duration-150 cursor-pointer hover:bg-buttonSecondary"
            >
              Log in
              <FaLongArrowAltRight />
            </button>
            <p className="text-whitePrimary font-thin">Don't have an account?</p>
            <button
              type="button"
              className="text-whitePrimary text-xl duration-150 cursor-pointer hover:underline hover:scale-105"
              onClick={() => setShowRegister(true)}
            >
              Sign Up
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
