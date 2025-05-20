import { useState, useEffect } from "react";
import { FaChevronRight, FaChevronLeft, FaLongArrowAltRight } from "react-icons/fa";
import { Link } from "react-router";

const venueIds = [
  "85e8e3b6-1038-4dfb-bebf-a31f4c9a6ac0",
  "3f0f0154-632c-48dc-bb8c-771eff00e217",
  "95d632f7-95e9-461c-af8f-03c2827e7050",
];

function HeroSlideshow() {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const results = await Promise.all(
          venueIds.map((id) =>
            fetch(`https://v2.api.noroff.dev/holidaze/venues/${id}`)
              .then((res) => res.json())
              .then((json) => json.data)
          )
        );

        const formattedSlides = results.map((venue) => ({
          id: venue.id,
          url: venue.media?.[0]?.url || "/images/NoImagePlaceholder.jpg",
          title: venue.name,
          description: venue.description || "No description available.",
        }));

        setSlides(formattedSlides);
      } catch (err) {
        console.error("Failed to fetch venue data:", err);
      }
    };

    fetchVenues();
  }, []);

  useEffect(() => {
    if (paused || slides.length === 0) return;
    const interval = setInterval(() => nextSlide(), 5000);
    return () => clearInterval(interval);
  }, [current, paused, slides]);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.changedTouches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX) return;
    const distance = touchStartX - e.changedTouches[0].clientX;
    if (distance > 50) nextSlide();
    else if (distance < -50) prevSlide();
    setTouchStartX(null);
  };

  if (slides.length === 0) return <div>Loading...</div>;

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Overlay moved here */}
      <div
        className="absolute top-0 left-0 w-full h-full z-20 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, transparent 50%, #0e0e0e 100%)",
        }}
      ></div>

      {slides.map((slide, index) => (
        <img
          key={index}
          src={slide.url}
          className={`absolute top-0 left-0 w-full h-full object-cover brightness-75 transition-opacity duration-1000 ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
          alt={slide.title}
        />
      ))}

      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-2 z-30 transform -translate-y-1/2 bg-blackPrimary/25 p-2 rounded-full duration-150 cursor-pointer hover:bg-blackPrimary/75"
      >
        <FaChevronLeft size={20} className="pr-0.5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-2 z-30 transform -translate-y-1/2 bg-blackPrimary/25 p-2 rounded-full duration-150 cursor-pointer hover:bg-blackPrimary/75"
      >
        <FaChevronRight size={20} className="pl-0.5" />
      </button>

      {/* Slide info */}
      <div
        className="absolute bottom-8 right-4 w-2/4 lg:w-1/3 z-30 text-left"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <h1 className="text-xl font-bold lg:text-3xl">{slides[current].title}</h1>
        <p className="font-thin text-xs mt-2 lg:text-lg">{slides[current].description}</p>
        <Link to={`/venues/${slides[current].id}`}>
          <div className="flex items-center w-max py-2 px-4 bg-buttonPrimary hover:bg-buttonSecondary text-md mt-4 duration-150 cursor-pointer gap-4 rounded lg:text-2xl">
            <p>View more</p>
            <FaLongArrowAltRight />
          </div>
        </Link>
      </div>
    </div>
  );
}

export default HeroSlideshow;
