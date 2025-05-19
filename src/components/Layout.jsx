import { Outlet, useLocation } from "react-router";
import { useEffect, useState } from "react";
import Header from "./Header";

const Layout = () => {
  const location = useLocation();
  const [message, setMessage] = useState("");

  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (message) {
      setShowMessage(true);
      const timer = setTimeout(() => setShowMessage(false), 3000); // 3 seconds
      return () => clearTimeout(timer);
    }
  }, [message]);
  

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);

      // Clear after 3 seconds
      const timeout = setTimeout(() => setMessage(""), 3000);

      // Clear state so it doesn't persist between pages
      window.history.replaceState({}, document.title);

      return () => clearTimeout(timeout);
    }
  }, [location.state]);

  return (
    <div>
      <Header />
      {message && (
        <div
        className={`bg-buttonPrimary text-whitePrimary text-center py-2 absolute top-10 z-50 w-full 
          transition-opacity transition-transform duration-500 ease-in-out 
          ${showMessage ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`}
      >
        {message}
      </div>
      
      
      
      )}
      <main className="w-full lg:pl-72">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
