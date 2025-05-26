import { useState, useRef, useEffect } from "react";

const Tooltip = ({ children, text }) => {
  const [visible, setVisible] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);
  const timeoutRef = useRef(null);

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setVisible(true);
    }, 300);
    setShouldShow(true);
  };

  const hideTooltip = () => {
    clearTimeout(timeoutRef.current);
    setVisible(false);
    setShouldShow(false);
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
      onClick={() => setVisible((v) => !v)}
      tabIndex={0}
      style={{ outline: "none" }}
    >
      {children}
      {shouldShow && text && (
        <div
          className={`absolute bottom-full mb-1 w-24 max-w-xs rounded bg-buttonPrimary border-1 border-buttonSecondary px-2 py-1 text-xs lg:text-sm shadow-lg z-50 transition-opacity duration-300 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
          style={{ left: "50%", transform: "translateX(-50%)" }}
        >
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
