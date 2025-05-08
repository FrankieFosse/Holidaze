import { motion, AnimatePresence } from "framer-motion";

export default function StatusMessage({ message, type }) {
  if (!message) return null;

  const bgColorClass =
    type === "error"
      ? "bg-redPrimary"
      : type === "success"
      ? "bg-buttonPrimary"
      : "bg-buttonPrimary";


  return (
    <AnimatePresence>
      <motion.div
        key={message}  // This ensures the animation gets triggered when the message changes
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}  // Fade out and shrink
        transition={{ duration: 0.3 }}
        className={`fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 px-6 py-3 w-4/5 rounded ${bgColorClass} border-1 border-blackPrimary text-whitePrimary text-sm flex items-center justify-center gap-4`}
      >
        {type === "loading" && (
          <div className="border-4 border-white border-t-transparent rounded-full w-6 h-6 animate-spin" />
        )}
        <span>{message}</span>
      </motion.div>
    </AnimatePresence>
  );
}
