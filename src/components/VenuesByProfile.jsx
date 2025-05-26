import { useState, useEffect } from 'react';
import VenueCard from './VenueCard';
import Pagination from './Pagination';
import LoadingSpinner from './LoadingSpinner'; // <-- Import it here

const API_KEY = import.meta.env.VITE_API_KEY;

async function fetchVenuesByProfile(name, token, page = 1, limit = 10) {
  try {
    const response = await fetch(`https://v2.api.noroff.dev/holidaze/profiles/${name}/venues?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

function VenuesByProfile() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    const name = localStorage.getItem("name");
    const token = localStorage.getItem("token");

    if (name && token) {
      setLoading(true);
      fetchVenuesByProfile(name, token, page, limit)
        .then((data) => {
          if (data && data.data) {
            setVenues(data.data);
            setTotalPages(data.meta.pageCount);
          } else {
            setError("Failed to fetch venues.");
          }
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [page, limit]);

  if (loading) {
    return <LoadingSpinner />; // <-- Updated line
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {venues.length > 0 ? (
        <div>
          <Pagination 
        page={page} 
        totalPages={totalPages} 
        setPage={setPage} 
        isFirstPage={page === 1}
        isLastPage={page === totalPages}
      />
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl-grid-cols-5">
            {venues.map((venue) => (
              <li key={venue.id}>
                <VenueCard venue={venue} />
              </li>
            ))}
          </ul>
          <Pagination 
            page={page} 
            totalPages={totalPages} 
            setPage={setPage} 
            isFirstPage={page === 1}
            isLastPage={page === totalPages}
          />
        </div>
      ) : (
        <p className="my-6">No venues found.</p>
      )}
    </div>
  );
}

export default VenuesByProfile;
