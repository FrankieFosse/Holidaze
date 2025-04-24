function Filter() {


    return (
        <>
        <div className="flex justify-center mb-6">
        <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-whitePrimary text-blackPrimary p-2 border border-gray-300 rounded outline-none"
        >
            <option value="date">Latest</option>
            <option value="name">Name (A-Z)</option>
            <option value="rating">Highest Rated</option>
        </select>
        </div>


      {/* Filter buttons (unchanged) */}
      <div className="text-whitePrimary text-2xl flex flex-row items-center justify-center gap-8">
        {/* Wifi */}
        <div className="relative group">
          <button
            aria-label="Wifi included"
            onClick={() => toggleFilter("wifi")}
            className={`p-2 rounded-full duration-150 cursor-pointer ${
              filters.wifi
                ? "bg-buttonPrimary text-whitePrimary border-1 border-buttonPrimary"
                : "bg-blackSecondary border-1 border-blackSecondary text-grayPrimary hover:border-grayPrimary hover:text-whitePrimary"
            }`}
          >
            <FaWifi />
          </button>
          <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-whitePrimary bg-blackPrimary rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-[500ms] pointer-events-none">
            Wifi included
          </span>
        </div>

        {/* Parking */}
        <div className="relative group">
          <button
            aria-label="Parking included"
            onClick={() => toggleFilter("parking")}
            className={`p-2 rounded-full duration-150 cursor-pointer ${
              filters.parking
                ? "bg-buttonPrimary text-whitePrimary border-1 border-buttonPrimary"
                : "bg-blackSecondary border-1 border-blackSecondary text-grayPrimary hover:border-grayPrimary hover:text-whitePrimary"
            }`}
          >
            <MdLocalParking />
          </button>
          <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-whitePrimary bg-blackPrimary rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-[500ms] pointer-events-none">
            Parking included
          </span>
        </div>

        {/* Breakfast */}
        <div className="relative group">
          <button
            aria-label="Breakfast included"
            onClick={() => toggleFilter("breakfast")}
            className={`p-2 rounded-full duration-150 cursor-pointer ${
              filters.breakfast
                ? "bg-buttonPrimary text-whitePrimary border-1 border-buttonPrimary"
                : "bg-blackSecondary border-1 border-blackSecondary text-grayPrimary hover:border-grayPrimary hover:text-whitePrimary"
            }`}
          >
            <MdFreeBreakfast />
          </button>
          <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-whitePrimary bg-blackPrimary rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-[500ms] pointer-events-none">
            Breakfast included
          </span>
        </div>

        {/* Pets */}
        <div className="relative group">
          <button
            aria-label="Pets allowed"
            onClick={() => toggleFilter("pets")}
            className={`p-2 rounded-full duration-150 cursor-pointer ${
              filters.pets
                ? "bg-buttonPrimary text-whitePrimary border-1 border-buttonPrimary"
                : "bg-blackSecondary border-1 border-blackSecondary text-grayPrimary hover:border-grayPrimary hover:text-whitePrimary"
            }`}
          >
            <MdOutlinePets />
          </button>
          <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-whitePrimary bg-blackPrimary rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-[500ms] pointer-events-none">
            Pets allowed
          </span>
        </div>
      </div>
      </>
    )
}

export default Filter;