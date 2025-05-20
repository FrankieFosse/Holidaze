import { motion, AnimatePresence } from "framer-motion";

export default function StatusMessage({ message, type }) {
  if (!message) return null;

  const bgColorClass =
    type === "error"
      ? "bg-redSecondary"
      : type === "success"
      ? "bg-buttonPrimary"
      : "bg-buttonSecondary";


  return (
    <AnimatePresence>
      <motion.div
        key={message}  // This ensures the animation gets triggered when the message changes
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}  // Fade out and shrink
        transition={{ duration: 0.3 }}
        className={`fixed top-1/3 lg:pl-72 left-0 z-90 px-6 py-3 w-full flex items-center justify-center`}
      >
        {type === "loading" && (
          <div className="border-4 border-white border-t-transparent rounded-full w-6 h-6 animate-spin mr-4" />
        )}
        <span
          className={`${bgColorClass} px-6 py-3 rounded text-sm lg:text-xl`}
        >{message}</span>
      </motion.div>
    </AnimatePresence>
  );
}
