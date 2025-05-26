import { useState, useEffect } from "react";
import { FaLongArrowAltRight } from "react-icons/fa";
import { useNavigate } from "react-router";
import Register from "../components/Register";
import StatusMessage from "../components/StatusMessage";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false); // ✅ new state
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Log in | Holidaze";
  }, []);

  const showMessage = (msg, type = "error", duration = 2000) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(null), duration);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return showMessage("Please fill in both fields");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) return showMessage("Please enter a valid email address");

    const result = await getToken(email, password);
    if (!result.success) {
      showMessage(result.message || "Login failed");
    } else {
      showMessage("Logging in...", "success", 1500);
      setTimeout(() => navigate("/"), 1500);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Thumbnail fallback (only shown when video hasn't loaded) */}
      {!videoLoaded && (
        <div
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center z-0"
          style={{
            backgroundImage: "url('/images/holidaze-thumbnail.jpg')",
            filter: "brightness(50%)",
          }}
        />
      )}

      {/* Video background */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-10 brightness-50"
        autoPlay
        loop
        muted
        playsInline
        onCanPlayThrough={() => setVideoLoaded(true)}
      >
        <source src="/images/holidaze.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <StatusMessage message={message} type={messageType} />

      <div className="relative z-20 flex justify-center items-center w-full h-full">
        {showRegister ? (
          <Register onCancel={() => setShowRegister(false)} />
        ) : (
          <form
            onSubmit={handleLogin}
            className="bg-blackPrimary/90 w-3/4 max-w-md h-max py-8 px-8 flex justify-start items-center flex-col rounded text-sm lg:text-lg"
          >
            <input
              type="email"
              placeholder="E-mail"
              className="bg-whitePrimary p-2 w-full mb-8 mt-8 outline-none text-blackPrimary rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="bg-whitePrimary p-2 w-full outline-none text-blackPrimary rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className="bg-buttonPrimary text-whitePrimary py-2 px-4 flex flex-row justify-center items-center gap-4 mt-8 mb-8 duration-150 cursor-pointer hover:bg-buttonSecondary rounded"
            >
              Log in
              <FaLongArrowAltRight />
            </button>
            <p className="text-whitePrimary font-thin">Don't have an account?</p>
            <button
              type="button"
              className="text-whitePrimary text-xl duration-150 cursor-pointer hover:scale-102 border-1 border-grayPrimary/50 hover:border-grayPrimary/100 rounded px-3 py-1"
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
