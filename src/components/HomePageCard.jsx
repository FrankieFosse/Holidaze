function HomePageCard() {
    return (
        <div className="bg-blackPrimary py-4">
            <div
                className="relative w-full h-48 group cursor-pointer"
            >
                <img
                    src="https://media.snl.no/media/184491/standard_compressed_shutterstock_314955128.jpg"
                    className="w-full h-full object-cover"
                    alt="Card"
                />
                <div
                    id="overlay"
                    className="absolute top-0 left-0 w-full h-full z-10"
                    style={{
                        backgroundImage: 'linear-gradient(to right, #192A4A 50%, transparent 60%)',
                        opacity: 0.75
                    }}
                ></div>
                <div className="absolute top-0 left-0 w-2/4 h-full flex justify-center items-center">
                    <p className="text-whitePrimary text-3xl z-20 transform transition-transform duration-300 group-hover:scale-110">
                        Paris
                    </p>
                </div>
            </div>



            <div
                className="relative w-full h-48 group cursor-pointer"
            >
                <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSgCuIJ7u1akapg_oTUETWMgshpXdIaABugw&s"
                    className="w-full h-full object-cover"
                    alt="Card"
                />
                <div
                    id="overlay"
                    className="absolute top-0 right-0 w-full h-full z-10"
                    style={{
                        backgroundImage: 'linear-gradient(to left, #192A4A 50%, transparent 60%)',
                        opacity: 0.75
                    }}
                ></div>
                <div className="absolute top-0 right-0 w-2/4 h-full flex justify-center items-center">
                    <p className="text-whitePrimary text-3xl z-20 transform transition-transform duration-300 group-hover:scale-110">
                        London
                    </p>
                </div>
            </div>



            <div
                className="relative w-full h-48 group cursor-pointer"
            >
                <img
                    src="https://cdn.sanity.io/images/4aans0in/production/5cd168de63ba568299d20d2da60345c03bedd070-3353x1491.jpg?rect=0,0,2651,1491&w=3840&h=2160&fm=webp&q=100&fit=max&auto=format"
                    className="w-full h-full object-cover"
                    alt="Card"
                />
                <div
                    id="overlay"
                    className="absolute top-0 left-0 w-full h-full z-10"
                    style={{
                        backgroundImage: 'linear-gradient(to right, #192A4A 50%, transparent 60%)',
                        opacity: 0.75
                    }}
                ></div>
                <div className="absolute top-0 left-0 w-2/4 h-full flex justify-center items-center">
                    <p className="text-whitePrimary text-3xl z-20 transform transition-transform duration-300 group-hover:scale-110">
                        Bergen
                    </p>
                </div>
            </div>
        </div>
    );
}

export default HomePageCard;
