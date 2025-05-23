import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { BsSearch } from "react-icons/bs";
import VenueCard from "../components/VenueCard";
import Filter from "../components/Filter";
import Pagination from "../components/Pagination";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import LoadingSpinner from "../components/LoadingSpinner"; // ✅ Import the spinner

const Browse = () => {
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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
  const [page, setPage] = useState(1);
  const pageSize = 50;
  const totalPages = Math.ceil(filteredVenues.length / pageSize);

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get("search");
    if (search) {
      setSearchTerm(search);
    }
  }, [location.search]);

  const fetchAllVenues = async () => {
    let allVenues = [];
    let page = 1;
    const limit = 100;

    try {
      setLoading(true);
      while (true) {
        const response = await fetch(
          `https://v2.api.noroff.dev/holidaze/venues?page=${page}&limit=${limit}`
        );
        const data = await response.json();
        if (data.data.length === 0) break;
        allVenues = [...allVenues, ...data.data];
        page += 1;
      }
      setVenues(allVenues);
    } catch (err) {
      setError("Failed to load venues.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllVenues();
  }, []);

  useEffect(() => {
    let filtered = [...venues];

    if (filters.wifi) filtered = filtered.filter(v => v.meta?.wifi);
    if (filters.parking) filtered = filtered.filter(v => v.meta?.parking);
    if (filters.breakfast) filtered = filtered.filter(v => v.meta?.breakfast);
    if (filters.pets) filtered = filtered.filter(v => v.meta?.pets);

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((venue) =>
        venue.name?.toLowerCase().includes(term) ||
        venue.description?.toLowerCase().includes(term) ||
        venue.location?.address?.toLowerCase().includes(term)
      );
    }

    switch (sortBy) {
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "date":
        filtered.sort((a, b) => new Date(b.created) - new Date(a.created));
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "priceHighToLow":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "priceLowToHigh":
        filtered.sort((a, b) => a.price - b.price);
        break;
      default:
        break;
    }

    setFilteredVenues(filtered);
  }, [filters, searchTerm, venues, sortBy]);

  const toggleFilter = (key) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      {/* Search bar */}
      <div className="pt-16 lg:pt-4 flex flex-row items-center justify-center mb-2">
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

      {showFilters && (
        <Filter
          sortBy={sortBy}
          setSortBy={setSortBy}
          filters={filters}
          toggleFilter={toggleFilter}
        />
      )}

      <Pagination page={page} totalPages={totalPages} setPage={setPage} />

      {filteredVenues.length === 0 ? (
          <p className="text-center text-grayPrimary mt-8 text-lg">No venues found.</p>
        ) : (
          <ul className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 grid-flow-dense">
            {filteredVenues
              .slice((page - 1) * pageSize, page * pageSize)
              .map((venue, index) => (
                <VenueCard key={`${venue.id}-${index}`} venue={venue} />
              ))}
          </ul>
        )}



      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </>
  );
};

export default Browse;
