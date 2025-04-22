import { useNavigate } from "react-router";

const VenueCard = ({ venue }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/venues/${venue.id}`);
  };

  return (
    <li
      onClick={handleClick}
      className="relative bg-cover bg-center max-w-screen min-h-96 max-h-96 flex flex-col justify-end items-center m-8 duration-150 cursor-pointer hover:scale-102"
      style={{
        backgroundImage:
          venue.media && venue.media.length > 0
            ? `url(${venue.media[0].url})`
            : "none",
      }}
    >
      <div className="bg-blackPrimary/90 text-whitePrimary max-h-24 w-full px-4 py-4 overflow-hidden flex flex-row items-center gap-4">
        <div className="w-2/3 max-h-16 overflow-hidden text-left">
          <p className={`font-bold ${venue.name.length > 20 ? "text-xs" : "text-lg"}`}>
            {venue.name}
          </p>
          <p className="font-thin text-xs">
            {venue.description.length > 80
              ? `${venue.description.slice(0, 80)}...`
              : venue.description}
          </p>
        </div>
        <div>
          <p className="text-sm text-right">{venue.price} NOK / night</p>
        </div>
      </div>
    </li>
  );
};

export default VenueCard;