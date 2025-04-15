import HomePageCard from "../components/HomePageCard";
import HeroSlideshow from "../components/HeroSlideslow";

const Home = () => {
    return (
        <>
            <div
                id="overlay"
                className="w-full h-screen absolute top-0 z-20"
                style={{
                    backgroundImage: 'linear-gradient(to bottom, transparent 50%, #0e0e0e 100%)',
                }}
            ></div>
                <HeroSlideshow />
            <HomePageCard />
        </>
    );
};

export default Home;
