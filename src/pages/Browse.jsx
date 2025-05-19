import { useState, useEffect } from "react";
import { BsSearch } from "react-icons/bs";
import VenueCard from "../components/VenueCard";
import Filter from "../components/Filter"; // ✅ Import the Filter component
import Pagination from "../components/Pagination";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";

const Browse = () => {
  const [venues, setVenues] = useState([]); // Stores all venues
  const [filteredVenues, setFilteredVenues] = useState([]); // Stores filtered venues
  const [searchTerm, setSearchTerm] = useState(""); // Stores search term
  const [filters, setFilters] = useState({
    wifi: false,
    parking: false,
    breakfast: false,
    pets: false,
  });
  const [sortBy, setSortBy] = useState("date");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showFilters, setShowFilters] = useState(false);

  const [page, setPage] = useState(1); // Track current page
  const pageSize = 50; // Number of venues per page
  const totalPages = Math.ceil(filteredVenues.length / pageSize);



  // Function to fetch all pages of venues from the API
  const fetchAllVenues = async () => {
    let allVenues = [];
    let page = 1;
    const limit = 100; // Max items per page, adjust if necessary

    try {
      setLoading(true);
      while (true) {
        const response = await fetch(
          `https://v2.api.noroff.dev/holidaze/venues?page=${page}&limit=${limit}`
        );
        const data = await response.json();

        // If no more venues are returned, break the loop
        if (data.data.length === 0) break;

        allVenues = [...allVenues, ...data.data];
        page += 1; // Move to the next page
      }
      setVenues(allVenues); // Set all venues in the state
    } catch (err) {
      setError("Failed to load venues.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch venues when the component mounts
  useEffect(() => {
    fetchAllVenues(); // Fetch all venues from the API
  }, []);

  // Apply filters, search, and sorting
  useEffect(() => {
    let filtered = [...venues];

    // Apply filter conditions based on selected filters
    if (filters.wifi) {
      filtered = filtered.filter((venue) => venue.meta?.wifi);
    }
    if (filters.parking) {
      filtered = filtered.filter((venue) => venue.meta?.parking);
    }
    if (filters.breakfast) {
      filtered = filtered.filter((venue) => venue.meta?.breakfast);
    }
    if (filters.pets) {
      filtered = filtered.filter((venue) => venue.meta?.pets);
    }

    // Apply search term filtering across all fields
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((venue) =>
        venue.name?.toLowerCase().includes(term) ||
        venue.description?.toLowerCase().includes(term) ||
        venue.location?.address?.toLowerCase().includes(term)
      );
    }

    // Apply sorting logic based on selected sort option
    if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "date") {
      filtered.sort((a, b) => new Date(b.created) - new Date(a.created)); // Sort by latest
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "priceHighToLow") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "priceLowToHigh") {
      filtered.sort((a, b) => a.price - b.price);
    }

    setFilteredVenues(filtered); // Set the filtered and sorted venues
  }, [filters, searchTerm, venues, sortBy]);

  const toggleFilter = (key) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      {/* Search bar */}
      <div className="pt-16 flex flex-row items-center justify-center mb-2">
      <div
          onClick={() => setShowFilters((prev) => !prev)}
          className="bg-blackSecondary h-8 w-8 flex justify-center items-center rounded-full mr-6 duration-150 cursor-pointer border-1 border-blackSecondary hover:border-grayPrimary"
        >
          <HiOutlineAdjustmentsHorizontal />
      </div>
        <div className="h-8 w-8 bg-whitePrimary flex justify-center items-center rounded-l">
          <BsSearch className="text-grayPrimary" />
        </div>
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-whitePrimary text-blackPrimary w-3/5 lg:w-1/5 p-1 outline-none h-8 rounded-r"
        />
      </div>

    {/* Filters and sorting */}
    {showFilters && (
      <Filter
        sortBy={sortBy}
        setSortBy={setSortBy}
        filters={filters}
        toggleFilter={toggleFilter}
      />
    )}


      <Pagination page={page} totalPages={totalPages} setPage={setPage} />

      {/* Venue list */}
      <ul className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {filteredVenues
          .slice((page - 1) * pageSize, page * pageSize) // Slice based on the current page
          .map((venue, index) => (
            <VenueCard key={`${venue.id}-${index}`} venue={venue} />
          ))}
      </ul>

      <Pagination page={page} totalPages={totalPages} setPage={setPage} />



    </>
  );
};

export default Browse;
