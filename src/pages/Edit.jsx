import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { FaPlus, FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { FaLocationDot } from "react-icons/fa6";
import StatusMessage from "../components/StatusMessage";
import Return from "../components/Return";

function Edit({ handleVenueUpdated }) {
  const { id } = useParams(); // Assuming you're using React Router params
  const [venue, setVenue] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("error"); // 'error' or 'success'
  const [invalidFields, setInvalidFields] = useState([]);
  const [showLocation, setShowLocation] = useState(false);

  const [media, setMedia] = useState([]);
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

  const navigate = useNavigate();

  // Fetch the venue data
  useEffect(() => {
    // Fetch venue details using the venueId
    const fetchVenueData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          `https://v2.api.noroff.dev/holidaze/venues/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Noroff-API-Key": "178dd2f7-0bd8-4d9b-9ff9-78d8d5ac9bc9",
            },
          }
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.errors?.[0]?.message || "Failed to fetch venue.");
        }

        setVenue(data.data);
        setMedia(data.data.media || []);
        setMeta(data.data.meta || {});
        setLocation(data.data.location || {});

        // Auto-expand Location section if any field is filled
        const loc = data.data.location || {};
        const hasLocationData = Object.values(loc).some(
        (val) => val !== "" && val !== 0 && val !== null && typeof val !== "undefined"
        );

        if (hasLocationData) {
            setShowLocation(true);
            setShouldAnimateLocation(false); // Prevent animation for auto-open
          }
          

      } catch (err) {
        console.error(err);
        showStatusMessage(err.message, "error");
      }
    };

    fetchVenueData();
  }, [id]);

  const [shouldAnimateLocation, setShouldAnimateLocation] = useState(false);

  const handleMediaChange = (index, field, value) => {
    const updatedMedia = media.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setMedia(updatedMedia);
  };

  const handleAddMedia = () => {
    setMedia([...media, { url: "", alt: "" }]);
  };

  // Handle removing a media field
  const handleRemoveMedia = (index) => {
    const updatedMedia = media.filter((_, i) => i !== index);
    setMedia(updatedMedia);
  };

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

  const showStatusMessage = (message, type = "error") => {
    setStatusMessage(message);
    setStatusType(type);

    setTimeout(() => {
      setStatusMessage("");
    }, 3000);
  };

  // Handle form submission for updating venue
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const owner = localStorage.getItem("name");

    if (!token || !owner) {
      showStatusMessage("You must be logged in to edit a venue.", "error");
      return;
    }

    const requiredFields = [];
    if (!venue.name) requiredFields.push("name");
    if (!venue.description) requiredFields.push("description");
    if (!venue.price) requiredFields.push("price");
    if (!venue.maxGuests) requiredFields.push("maxGuests");

    const validMedia = media.filter((item) => item.url.trim() !== "" && item.alt.trim() !== "");

    if (validMedia.length === 0) {
      showStatusMessage("You must provide at least one image with a description.", "error");
      return;
    }

    const hasInvalidAlt = media.some((item) => item.url.trim() && !item.alt.trim());
    if (hasInvalidAlt) {
      showStatusMessage("All images must have a description.", "error");
      return;
    }

    if (requiredFields.length > 0) {
      setInvalidFields(requiredFields);
      const fieldText = requiredFields.length === 1 ? "field" : "fields";
      showStatusMessage(`Please fill out the required ${fieldText}.`, "error");
      return;
    } else {
      setInvalidFields([]);
    }

    const updatedVenue = {
      ...venue,
      media: validMedia,
      meta,
      location,
    };



    try {
      const response = await fetch(
        `https://v2.api.noroff.dev/holidaze/venues/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": "178dd2f7-0bd8-4d9b-9ff9-78d8d5ac9bc9",
          },
          body: JSON.stringify(updatedVenue),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errors?.[0]?.message || "Failed to update venue.");
      }

      showStatusMessage("Venue updated successfully!", "success");

      setTimeout(() => {
        navigate(`/profile`);
      }, 2000);
    } catch (err) {
      console.error(err);
      showStatusMessage(err.message, "error");
    }
  };

  if (!venue) {
    return <div>Loading...</div>; // Placeholder while the venue data is being fetched
  }

  const amenityLabels = {
    wifi: "Wifi included",
    parking: "Parking included",
    breakfast: "Breakfast included",
    pets: "Pets allowed",
  };

  return (
    <div className="text-whitePrimary p-6 max-w-3xl mx-auto mt-16 text-xs">
      <Return />
      <StatusMessage message={statusMessage} type={statusType} />
      <h1 className="text-xl mb-4">Edit Venue</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Venue name"
          value={venue.name}
          onChange={(e) => setVenue({ ...venue, name: e.target.value })}
          className={`p-2 rounded text-blackPrimary bg-whitePrimary ${invalidFields.includes("name") ? "border-3 border-redPrimary" : ""}`}
        />

        <textarea
          placeholder="Description"
          value={venue.description}
          onChange={(e) => setVenue({ ...venue, description: e.target.value })}
          className={`p-2 min-h-16 rounded text-blackPrimary bg-whitePrimary ${invalidFields.includes("description") ? "border-3 border-redPrimary" : ""}`}
        />

        <div className="flex flex-row items-center">
          <input
            type="number"
            placeholder="Price"
            value={venue.price}
            onChange={(e) => setVenue({ ...venue, price: Number(e.target.value) })}
            min="0"
            max="10000"
            className={`p-2 h-8 w-full rounded-l text-blackPrimary bg-whitePrimary ${invalidFields.includes("price") ? "border-3 border-redPrimary" : ""}`}
          />
          <p className="w-42 h-8 bg-whitePrimary rounded-r text-grayPrimary cursor-default flex justify-center items-center px-4">
            NOK / night
          </p>
        </div>

        <input
          type="number"
          placeholder="Max guests"
          value={venue.maxGuests}
          onChange={(e) => setVenue({ ...venue, maxGuests: Number(e.target.value) })}
          min="1"
          max="100"
          className={`p-2 rounded text-blackPrimary bg-whitePrimary ${invalidFields.includes("maxGuests") ? "border-3 border-redPrimary" : ""}`}
        />

      <input
        type="number"
        placeholder="Rating (0 to 5)"
        value={venue.rating}
        onChange={(e) =>
          setVenue({ ...venue, rating: Number(e.target.value) })
        }
        min="0"
        max="5"
        step="0.1"
        className={`p-2 rounded text-blackPrimary bg-whitePrimary ${
          invalidFields.includes("rating") ? "border-3 border-redPrimary" : ""
        }`}
      />


        {/* Media section */}
        <div className="border-y-1 py-4 border-blackSecondary">
          <h3 className="text-sm">Images</h3>
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
                    className="p-2 text-blackPrimary bg-whitePrimary flex w-full rounded"
                  />
                  <input
                    type="text"
                    placeholder="Image Description"
                    value={item.alt}
                    onChange={(e) => handleMediaChange(index, "alt", e.target.value)}
                    className="p-2 text-blackPrimary bg-whitePrimary flex w-full rounded"
                  />

              {/* Thumbnail preview if valid image URL */}
              {item.url.trim() && (
                              <img
                                src={item.url}
                                alt={item.alt || "Venue image preview"}
                                className="w-32 h-20 object-cover rounded border-1 border-grayPrimary"
                                onError={(e) => (e.target.style.display = "none")}
                              />
                      )}

                  {media.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMedia(index)}
                      className="text-redPrimary rounded flex flex-row gap-2 cursor-pointer duration-150 hover:scale-x-105 justify-center items-center border-1 border-blackSecondary w-max py-1 px-3 hover:border-grayPrimary hover:text-redSecondary"
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
            className="flex items-center rounded gap-2 text-buttonPrimary justify-center mb-4 cursor-pointer duration-150 hover:scale-x-105 border-1 border-blackSecondary w-max py-1 px-3 hover:border-grayPrimary hover:text-buttonSecondary"
            >
            <FaPlus size={12} />
            {media.length === 0 ? "Add image" : "Add another image"}
            </button>
          </div>
        </div>

        <fieldset className="flex flex-col items-left justify-center pb-8 gap-4 w-max">
          {Object.entries(meta).map(([key, value]) => (
            <label key={key} className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={value}
                onChange={(e) => setMeta({ ...meta, [key]: e.target.checked })}
              />
              {amenityLabels[key]}
            </label>
          ))}
        </fieldset>

        <div className="flex flex-col gap-2 justify-center items-center border-t-1 border-blackSecondary pt-8">
          <h3 className="text-sm">Location (Optional)</h3>

          {!showLocation && (
            <button
            type="button"
            onClick={() => {
              setShowLocation(true);
              setShouldAnimateLocation(true);
              setTimeout(() => {
                window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
              }, 150);
            }}
            className="text-buttonPrimary border-1 border-blackSecondary py-2 px-4 hover:text-buttonSecondary w-max flex flex-row gap-2 cursor-pointer hover:border-grayPrimary hover:scale-x-105 duration-150 rounded"
          >
            <FaLocationDot />
            Add location (Optional)
          </button>
          
          )}

{shouldAnimateLocation ? (
  <AnimatePresence>
    {showLocation && (
      <motion.div
        key="location"
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden w-full"
        onAnimationComplete={() => {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
          });
        }}
      >
        <fieldset className="flex flex-col gap-2 mt-2">
        {Object.keys(location)
  .filter((field) => !["lat", "lng", "continent"].includes(field))
  .map((field) => (
    <input
      key={field}
      type={field === "zip" ? "number" : "text"}
      placeholder={fieldPlaceholders[field] || field}
      value={location[field]}
      onChange={(e) => handleLocationChange(field, e.target.value)}
      className="p-2 text-blackPrimary bg-whitePrimary rounded"
    />
))}

        </fieldset>
      </motion.div>
    )}
  </AnimatePresence>
        ) : (
        showLocation && (
            <div className="overflow-hidden w-full">
            <fieldset className="flex flex-col gap-2 mt-2">
            {Object.keys(location)
  .filter((field) => !["lat", "lng", "continent"].includes(field))
  .map((field) => (
    <input
      key={field}
      type={field === "zip" ? "number" : "text"}
      placeholder={fieldPlaceholders[field] || field}
      value={location[field]}
      onChange={(e) => handleLocationChange(field, e.target.value)}
      className="p-2 text-blackPrimary bg-whitePrimary rounded"
    />
))}

            </fieldset>
            </div>
        )
        )}

        </div>

        <div className="flex flex-col justify-center items-center">
        <button
          type="submit"
          className="bg-buttonPrimary text-white py-2 px-4 hover:bg-buttonSecondary w-2/4 cursor-pointer"
        >
          Save changes
        </button>
        </div>
      </form>
    </div>
  );
}

export default Edit;
