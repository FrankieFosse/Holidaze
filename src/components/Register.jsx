import { useState } from "react";
import { FaLongArrowAltRight } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { BsQuestionLg } from "react-icons/bs";

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    const result = await registerUser(name, email, password, venueManager);
    if (result.success) {
      setMessage("User created! You can now log in.");
      setTimeout(() => {
        onCancel(); // Go back to login
      }, 2000);
    } else {
      setMessage(result.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-blackPrimary/90 w-3/4 max-w-md h-max py-8 px-8 flex justify-start items-center flex-col"
    >
      <input
        type="text"
        placeholder="Username"
        className="bg-whitePrimary p-2 w-full my-4 outline-none text-blackPrimary"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="E-mail"
        className="bg-whitePrimary p-2 w-full my-4 outline-none text-blackPrimary"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="bg-whitePrimary p-2 w-full my-4 outline-none text-blackPrimary"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Confirm Password"
        className="bg-whitePrimary p-2 w-full my-4 outline-none text-blackPrimary"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />

      <div className="flex flex-col justify-between gap-4 items-center w-full text-xs">
        <div className="flex flex-row items-center justify-center gap-4">
          <p>Do you want to be a venue manager?</p>
          <BsQuestionLg
            title="This gives you access to create your own venues"
            className="bg-blackPrimary border-1 border-grayPrimary rounded-full h-6 w-6 p-1 cursor-help"
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="checkbox" className="text-whitePrimary">
            Yes
          </label>
          <input
            id="checkbox"
            name="venueManager"
            type="checkbox"
            className="h-6 w-6 text-red-500"
            value=""
            checked={venueManager}
            onChange={(e) => setVenueManager(e.target.checked)}
          />
        </div>
      </div>

      {message && (
        <p className="text-whitePrimary text-sm mt-8 text-center h-8">{message}</p>
      )}

      <div className="flex flex-col justify-between w-full">
        <button
          type="submit"
          className="bg-buttonPrimary text-whitePrimary py-4 px-6 flex flex-row justify-center items-center gap-4 my-4 duration-150 cursor-pointer hover:bg-buttonSecondary"
        >
          Register
          <FaLongArrowAltRight />
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-whitePrimary flex justify-center items-center gap-2 duration-150 cursor-pointer hover:scale-105"
        >
          <IoClose /> Cancel
        </button>
      </div>
    </form>
  );
}

export default Register;
