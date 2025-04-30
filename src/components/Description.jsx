import { useEffect, useRef, useState } from "react";

const Description = ({ text, onExpandToggle }) => {
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef(null);
  const isLongText = text.length > 200;

  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
    onExpandToggle();
  };

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.maxHeight =
        expanded && isLongText
          ? "150px"
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
          expanded && isLongText ? "overflow-y-auto" : "overflow-hidden"
        }`}
        style={{
          maxHeight:
            expanded && isLongText
              ? "150px"
              : expanded
              ? `${contentRef.current?.scrollHeight}px`
              : "50px",
        }}
      >
        <p className="text-xs font-thin whitespace-pre-wrap">{text}</p>
      </div>

      {/* Show the toggle button if the text is long enough to need expansion */}
      {text.length > 150 && (
        <button
          onClick={toggleExpanded}
          className="mt-1 text-xs bg-buttonPrimary px-4 py-1 cursor-pointer duration-150 hover:bg-buttonSecondary focus:outline-none"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
};

export default Description;
