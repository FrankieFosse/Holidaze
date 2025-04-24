import { Outlet, useLocation } from "react-router";
import { useEffect, useState } from "react";
import Header from "./Header";

const Layout = () => {
  const location = useLocation();
  const [message, setMessage] = useState("");

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
        <div className="bg-blackPrimary text-whitePrimary text-center py-2 transition-opacity duration-500 absolute top-16 z-90">
          {message}
        </div>
      )}
      <main className="bg-blackPrimary">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
