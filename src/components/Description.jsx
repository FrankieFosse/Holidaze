import { useState, useRef, useEffect } from "react";

const Description = ({ text, onExpandToggle }) => {
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef(null);

  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
    onExpandToggle();
  };

  useEffect(() => {
    if (contentRef.current) {
      // Adjust max-height based on whether the text is expanded
      contentRef.current.style.maxHeight = expanded
        ? `${contentRef.current.scrollHeight}px` // Expand to the content height
        : "50px"; // Collapsed height (approx. 2 lines)
    }
  }, [expanded]); // Re-run whenever `expanded` changes

  return (
    <div className="overflow-hidden transition-all duration-1000 ease-in-out">
      <div
        ref={contentRef}
        className="transition-all duration-1000 ease-in-out overflow-hidden"
        style={{
          maxHeight: expanded ? `${contentRef.current?.scrollHeight}px` : "50px", // Dynamically adjust max-height
        }}
      >
        {/* Conditionally display full text or preview text */}
        <p className="text-xs font-thin">
          {expanded ? text : text} {/* Show full text if expanded, preview text if not */}
        </p>
      </div>

      {/* Show Read more or Show less based on expanded state */}
      {text.length > 120 && (
        <button
          onClick={toggleExpanded}
          className="mt-1 text-xs bg-buttonPrimary px-4 py-1 cursor-pointer duration-150 hover:bg-buttonSecondary focus:outline-none"
        >
          {expanded ? "Show less" : "Read more"} {/* Toggle button text */}
        </button>
      )}
    </div>
  );
};

export default Description;
