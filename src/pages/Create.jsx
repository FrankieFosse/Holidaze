import { useState } from "react";
import { useNavigate } from "react-router";
import { FaPlus, FaTrash } from "react-icons/fa";

function Create({ handleVenueCreated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState([{ url: "", alt: "" }]);
  const [price, setPrice] = useState(0);
  const [maxGuests, setMaxGuests] = useState(1);
  const [meta, setMeta] = useState({
    wifi: false,
    parking: false,
    breakfast: false,
    pets: false,
  });
  const [location, setLocation] = useState({
    address: "",
    city: "",
    zip: "",
    country: "",
    continent: "",
    lat: 0,
    lng: 0,
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle adding a new media field
  const handleAddMedia = () => {
    setMedia([...media, { url: "", alt: "" }]);
  };

  // Handle removing a media field
  const handleRemoveMedia = (index) => {
    const updatedMedia = media.filter((_, i) => i !== index);
    setMedia(updatedMedia);
  };

  // Handle input change for each media
  const handleMediaChange = (index, field, value) => {
    const updatedMedia = media.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setMedia(updatedMedia);
  };

  // Handle input change for location fields
  const handleLocationChange = (field, value) => {
    setLocation({
      ...location,
      [field]: field === "lat" || field === "lng" ? parseFloat(value) : value,
    });
  };

  async function handleSubmit(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const owner = localStorage.getItem("name");

    if (!token || !owner) {
      setError("You must be logged in to create a venue.");
      return;
    }

    const venue = {
      name,
      description,
      media: media.filter((item) => item.url && item.alt),
      price: parseFloat(price),
      maxGuests: parseInt(maxGuests),
      meta,
      location,
    };

    try {
      const response = await fetch("https://v2.api.noroff.dev/holidaze/venues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": "178dd2f7-0bd8-4d9b-9ff9-78d8d5ac9bc9",
        },
        body: JSON.stringify(venue),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errors?.[0]?.message || "Failed to create venue.");
      }

      console.log(data)
      navigate("/profile", { state: { message: "Venue created successfully!" } });
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  }

  return (
    <div className="text-whitePrimary p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl mb-4">Create New Venue</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Venue name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="p-2 text-blackPrimary bg-whitePrimary"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="p-2 text-blackPrimary bg-whitePrimary"
        />

        {/* Media section with dynamic URL and alt text fields */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg">Images (Optional)</h3>
          {media.map((item, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                type="url"
                placeholder="Image URL"
                value={item.url}
                onChange={(e) => handleMediaChange(index, "url", e.target.value)}
                className="p-2 text-blackPrimary bg-whitePrimary flex-1"
              />
              <input
                type="text"
                placeholder="Image Alt Text"
                value={item.alt}
                onChange={(e) => handleMediaChange(index, "alt", e.target.value)}
                className="p-2 text-blackPrimary bg-whitePrimary flex-1"
              />
              {/* Trash icon to remove the image, only show if more than 1 field */}
              {media.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveMedia(index)}
                  className="text-red-500"
                >
                  <FaTrash size={20} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddMedia}
            className="flex items-center gap-2 text-blue-500"
          >
            <FaPlus size={20} />
            Add another image
          </button>
        </div>

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="p-2 text-blackPrimary bg-whitePrimary"
        />
        <input
          type="number"
          placeholder="Max guests"
          value={maxGuests}
          onChange={(e) => setMaxGuests(e.target.value)}
          required
          className="p-2 text-blackPrimary bg-whitePrimary"
        />

        <fieldset className="flex flex-col gap-2">
          <legend className="text-lg">Amenities</legend>
          {Object.entries(meta).map(([key, value]) => (
            <label key={key} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => setMeta({ ...meta, [key]: e.target.checked })}
              />
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
          ))}
        </fieldset>

        <fieldset className="flex flex-col gap-2">
          <legend className="text-lg">Location (optional)</legend>
          {Object.keys(location).map((field) => (
            <input
              key={field}
              type="text"
              placeholder={field}
              value={location[field]}
              onChange={(e) => handleLocationChange(field, e.target.value)}
              className="p-2 text-blackPrimary bg-whitePrimary"
              // For lat and lng, you might want to restrict input to numbers
              inputMode={field === "lat" || field === "lng" ? "numeric" : "text"}
            />
          ))}
        </fieldset>

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          className="bg-buttonPrimary text-white py-2 px-4 hover:bg-buttonSecondary"
        >
          Create Venue
        </button>
      </form>
    </div>
  );
}

export default Create;
