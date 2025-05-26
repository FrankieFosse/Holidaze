import { useState, useEffect } from "react";
import HomePageCard from "../components/HomePageCard";
import HeroSlideshow from "../components/HeroSlideslow";
import Categories from "../components/Categories";

const Home = () => {
  const [slideshowLoaded, setSlideshowLoaded] = useState(false);

    useEffect(() => {
      document.title = "Home | Holidaze";
    }, []);  

  return (
    <>
      <HeroSlideshow onLoadComplete={() => setSlideshowLoaded(true)} />
      {slideshowLoaded && (
        <div className="flex flex-col 2xl:flex-row justify-center items-center 2xl:mx-24 2xl:gap-8">
          <HomePageCard />
          <Categories />
        </div>
      )}
    </>
  );
};

export default Home;
