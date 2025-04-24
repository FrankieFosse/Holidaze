import { useState, useEffect } from "react";
import { BsSearch } from "react-icons/bs";
import VenueCard from "../components/VenueCard";
import Filter from "../components/Filter"; // ✅ Import the Filter component

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

  const [page, setPage] = useState(1); // Track current page
  const pageSize = 50; // Number of venues per page


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
      <div className="pt-20 flex flex-row items-center justify-center mb-8">
        <div className="h-8 w-8 bg-whitePrimary flex justify-center items-center">
          <BsSearch className="text-grayPrimary" />
        </div>
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-whitePrimary text-blackPrimary w-3/5 p-1 outline-none h-8"
        />
      </div>

      {/* Filters and sorting */}
      <Filter
        sortBy={sortBy}
        setSortBy={setSortBy}
        filters={filters}
        toggleFilter={toggleFilter}
      />

      {/* Venue list */}
      <ul>
        {filteredVenues
          .slice((page - 1) * pageSize, page * pageSize) // Slice based on the current page
          .map((venue, index) => (
            <VenueCard key={`${venue.id}-${index}`} venue={venue} />
          ))}
      </ul>

      <div className="pagination-controls">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={filteredVenues.length <= page * pageSize}
        >
          Next
        </button>
      </div>


    </>
  );
};

export default Browse;
