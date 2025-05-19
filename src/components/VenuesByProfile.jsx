import { useState, useEffect } from 'react';
import VenueCard from './VenueCard'; // Import VenueCard component
import Pagination from './Pagination'; // Import Pagination component

async function fetchVenuesByProfile(name, token, page = 1, limit = 10) {
  try {
    const response = await fetch(`https://v2.api.noroff.dev/holidaze/profiles/${name}/venues?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": `178dd2f7-0bd8-4d9b-9ff9-78d8d5ac9bc9`,
      },
    });

    const data = await response.json();
    return data; // Return the entire data object, including the meta and data arrays
  } catch (error) {
    console.error(error.message);
    return null; // Return null if an error occurs
  }
}

function VenuesByProfile() {
  const [venues, setVenues] = useState([]); // State to store venues
  const [loading, setLoading] = useState(true); // Loading state to manage fetching process
  const [error, setError] = useState(null); // Error state to handle errors
  const [page, setPage] = useState(1); // State to track the current page
  const [totalPages, setTotalPages] = useState(1); // State to track the total number of pages
  const [limit] = useState(10); // Set limit per page

  useEffect(() => {
    const name = localStorage.getItem("name");
    const token = localStorage.getItem("token");

    // Fetch venues when page changes
    if (name && token) {
      setLoading(true); // Set loading to true when the fetch starts
      fetchVenuesByProfile(name, token, page, limit)
        .then((data) => {
          if (data && data.data) {
            setVenues(data.data); // Set the fetched venues
            setTotalPages(data.meta.pageCount); // Set the total pages from the API response
          } else {
            setError("Failed to fetch venues.");
          }
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false)); // Set loading to false after fetch is complete
    }
  }, [page, limit]); // Re-fetch venues when the page changes

  if (loading) {
    return <div>Loading...</div>; // Show loading text while fetching
  }

  if (error) {
    return <div>Error: {error}</div>; // Display error message if fetch fails
  }

  return (
    <div>
      {/* Pagination Component */}
      <Pagination 
            page={page} 
            totalPages={totalPages} 
            setPage={setPage} 
            isFirstPage={page === 1}
            isLastPage={page === totalPages}
          />
      {venues.length > 0 ? (
        <div>
          <div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl-grid-cols-5">
            {venues.map((venue) => (
              <li key={venue.id}>
                {/* Render VenueCard with the venue data as props */}
                <VenueCard venue={venue} />
              </li>
            ))}
          </ul>
          </div>

          {/* Pagination Component */}
          <Pagination 
            page={page} 
            totalPages={totalPages} 
            setPage={setPage} 
            isFirstPage={page === 1}
            isLastPage={page === totalPages}
          />
        </div>
      ) : (
        <p>No venues found.</p>
      )}
    </div>
  );
}

export default VenuesByProfile;
