import { BsQuestionLg } from "react-icons/bs";
import { useState, useEffect } from "react";

function ProfileEditor({ onCancel }) {
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarAlt, setAvatarAlt] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [bannerAlt, setBannerAlt] = useState("");
  const [venueManager, setVenueManager] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setBio(localStorage.getItem("bio") || "");
    setAvatarUrl(localStorage.getItem("avatar.url") || "");
    setAvatarAlt(localStorage.getItem("avatar.alt") || "");
    setBannerUrl(localStorage.getItem("banner.url") || "");
    setBannerAlt(localStorage.getItem("banner.alt") || "");
    setVenueManager(localStorage.getItem("venueManager") === "true");
  }, []);

  async function updateProfile(event) {
    event.preventDefault();

    if (bio.length > 160) {
      setError("Bio must be 160 characters or less.");
      return;
    }

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
        venueManager,
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

      // Save to localStorage
      localStorage.setItem("bio", bio);
      localStorage.setItem("avatar.url", avatarUrl);
      localStorage.setItem("avatar.alt", avatarAlt);
      localStorage.setItem("banner.url", bannerUrl);
      localStorage.setItem("banner.alt", bannerAlt);
      localStorage.setItem("venueManager", venueManager.toString());

      alert("Profile updated!");
      location.reload();
      setError("");

    } catch (error) {
      console.error(error.message);
      setError(error.message);
    }
  }

  return (
    <div className="bg-blackSecondary text-whitePrimary w-full p-10 relative top-5">
      <form onSubmit={updateProfile} className="flex flex-col gap-4 items-center">
        <textarea
          placeholder="Bio (max 160 characters)"
          className="bg-whitePrimary text-blackPrimary w-full min-h-24 p-2 outline-none"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={160}
        />

        <input
          type="text"
          placeholder="Avatar URL"
          className="bg-whitePrimary text-blackPrimary w-full p-2 outline-none"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
        />
        <input
          type="text"
          placeholder="Avatar alt text"
          className="bg-whitePrimary text-blackPrimary w-full p-2 outline-none"
          value={avatarAlt}
          onChange={(e) => setAvatarAlt(e.target.value)}
        />

        <input
          type="text"
          placeholder="Banner URL"
          className="bg-whitePrimary text-blackPrimary w-full p-2 outline-none"
          value={bannerUrl}
          onChange={(e) => setBannerUrl(e.target.value)}
        />
        <input
          type="text"
          placeholder="Banner alt text"
          className="bg-whitePrimary text-blackPrimary w-full p-2 outline-none"
          value={bannerAlt}
          onChange={(e) => setBannerAlt(e.target.value)}
        />

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
                checked={venueManager}
                onChange={(e) => setVenueManager(e.target.checked)}
                className="h-6 w-6"
              />
            </div>
          </div>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-between w-full">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 cursor-pointer hover:scale-105"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-buttonPrimary text-white px-4 py-2 hover:bg-buttonSecondary duration-150"
          >
            Confirm
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProfileEditor;
