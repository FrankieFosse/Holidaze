import { useEffect, useRef, useState } from "react";

const Description = ({ text, onExpandToggle }) => {
  const [expanded, setExpanded] = useState(false);
  const [showScroll, setShowScroll] = useState(false); // New state to control scrollbar delay
  const contentRef = useRef(null);
  const isLongText = text.length > 200;

  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
    onExpandToggle();
  };

  useEffect(() => {
    let timeoutId;

    if (expanded && isLongText) {
      // Delay scroll activation by 1s
      timeoutId = setTimeout(() => {
        setShowScroll(true);
      }, 1000);
    } else {
      // Remove scroll immediately when collapsed
      setShowScroll(false);
    }

    return () => clearTimeout(timeoutId);
  }, [expanded, isLongText]);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.maxHeight =
        expanded && isLongText
          ? "300px"
          : expanded
          ? `${contentRef.current.scrollHeight}px`
          : "50px";
    }
  }, [expanded, isLongText]);

  return (
    <div className="overflow-hidden transition-all duration-1000 ease-in-out">
      <div
        ref={contentRef}
        className={`transition-all duration-1000 ease-in-out break-words text-ellipsis ${
          showScroll ? "overflow-y-auto" : "overflow-hidden"
        }`}
        style={{
          maxHeight:
            expanded && isLongText
              ? "300px"
              : expanded
              ? `${contentRef.current?.scrollHeight}px`
              : "50px",
        }}
      >
        <p className="text-xs md:text-lg font-thin whitespace-pre-wrap">{text}</p>
      </div>

      {text.length > 150 && (
        <button
          onClick={toggleExpanded}
          className="mt-1 text-xs md:text-lg bg-buttonPrimary px-4 py-1 cursor-pointer duration-150 hover:bg-buttonSecondary focus:outline-none rounded"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
};

export default Description;
