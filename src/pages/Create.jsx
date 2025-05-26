import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { FaPlus, FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { FaLocationDot } from "react-icons/fa6";
import StatusMessage from "../components/StatusMessage";


function Create({ handleVenueCreated }) {
  const API_KEY = import.meta.env.VITE_API_KEY;
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
  });
  const navigate = useNavigate();

  const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
      document.title = "Create venue | Holidaze";
    }, []);  

  const [statusMessage, setStatusMessage] = useState(null);
  const [statusType, setStatusType] = useState("error"); // 'error' or 'success'
  const [invalidFields, setInvalidFields] = useState([]);

  const [showLocation, setShowLocation] = useState(false);

  const [invalidImageURLs, setInvalidImageURLs] = useState([]);

  function isValidImageUrl(url) {
    const regex = /\.(jpeg|jpg|gif|png|webp|bmp|svg)$/i;
    try {
      const parsed = new URL(url);
      return regex.test(parsed.pathname);
    } catch {
      return false;
    }
  }
  

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

  useEffect(() => {
    const draft = localStorage.getItem("draftVenue");
    if (draft) {
      const data = JSON.parse(draft);
      setName(data.name || "");
      setDescription(data.description || "");
      setMedia(data.media || [{ url: "", alt: "" }]);
      setPrice(data.price || "");
      setMaxGuests(data.maxGuests || "");
      setMeta(data.meta || {});
      setLocation(data.location || {});
    }
  }, []);  

  const fieldPlaceholders = {
    address: "Address",
    city: "City",
    zip: "Zip",
    country: "Country",
    continent: "Continent",
    lat: "Latitude",
    lng: "Longitude",
  };

  // Handle status message
  const showStatusMessage = (message, type = "error") => {
    setStatusMessage(message);
    setStatusType(type);

    // Clear status message after 3 seconds
    setTimeout(() => {
      setStatusMessage(null);
    }, 2100); // 3 seconds
  };

  function validateVenueInputs() {
    const requiredFields = [];
    const priceValue = parseFloat(price);
    const maxGuestsValue = parseInt(maxGuests);
  
    if (!name) requiredFields.push("name");
    if (!description) requiredFields.push("description");
    if (!price) requiredFields.push("price");
    if (!maxGuests) requiredFields.push("maxGuests");
  
    const validMedia = media.filter((item) => item.url.trim() !== "" && item.alt.trim() !== "");
  
    if (validMedia.length === 0) {
      showStatusMessage("You must provide at least one image with a description.", "error");
      return { isValid: false };
    }
  
    const invalidURLs = media
      .map((item, index) => (!isValidImageUrl(item.url) ? index : null))
      .filter((index) => index !== null);
  
    if (invalidURLs.length > 0) {
      setInvalidImageURLs(invalidURLs);
      showStatusMessage("One or more image URLs are invalid.", "error");
      return { isValid: false };
    }
  
    const hasInvalidAlt = media.some((item) => item.url.trim() && !item.alt.trim());
    if (hasInvalidAlt) {
      showStatusMessage("All images must have a description.", "error");
      return { isValid: false };
    }
  
    if (requiredFields.length > 0) {
      setInvalidFields(requiredFields);
      const fieldText = requiredFields.length === 1 ? "field" : "fields";
      showStatusMessage(`Please fill out the required ${fieldText}.`, "error");
      return { isValid: false };
    }
  
    // Additional bounds validation
    if (priceValue < 0 || priceValue > 10000) {
      showStatusMessage("Price must be between 0 and 10,000 NOK.", "error");
      return { isValid: false };
    }
  
    if (maxGuestsValue < 1 || maxGuestsValue > 100) {
      showStatusMessage("Max guests must be between 1 and 100.", "error");
      return { isValid: false };
    }
  
    setInvalidFields([]);
    setInvalidImageURLs([]);
  
    return {
      isValid: true,
      venueData: {
        name,
        description,
        media: validMedia,
        price,
        maxGuests,
        meta,
        location,
      },
    };
  }
  
  
  

  async function handleSubmit(e) {
    e.preventDefault();
  
    const token = localStorage.getItem("token");
    const owner = localStorage.getItem("name");
  
    if (!token || !owner) {
      showStatusMessage("You must be logged in to create a venue.", "error");
      return;
    }
  
    const validation = validateVenueInputs();
    if (!validation.isValid) return;
  
    const venue = {
      name: validation.venueData.name,
      description: validation.venueData.description,
      media: validation.venueData.media,
      price: parseFloat(validation.venueData.price),
      maxGuests: parseInt(validation.venueData.maxGuests),
      meta: validation.venueData.meta,
      location: validation.venueData.location,
    };
  
    try {
      const response = await fetch("https://v2.api.noroff.dev/holidaze/venues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": API_KEY,
        },
        body: JSON.stringify(venue),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.errors?.[0]?.message || "Failed to create venue.");
      }
  
      showStatusMessage("Creating venue...", "loading");
  
      // Let animation/rendering happen first
      requestAnimationFrame(() => {
        navigate("/profile");
        localStorage.removeItem("draftVenue");
      });
  
    } catch (err) {
      console.error(err);
      showStatusMessage(err.message, "error");
    }
  }
  

  const amenityLabels = {
    wifi: "Wifi included",
    parking: "Parking included",
    breakfast: "Breakfast included",
    pets: "Pets allowed",
  };

  return (
    <div className="text-whitePrimary p-6 max-w-3xl mx-auto mt-16 text-xs 2xl:text-lg">
      <StatusMessage message={statusMessage} type={statusType} />
      <h1 className="text-xl mb-4">Create New Venue</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Venue name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`p-2 text-blackPrimary bg-whitePrimary rounded ${invalidFields.includes("name") ? "border-3 border-redPrimary" : ""}`}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`p-2 min-h-16 text-blackPrimary bg-whitePrimary rounded ${invalidFields.includes("description") ? "border-3 border-redPrimary" : ""}`}
        />

        <div className="flex flex-row items-center">
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className={`p-2 min-h-8 w-full text-blackPrimary bg-whitePrimary rounded-l ${invalidFields.includes("price") ? "border-3 border-redPrimary" : ""}`}
        />
          <p className="w-42 min-h-8 bg-whitePrimary text-grayPrimary cursor-default flex justify-center items-center py-2 px-4 rounded-r">
            NOK / night
          </p>
        </div>

        <input
          type="number"
          placeholder="Max guests"
          value={maxGuests}
          onChange={(e) => setMaxGuests(e.target.value)}
          className={`p-2 text-blackPrimary bg-whitePrimary rounded ${invalidFields.includes("maxGuests") ? "border-3 border-redPrimary" : ""}`}
        />

        {/* Media section */}
        <div className="border-y-1 py-4 border-blackSecondary">
        <h3 className="text-sm">
          Images {media.length > 1 && <span className="text-grayPrimary">({media.length})</span>}
        </h3>
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
                type="text"
                placeholder="Image URL"
                value={item.url}
                onChange={(e) => handleMediaChange(index, "url", e.target.value)}
                className={`p-2 text-blackPrimary bg-whitePrimary flex w-full rounded ${invalidImageURLs.includes(index) ? "border-2 border-redPrimary" : ""}`}
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
                  className="text-redPrimary flex flex-row gap-2 cursor-pointer duration-150 hover:scale-x-105 justify-center items-center border-1 border-blackSecondary w-max py-1 px-3 hover:border-grayPrimary hover:text-redSecondary rounded"
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
              className="flex items-center gap-2 text-buttonPrimary justify-center mb-4 cursor-pointer duration-150 hover:scale-x-105 border-1 border-blackSecondary w-max py-1 px-3 hover:border-grayPrimary hover:text-buttonSecondary rounded"
            >
              <FaPlus size={12} />
              Add another image
            </button>
          </div>
        </div>

        <fieldset className="flex flex-col items-left justify-center gap-4 w-max">
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

        <div className="flex flex-col gap-2 justify-center items-center border-t-1 border-blackSecondary pt-4">
          <h3 className="text-sm">Location (Optional)</h3>

          {!showLocation && (
            <button
              type="button"
              onClick={() => {
                setShowLocation(true);
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
        </div>

        <div className="flex justify-evenly w-full gap-4">

        <button
        type="button"
        onClick={() => {
          const validation = validateVenueInputs();
          if (!validation.isValid) return;
        
          const totalValidImages = validation.venueData.media.length;
          if (totalValidImages > 8) {
            showStatusMessage("You cannot have more than 8 images", "error");
            return;
          }
        
          localStorage.setItem("draftVenue", JSON.stringify(validation.venueData));
          navigate("/preview", { state: validation.venueData });
        }}
        
        className="bg-buttonPrimary text-white py-2 px-4 hover:bg-buttonSecondary cursor-pointer duration-150 rounded"
      >
        Preview Venue
      </button>


          <button
            type="submit"
            className="bg-buttonPrimary text-white py-2 px-4 hover:bg-buttonSecondary cursor-pointer duration-150 rounded"
          >
            Create Venue
          </button>
        </div>


      

      </form>
    </div>
  );
}

export default Create;
