import { FaWifi } from "react-icons/fa";
import { MdLocalParking, MdFreeBreakfast, MdOutlinePets } from "react-icons/md";
import { useNavigate } from "react-router";
import Rating from "./Rating";
import SingleVenueHero from "./SingleVenueHero";
import Description from "./Description";
import { useState } from "react";

const VenuePreview = ({
  name,
  description,
  media,
  price,
  maxGuests,
  meta,
  onClose,
}) => {
  const navigate = useNavigate();

  const [expanded, setExpanded] = useState(false);

  const handleExpandToggle = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <div>
        <SingleVenueHero media={media}/>
        <div className="z-30 text-white p-4 bottom-4 w-full overflow-hidden flex flex-row justify-between items-center gap-4">
        <div className="text-left w-3/5">
        <h2
          className={`font-bold break-words overflow-hidden text-ellipsis ${
            name.length > 100 ? "text-sm" : "text-xl"
          }`}
        >
          {name}
        </h2>

          <Description text={description} onExpandToggle={handleExpandToggle} />
        </div>
      </div>
    </div>
  );
};

export default VenuePreview;
