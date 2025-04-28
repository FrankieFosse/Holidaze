import { useState } from "react";
import { useNavigate } from "react-router";
import { FaPlus, FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { FaLocationDot } from "react-icons/fa6";

function Create({ handleVenueCreated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState([{ url: "", alt: "" }]);
  const [price, setPrice] = useState("");
  const [maxGuests, setMaxGuests] = useState("");
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
    lat: "",
    lng: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [showLocation, setShowLocation] = useState(false);

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

  const fieldPlaceholders = {
    address: "Address",
    city: "City",
    zip: "Zip",
    country: "Country",
    continent: "Continent",
    lat: "Latitude",
    lng: "Longitude",
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
    <div className="text-whitePrimary p-6 max-w-3xl mx-auto mt-16 text-xs">
      <h1 className="text-xl mb-4">Create New Venue</h1>

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

        <div className="flex flex-row items-center">
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="p-2 text-blackPrimary bg-whitePrimary h-8"
        />
        <p className="w-full h-8 bg-whitePrimary text-grayPrimary cursor-default flex justify-end items-center pr-4">
            NOK / night
        </p>
        </div>
        <input
          type="number"
          placeholder="Max guests"
          value={maxGuests}
          onChange={(e) => setMaxGuests(e.target.value)}
          required
          className="p-2 text-blackPrimary bg-whitePrimary"
        />

        {/* Media section with dynamic URL and alt text fields */}
        <div className="border-y-1 py-4 border-blackSecondary">
        <h3 className="text">Images (Optional)</h3>
        <div className="flex flex-col gap-4 mb-4 items-center justify-center">
        <AnimatePresence>
  {media.map((item, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-2 items-center w-full border-1 border-blackSecondary rounded p-4 overflow-hidden"
    >
      <input
        type="url"
        placeholder="Image URL"
        value={item.url}
        onChange={(e) => handleMediaChange(index, "url", e.target.value)}
        className="p-2 text-blackPrimary bg-whitePrimary flex w-full"
      />
      <input
        type="text"
        placeholder="Image Description"
        value={item.alt}
        onChange={(e) => handleMediaChange(index, "alt", e.target.value)}
        className="p-2 text-blackPrimary bg-whitePrimary flex w-full"
      />
      {media.length > 1 && (
        <button
          type="button"
          onClick={() => handleRemoveMedia(index)}
          className="text-redPrimary flex flex-row gap-2 cursor-pointer duration-150 hover:scale-x-105 justify-center items-center border-1 border-blackSecondary w-max py-1 px-3 hover:border-grayPrimary hover:text-redSecondary"
        >
          <FaTrash size={12} />
          Remove image
        </button>
      )}
        </motion.div>
        ))}
        </AnimatePresence>

          <button
            type="button"
            onClick={handleAddMedia}
            className="flex items-center gap-2 text-buttonPrimary justify-center mb-4 cursor-pointer duration-150 hover:scale-x-105 border-1 border-blackSecondary w-max py-1 px-3 hover:border-grayPrimary hover:text-buttonSecondary"
          >
            <FaPlus size={12} />
            Add another image
          </button>
        </div>
        </div>



        <fieldset className="flex flex-col items-left justify-center border-b-1 border-blackSecondary pb-8">
          <legend className="text-lg">Amenities</legend>
          {Object.entries(meta).map(([key, value]) => (
            <label key={key} className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={value}
                onChange={(e) => setMeta({ ...meta, [key]: e.target.checked })}
              />
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
          ))}
        </fieldset>

        <div className="flex flex-col gap-2 justify-center items-center">

        <h3 className="text-lg">Location (Optional)</h3>
            
        {!showLocation ? (
            <button
            type="button"
            onClick={() => setShowLocation(true)}
            className="text-buttonPrimary border-1 border-blackSecondary py-2 px-4 hover:text-buttonSecondary w-max flex flex-row gap-2 cursor-pointer hover:border-grayPrimary hover:scale-x-105 duration-150"
            >
            <FaLocationDot />
            Add location (Optional)
            </button>
        ) : (
            <>
                        <button
                type="button"
                onClick={() => setShowLocation(false)}
                className="bg-redPrimary text-white py-1 px-3 hover:bg-redSecondary w-max mt-2"
            >
                Close
            </button>
            <fieldset className="flex flex-col gap-2">
                {Object.keys(location).map((field) => (
                <input
                    key={field}
                    type="text"
                    placeholder={fieldPlaceholders[field] || field}
                    value={location[field]}
                    onChange={(e) => handleLocationChange(field, e.target.value)}
                    className="p-2 text-blackPrimary bg-whitePrimary"
                    inputMode={field === "lat" || field === "lng" ? "numeric" : "text"}
                />
                ))}
            </fieldset>


            </>
        )}
        </div>


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
