import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function StatusMessage({ message, type }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!message) return null;


  const bgColorClass =
    type === "error"
      ? "bg-redSecondary"
      : type === "success"
      ? "bg-buttonPrimary"
      : "bg-buttonPrimary";

      const containerPositionClass = "items-end justify-end p-4";



  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          key={message}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className={`fixed inset-0 z-90 flex pointer-events-none ${containerPositionClass}`}

        >
          {type === "loading" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 backdrop-blur-sm bg-black/30 z-0"
            />
          )}

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="z-90 px-6 py-4 rounded text-sm lg:text-xl flex items-center"
          >
            {type === "loading" && (
              <div className="border-4 border-white border-t-transparent rounded-full w-6 h-6 animate-spin mr-4" />
            )}
            <span className={`${bgColorClass} px-6 py-3 rounded z-90`}>
              {message}
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
