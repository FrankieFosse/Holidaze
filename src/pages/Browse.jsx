import useAPI from "../hooks/useAPI";
import { useState, useEffect } from "react";
import { BsSearch } from "react-icons/bs";
import { FaWifi } from "react-icons/fa";
import { MdLocalParking, MdFreeBreakfast, MdOutlinePets } from "react-icons/md";
import VenueCard from "../components/VenueCard";

const Browse = () => {
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 Add search term state
  const [filters, setFilters] = useState({
    wifi: false,
    parking: false,
    breakfast: false,
    pets: false,
  });

  const { data, loading, error } = useAPI("https://v2.api.noroff.dev/holidaze/venues");

  useEffect(() => {
    if (data) {
      setVenues(data.data);
      setFilteredVenues(data.data);
    }
  }, [data]);

  // Apply filters + search
  useEffect(() => {
    let filtered = [...venues];

    if (filters.wifi) {
      filtered = filtered.filter((venue) => venue.meta?.wifi === true);
    }
    if (filters.parking) {
      filtered = filtered.filter((venue) => venue.meta?.parking === true);
    }
    if (filters.breakfast) {
      filtered = filtered.filter((venue) => venue.meta?.breakfast === true);
    }
    if (filters.pets) {
      filtered = filtered.filter((venue) => venue.meta?.pets === true);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((venue) =>
        venue.name?.toLowerCase().includes(term) ||
        venue.description?.toLowerCase().includes(term) ||
        venue.location?.address?.toLowerCase().includes(term)
      );
    }

    setFilteredVenues(filtered);
  }, [filters, searchTerm, venues]);

  const toggleFilter = (key) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  return (
    <>
      <div className="pt-20 flex flex-row items-center justify-center mb-8">
        <div className="h-8 w-8 bg-whitePrimary flex justify-center items-center">
          <BsSearch className="text-grayPrimary" />
        </div>
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // 🔁 Track input
          className="bg-whitePrimary text-blackPrimary w-3/5 p-1 outline-none h-8"
        />
      </div>

      {/* Filter buttons (unchanged) */}
      <div className="text-whitePrimary text-2xl flex flex-row items-center justify-center gap-8">
        {/* Wifi */}
        <div className="relative group">
          <button
            aria-label="Wifi included"
            onClick={() => toggleFilter("wifi")}
            className={`p-2 rounded-full duration-150 cursor-pointer ${
              filters.wifi
                ? "bg-buttonPrimary text-whitePrimary border-1 border-buttonPrimary"
                : "bg-blackSecondary border-1 border-blackSecondary text-grayPrimary hover:border-grayPrimary hover:text-whitePrimary"
            }`}
          >
            <FaWifi />
          </button>
          <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-whitePrimary bg-blackPrimary rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-[500ms] pointer-events-none">
            Wifi included
          </span>
        </div>

        {/* Parking */}
        <div className="relative group">
          <button
            aria-label="Parking included"
            onClick={() => toggleFilter("parking")}
            className={`p-2 rounded-full duration-150 cursor-pointer ${
              filters.parking
                ? "bg-buttonPrimary text-whitePrimary border-1 border-buttonPrimary"
                : "bg-blackSecondary border-1 border-blackSecondary text-grayPrimary hover:border-grayPrimary hover:text-whitePrimary"
            }`}
          >
            <MdLocalParking />
          </button>
          <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-whitePrimary bg-blackPrimary rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-[500ms] pointer-events-none">
            Parking included
          </span>
        </div>

        {/* Breakfast */}
        <div className="relative group">
          <button
            aria-label="Breakfast included"
            onClick={() => toggleFilter("breakfast")}
            className={`p-2 rounded-full duration-150 cursor-pointer ${
              filters.breakfast
                ? "bg-buttonPrimary text-whitePrimary border-1 border-buttonPrimary"
                : "bg-blackSecondary border-1 border-blackSecondary text-grayPrimary hover:border-grayPrimary hover:text-whitePrimary"
            }`}
          >
            <MdFreeBreakfast />
          </button>
          <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-whitePrimary bg-blackPrimary rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-[500ms] pointer-events-none">
            Breakfast included
          </span>
        </div>

        {/* Pets */}
        <div className="relative group">
          <button
            aria-label="Pets allowed"
            onClick={() => toggleFilter("pets")}
            className={`p-2 rounded-full duration-150 cursor-pointer ${
              filters.pets
                ? "bg-buttonPrimary text-whitePrimary border-1 border-buttonPrimary"
                : "bg-blackSecondary border-1 border-blackSecondary text-grayPrimary hover:border-grayPrimary hover:text-whitePrimary"
            }`}
          >
            <MdOutlinePets />
          </button>
          <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-whitePrimary bg-blackPrimary rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-[500ms] pointer-events-none">
            Pets allowed
          </span>
        </div>
      </div>

      {/* Venue list */}
    <ul>
        {filteredVenues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
        ))}
    </ul>

    </>
  );
};

export default Browse;

