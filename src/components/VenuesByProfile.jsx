import { useState, useEffect } from 'react';
import VenueCard from './VenueCard'; // Import VenueCard component

async function fetchVenuesByProfile(name, token) {
  try {
    const response = await fetch(`https://v2.api.noroff.dev/holidaze/profiles/${name}/venues`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": `178dd2f7-0bd8-4d9b-9ff9-78d8d5ac9bc9`,
      },
    });

    const data = await response.json();
    console.log(data.data);
    return data.data; // Return the data so it can be set in state
  } catch (error) {
    console.error(error.message);
    return null; // Return null if an error occurs
  }
}

function VenuesByProfile() {
  const [venues, setVenues] = useState([]); // State to store venues
  const [loading, setLoading] = useState(true); // Loading state to manage fetching process
  const [error, setError] = useState(null); // Error state to handle errors

  useEffect(() => {
    const name = localStorage.getItem("name");
    const token = localStorage.getItem("token");

    // Call the fetchVenuesByProfile function
    if (name && token) {
      fetchVenuesByProfile(name, token)
        .then((data) => {
          if (data) {
            setVenues(data); // Set the fetched venues
          } else {
            setError("Failed to fetch venues.");
          }
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false)); // Set loading to false after fetch is complete
    }
  }, []); // Empty dependency array to run the effect only once after mount

  if (loading) {
    return <div>Loading...</div>; // Show loading text while fetching
  }

  if (error) {
    return <div>Error: {error}</div>; // Display error message if fetch fails
  }

  return (
    <div>
      {venues.length > 0 ? (
        <ul className="">
          {venues.map((venue) => (
            <li key={venue.id}>
              {/* Render VenueCard with the venue data as props */}
              <VenueCard venue={venue} />
            </li>
          ))}
        </ul>
      ) : (
        <p>No venues found.</p>
      )}
    </div>
  );
}

export default VenuesByProfile;
