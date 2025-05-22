import { useNavigate } from "react-router";

function HomePageCard() {

    const navigate = useNavigate();

    const goToBrowse = (city) => {
      navigate(`/browse?search=${encodeURIComponent(city)}`);
    };

    return (
        <div className="bg-blackPrimary py-4 flex flex-col gap-4 mt-4 justify-center items-center mb-8">
            <h2>Popular Destinations</h2>
            <div onClick={() => goToBrowse("Paris")}
                className="relative w-11/12 sm:w-3/4 md:w-2/3 2xl:w-2/4 h-36 sm:h-48 group cursor-pointer duration-300 bottom-0 hover:bottom-0.5"
            >
                <img
                    src="https://wallpapercat.com/w/full/2/e/8/293782-3840x2160-desktop-4k-paris-background-image.jpg"
                    className="w-full h-full object-cover brightness-90 rounded-2xl"
                    alt="Card"
                />
                <div
                    id="overlay"
                    className="absolute top-0 left-0 w-full h-full z-10"
                    style={{
                        backgroundImage: 'linear-gradient(to right, #1F1F1F 50%, transparent 60%)',
                        opacity: 0.50
                    }}
                ></div>
                <div className="absolute top-0 left-0 w-2/4 h-full flex justify-center items-center">
                    <p className="text-whitePrimary text-lg sm:text-2xl z-20 transform transition-transform duration-300 group-hover:scale-110 bg-buttonPrimary hover:border-1 hover:border-whitePrimary px-4 py-2 rounded">
                        Paris
                    </p>
                </div>
            </div>



            <div onClick={() => goToBrowse("London")}
                className="relative w-11/12 sm:w-3/4 md:w-2/3 2xl:w-2/4 h-36 sm:h-48 group cursor-pointer duration-300 bottom-0 hover:bottom-0.5"
            >
                <img
                    src="https://static2.tripoto.com/media/filter/tst/img/1516992/Image/1659080744_shutterstock_630926663.jpg.webp"
                    className="w-full h-full object-cover brightness-90 rounded-2xl"
                    alt="Card"
                />
                <div
                    id="overlay"
                    className="absolute top-0 right-0 w-full h-full z-10"
                    style={{
                        backgroundImage: 'linear-gradient(to left, #1F1F1F 50%, transparent 60%)',
                        opacity: 0.50
                    }}
                ></div>
                <div className="absolute top-0 right-0 w-2/4 h-full flex justify-center items-center">
                    <p className="text-whitePrimary text-lg sm:text-2xl z-20 transform transition-transform duration-300 group-hover:scale-110 bg-buttonPrimary hover:border-1 hover:border-whitePrimary px-4 py-2 rounded">
                        London
                    </p>
                </div>
            </div>



            <div onClick={() => goToBrowse("Bergen")}
                className="relative w-11/12 sm:w-3/4 md:w-2/3 2xl:w-2/4 h-36 sm:h-48 group cursor-pointer duration-300 bottom-0 hover:bottom-0.5"
            >
                <img
                    src="https://cdn.sanity.io/images/4aans0in/production/5cd168de63ba568299d20d2da60345c03bedd070-3353x1491.jpg?rect=0,0,2651,1491&w=3840&h=2160&fm=webp&q=100&fit=max&auto=format"
                    className="w-full h-full object-cover brightness-70 rounded-2xl"
                    alt="Card"
                />
                <div
                    id="overlay"
                    className="absolute top-0 left-0 w-full h-full z-10"
                    style={{
                        backgroundImage: 'linear-gradient(to right, #1F1F1F 50%, transparent 60%)',
                        opacity: 0.50
                    }}
                ></div>
                <div className="absolute top-0 left-0 w-2/4 h-full flex justify-center items-center">
                    <p className="text-whitePrimary text-lg sm:text-2xl z-20 transform transition-transform duration-300 group-hover:scale-110 bg-buttonPrimary hover:border-1 hover:border-whitePrimary px-4 py-2 rounded">
                        Bergen
                    </p>
                </div>
            </div>
        </div>
    );
}

export default HomePageCard;
