import { useState, useEffect, useRef } from "react";
import { FaLongArrowAltRight } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { BsQuestionLg } from "react-icons/bs";
import StatusMessage from "../components/StatusMessage"; // Import here
import Tooltip from "./Tooltip";

// Register new user
async function registerUser(name, email, password, venueManager) {
  try {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, venueManager }),
    };
    const response = await fetch(`https://v2.api.noroff.dev/auth/register`, options);
    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.errors?.[0]?.message || "User already exists" };
    } else {
      return { success: true };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "Something went wrong" };
  }
}

function Register({ onCancel }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [venueManager, setVenueManager] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error"); // error | success | loading

  const timeoutRef = useRef(null);

  // Whenever message changes, start a timer to clear it after 3 seconds
  useEffect(() => {
    if (message) {
      // Clear previous timer if any
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // Set timer to clear message after 3 seconds
      timeoutRef.current = setTimeout(() => {
        setMessage("");
      }, 3000);
    }
    // Cleanup on unmount
    return () => clearTimeout(timeoutRef.current);
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setMessageType("error");
      setMessage("Please fill in all fields");
      return;
    }

    const noroffEmailPattern = /^[^\s@]+@stud\.noroff\.no$/i;
    if (!noroffEmailPattern.test(email)) {
      setMessageType("error");
      setMessage("Email must be a valid @stud.noroff.no address");
      return;
    }

    if (password !== confirmPassword) {
      setMessageType("error");
      setMessage("Passwords do not match");
      return;
    }

    setMessageType("loading");
    setMessage("Registering...");

    const result = await registerUser(name, email, password, venueManager);

    if (result.success) {
      setMessageType("success");
      setMessage("User created! You can now log in.");
      setTimeout(() => {
        onCancel();
        setMessage(""); // clear message after navigating back
      }, 2000);
    } else {
      setMessageType("error");
      setMessage(result.message);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-blackPrimary/90 w-3/4 max-w-md h-max py-8 px-8 flex justify-start items-center flex-col text-xs rounded lg:text-lg"
      >
        <input
          type="text"
          placeholder="Username"
          className="bg-whitePrimary p-2 w-full my-2 outline-none text-blackPrimary rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="E-mail"
          className="bg-whitePrimary p-2 w-full my-2 outline-none text-blackPrimary rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="bg-whitePrimary p-2 w-full my-2 outline-none text-blackPrimary rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="bg-whitePrimary p-2 w-full my-2 outline-none text-blackPrimary rounded"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <div className="flex flex-col justify-between gap-4 items-center w-full text-xs">
          <div className="flex flex-row items-center justify-center gap-4">
            <p>Do you want to be a venue manager?</p>
            <Tooltip text="This gives you access to create your own venues">
              <BsQuestionLg
                aria-label="This gives you access to create your own venues"
                className="bg-blackPrimary border-1 border-grayPrimary rounded-full min-h-6 max-h-6 min-w-6 max-w-6 p-1 cursor-help"
              />
            </Tooltip>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="checkbox" className="text-whitePrimary">
              Yes
            </label>
            <input
              id="checkbox"
              name="venueManager"
              type="checkbox"
              className="h-6 w-6 text-redPrimary"
              checked={venueManager}
              onChange={(e) => setVenueManager(e.target.checked)}
            />
          </div>
        </div>

        <div className="flex flex-col justify-between w-full">
          <button
            type="submit"
            className="bg-buttonPrimary text-whitePrimary py-2 px-3 flex flex-row justify-center items-center gap-4 my-4 duration-150 cursor-pointer hover:bg-buttonSecondary text-sm rounded lg:text-xl"
          >
            Register
            <FaLongArrowAltRight />
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="text-whitePrimary flex justify-center items-center py-2 gap-2 duration-150 cursor-pointer hover:scale-105 hover:border-grayPrimary rounded border-1 border-blackSecondary"
          >
            <IoClose /> Cancel
          </button>
        </div>
      </form>

      {/* Status message outside the form for better overlay handling */}
      <StatusMessage message={message} type={messageType} />
    </>
  );
}

export default Register;
