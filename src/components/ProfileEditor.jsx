import { BsQuestionLg } from "react-icons/bs";
import { useState, useEffect } from "react";
import clsx from "clsx"; // Optional: for cleaner class toggling
import StatusMessage from "./StatusMessage";

function ProfileEditor({ onCancel }) {
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarAlt, setAvatarAlt] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [bannerAlt, setBannerAlt] = useState("");
  const [venueManager, setVenueManager] = useState(false);
  const [pendingVenueManager, setPendingVenueManager] = useState(false);
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("error");

  function showStatusMessage(msg, type = "error") {
    setStatusMessage(msg);
    setStatusType(type);
    if (type !== "loading") {
      setTimeout(() => setStatusMessage(""), 2000);
    }
  }

  const defaultBanners = [
    {
      url: "https://imgur.com/kY8WyV2.jpg",
      alt: "Calm misty lake surrounded by mountains",
    },
    {
      url: "https://imgur.com/3KqlrQ0.jpg",
      alt: "Abstract vintage wavy lines",
    },
    {
      url: "https://imgur.com/LslUoJu.jpg",
      alt: "Modern digital dark blue wavy lines",
    },
    {
      url: "https://imgur.com/cXJVLKT.jpg",
      alt: "Abstract wavy lines light themed",
    },
    {
      url: "https://imgur.com/5hJGRwo.jpg",
      alt: "Abstract multi-color painted wallpaper",
    },
    {
      url: "https://imgur.com/cocbC1G.jpg",
      alt: "Abstract geometric snowy mountains",
    },
  ];

  useEffect(() => {
    setBio(localStorage.getItem("bio") || "");
    setAvatarUrl(localStorage.getItem("avatar.url") || "");
    setAvatarAlt(localStorage.getItem("avatar.alt") || "");
    setBannerUrl(localStorage.getItem("banner.url") || "");
    setBannerAlt(localStorage.getItem("banner.alt") || "");
    const isManager = localStorage.getItem("venueManager") === "true";
    setVenueManager(isManager);
    setPendingVenueManager(isManager);
  }, []);

  async function updateProfile(event) {
    event.preventDefault();

    if (bio.length > 160) {
      setError("Bio must be 160 characters or less.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const name = localStorage.getItem("name");
      const token = localStorage.getItem("token");

      const body = {
        bio,
        avatar: {
          url: avatarUrl,
          alt: avatarAlt,
        },
        banner: {
          url: bannerUrl,
          alt: bannerAlt,
        },
        venueManager: pendingVenueManager,
      };

      const response = await fetch(`https://v2.api.noroff.dev/holidaze/profiles/${name}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": `178dd2f7-0bd8-4d9b-9ff9-78d8d5ac9bc9`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errors?.[0]?.message || "Profile update failed.");
      }

      localStorage.setItem("bio", bio);
      localStorage.setItem("avatar.url", avatarUrl);
      localStorage.setItem("avatar.alt", avatarAlt);
      localStorage.setItem("banner.url", bannerUrl);
      localStorage.setItem("banner.alt", bannerAlt);
      setVenueManager(pendingVenueManager);
      localStorage.setItem("venueManager", pendingVenueManager.toString());

      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Optional: Refresh after a delay
      setTimeout(() => {
        location.reload();
      }, 1500);

    } catch (error) {
      console.error(error.message);
      setError(error.message);
      setLoading(false);
    }
  }

  // New function to handle default banner click and update alt text
  function handleBannerClick(url, alt) {
    setBannerUrl(url);
    setBannerAlt(alt); // Set alt text when banner is selected
  }

  return (
    <div className="bg-blackSecondary text-whitePrimary w-full p-4 mt-5">
      <StatusMessage message={statusMessage} type={statusType} />

      {loading && (
        <div className="flex items-center justify-center gap-3 bg-buttonPrimary py-2 px-4 rounded mt-2 text-sm">
          <div className="border-2 border-white border-t-transparent rounded-full w-5 h-5 animate-spin" />
          Updating profile...
        </div>
      )}

      {error && (
        <div className="text-red-500 bg-red-100 px-4 py-2 mt-2 text-sm rounded">
          {error}
        </div>
      )}

      <form onSubmit={updateProfile} className="flex flex-col gap-4 items-center text-xs">
        <div className="w-full flex flex-col gap-1">
          <label htmlFor="bio">Bio (max 160 characters)</label>
          <textarea
            id="bio"
            className="bg-whitePrimary text-blackPrimary w-full min-h-16 p-2 outline-none"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={160}
          />
        </div>

        <div className="w-full flex flex-col gap-1">
          <label htmlFor="avatarUrl">Avatar URL</label>
          <input
            id="avatarUrl"
            type="text"
            className="bg-whitePrimary text-blackPrimary w-full p-2 outline-none"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
          />
        </div>

        <div className="w-full flex flex-col gap-1">
          <label htmlFor="avatarAlt">Avatar Description</label>
          <input
            id="avatarAlt"
            type="text"
            className="bg-whitePrimary text-blackPrimary w-full p-2 outline-none"
            value={avatarAlt}
            onChange={(e) => setAvatarAlt(e.target.value)}
          />
        </div>

        <div className="w-full flex flex-col gap-1 mt-4">
          <label htmlFor="bannerUrl">Banner URL</label>
          <input
            id="bannerUrl"
            type="text"
            className="bg-whitePrimary text-blackPrimary w-full p-2 outline-none"
            value={bannerUrl}
            onChange={(e) => setBannerUrl(e.target.value)}
          />
        </div>

        <div className="w-full flex flex-col gap-1">
          <label htmlFor="bannerAlt">Banner Description</label>
          <input
            id="bannerAlt"
            type="text"
            className="bg-whitePrimary text-blackPrimary w-full p-2 outline-none"
            value={bannerAlt}
            onChange={(e) => setBannerAlt(e.target.value)}
          />
        </div>

        {!venueManager && (
          <div className="w-full border border-grayPrimary p-4 flex flex-col items-center">
            <div className="flex flex-row items-center gap-4">
              <p className="text-sm font-thin">Do you want to be a venue manager?</p>
              <BsQuestionLg
                title="This gives you access to create your own venues"
                className="bg-blackPrimary border border-grayPrimary rounded-full h-6 w-6 p-1 cursor-help"
              />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <label htmlFor="checkbox">Yes</label>
              <input
                id="checkbox"
                type="checkbox"
                checked={pendingVenueManager}
                onChange={(e) => setPendingVenueManager(e.target.checked)}
                className="h-6 w-6"
              />
            </div>
          </div>
        )}

        {/* Default Banners */}
        <div className="w-full">
          <h3 className="text-xs mb-2">Default Banners</h3>
          <div className="grid grid-cols-3 gap-2">
            {defaultBanners.map((banner, idx) => (
              <img
                key={idx}
                src={banner.url}
                alt={banner.alt}
                className={clsx(
                  "cursor-pointer rounded-lg border-2 duration-150 h-12 object-cover",
                  bannerUrl === banner.url
                    ? "border-buttonPrimary scale-105"
                    : "border-transparent hover:border-grayPrimary"
                )}
                onClick={() => handleBannerClick(banner.url, banner.alt)} // Update both URL and alt
              />
            ))}
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-between w-full">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 cursor-pointer duration-150 hover:scale-105"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-buttonPrimary text-white px-4 py-2 hover:bg-buttonSecondary duration-150 cursor-pointer"
          >
            Confirm
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProfileEditor;
