import HomePageCard from "../components/HomePageCard";
import HeroSlideshow from "../components/HeroSlideslow";
import Categories from "../components/Categories";

const Home = () => {
    return (
        <>
            <HeroSlideshow />
            <div className="flex flex-col 2xl:flex-row justify-center items-center 2xl:mx-24 2xl:gap-8">
            <HomePageCard />
            <Categories />
            </div>
        </>
    );
};

export default Home;
