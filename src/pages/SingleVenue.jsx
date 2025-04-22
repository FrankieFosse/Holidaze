import { useParams } from "react-router";
import { useState, useEffect } from "react";
import SingleVenueHero from "../components/SingleVenueHero";
import Rating from "../components/Rating";
import Description from "../components/Description";
import { FaLongArrowAltRight, FaWifi } from "react-icons/fa";
import { MdLocalParking, MdFreeBreakfast, MdOutlinePets } from "react-icons/md";

const SingleVenue = () => {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const handleExpandToggle = () => {
    setExpanded((prev) => !prev);
  };

  console.log(venue)

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const response = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${id}?_owner=true`);
        if (!response.ok) throw new Error("Failed to fetch venue");
        const json = await response.json();
        setVenue(json.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVenue();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!venue) return <p>No venue found</p>;



  return (
    <>
      <SingleVenueHero media={venue.media} expanded={expanded} />

      <div className="absolute z-30 text-white p-4 bottom-24 w-full overflow-hidden flex flex-row justify-between items-center">
        <div className="text-left w-3/5">
            <h1 className="text-xl font-bold">{venue.name}</h1>
            <Description text={venue.description} onExpandToggle={handleExpandToggle} />
        </div>
        <div>
            <Rating venue={venue} />
        </div>
      </div>
      <div className="border-1 border-blackSecondary mx-2 my-4">
        <div className="flex flex-row justify-evenly items-center my-4 mx-2 gap-4">
            <p>{venue.price} NOK / night</p>
            <button
                className="flex items-center w-max py-2 px-4 bg-buttonPrimary hover:bg-buttonSecondary text-xl duration-150 cursor-pointer gap-4"
            >Book now <FaLongArrowAltRight /></button>
        </div>
        <div className="flex flex-col justify-center items-center">
            <p>Max Guests</p>
            <div className="border-1 border-grayPrimary rounded-full w-12 h-12 p-2 flex items-center justify-center">{venue.maxGuests}</div>
        </div>
        <div className="flex flex-row justify-evenly my-4 gap-4 scale-80">
            {[
                { condition: venue.meta.wifi, icon: <FaWifi className="h-10 w-10 p-2 rounded-full bg-blackSecondary border-1 border-blackSecondary text-grayPrimary" />, label: "WiFi included" },
                { condition: venue.meta.parking, icon: <MdLocalParking className="h-10 w-10 p-2 rounded-full bg-blackSecondary border-1 border-blackSecondary text-grayPrimary" />, label: "Parking included" },
                { condition: venue.meta.pets, icon: <MdFreeBreakfast className="h-10 w-10 p-2 rounded-full bg-blackSecondary border-1 border-blackSecondary text-grayPrimary" />, label: "Breakfast included" },
                { condition: venue.meta.breakfast, icon: <MdOutlinePets className="h-10 w-10 p-2 rounded-full bg-blackSecondary border-1 border-blackSecondary text-grayPrimary" />, label: "Pets allowed" },
            ].map(
                ({ condition, icon, label }, index) =>
                condition && (
                    <div key={index} className="flex flex-col items-center gap-2">
                    {icon}
                    <p className="text-xs font-thin">{label}</p>
                    </div>
                )
            )}
        </div>
        <p className="text-sm font-thin opacity-50">Created {venue.created.slice(0, 10).split('-').reverse().join('.')}</p>
      </div>
      <div className="border-1 border-blackSecondary mx-2 p-8 my-8">
        <h2>Owner</h2>
        <div className="flex flex-row items-center justify-between mx-8">
            <img 
                src={venue.owner.avatar.url}
                className="rounded-full border-1 border-grayPrimary max-h-24 min-h-24 max-w-24 min-w-24 object-cover"
            />
            <p>{venue.owner.name}</p>
        </div>
      </div>
    </>
  );
};

export default SingleVenue;
