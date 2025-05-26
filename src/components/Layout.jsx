import { Outlet, useLocation } from "react-router";
import { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

const Layout = () => {
  const location = useLocation();
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (message) {
      setShowMessage(true);
      const timer = setTimeout(() => setShowMessage(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
      const timeout = setTimeout(() => setMessage(""), 3000);
      window.history.replaceState({}, document.title);
      return () => clearTimeout(timeout);
    }
  }, [location.state]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Message */}
      {message && (
        <div className="max-w-full">
          <div
            className={`bg-green-500 text-whitePrimary text-center py-2 absolute top-10 z-50 w-full 
            transition-opacity transition-transform duration-500 ease-in-out 
            ${showMessage ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`}
          >
            {message}
          </div>
        </div>
      )}

      {/* Main content should grow to push Footer down */}
      <main className="flex-grow w-full">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;

