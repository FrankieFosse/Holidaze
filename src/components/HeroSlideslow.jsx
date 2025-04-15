import { useState, useEffect } from "react";
import { FaChevronRight, FaChevronLeft, FaLongArrowAltRight } from "react-icons/fa";

const slides = [
  {
    url: "https://res.cloudinary.com/dtljonz0f/image/upload/c_auto,ar_4:3,w_3840,g_auto/f_auto/q_auto/v1/shutterstock_2118458942_ss_non-editorial_jnjpwq?_a=BAVAZGDX0",
    title: "Paris",
    description:
      "City of light, love, and art— iconic Eiffel Tower, charming cafés, rich history, timeless beauty.",
  },
  {
    url: "https://images.ctfassets.net/7mmwp5vb96tc/bYlcFkhq0IMCnebQSU2q6/3a266befbde003aa455ef23e16286bbf/bergen-norway-hgr-143160_1920-photo_shutterstock.jpg?q=40&w=3840&fm=webp",
    title: "Bergen",
    description:
      "Gateway to the fjords—colorful houses, mountains, and magical nature. Norway at its finest.",
  },
  {
    url: "https://a.travel-assets.com/findyours-php/viewfinder/images/res70/348000/348698-Madrid.jpg",
    title: "Madrid",
    description:
      "Spain’s vibrant heart—art, culture, flamenco, and nightlife pulsing through historic streets.",
  },
];

function HeroSlideshow() {
  const [current, setCurrent] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [current, paused]);

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

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
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

      {/* Arrows */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 z-20 transform -translate-y-1/2 bg-blackPrimary opacity-75 text-white p-2 rounded-full duration-150 cursor-pointer hover:opacity-100"
      >
        <FaChevronLeft size={24} className="pr-0.5"/>
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 z-20 transform -translate-y-1/2 bg-blackPrimary opacity-75 text-white p-2 rounded-full duration-150 cursor-pointer hover:opacity-100"
      >
        <FaChevronRight size={24} className="pl-0.5" />
      </button>

      {/* Overlay content block with pause on hover */}
      <div
        className="absolute bottom-1/8 right-8 w-2/4 text-white z-20 text-left px-4"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <h1 className="text-4xl font-bold">{slides[current].title}</h1>
        <p className="font-thin mt-2">{slides[current].description}</p>
        <div className="flex items-center w-max py-4 px-6 bg-buttonPrimary hover:bg-buttonSecondary text-xl mt-4 duration-150 cursor-pointer gap-4">
          <p>View more</p>
          <FaLongArrowAltRight />
        </div>
      </div>
    </div>
  );
}

export default HeroSlideshow;
