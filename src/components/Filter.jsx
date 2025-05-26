import { FaWifi } from "react-icons/fa";
import { MdLocalParking, MdFreeBreakfast, MdOutlinePets } from "react-icons/md";
import Tooltip from "../components/Tooltip";


function Filter({ sortBy, setSortBy, filters, toggleFilter }) {


    return (
        <div className="border-blackSecondary border-1 p-4 m-2 flex-col flex lg:flex-row justify-center items-center lg:gap-8">
        <div className="flex flex-row items-center justify-center mb-6 lg:mb-0 gap-2 border-1 border-blackSecondary rounded w-max pl-2">
          <p>Sort by</p>
        <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-whitePrimary text-blackPrimary pb-2 pt-1.5 px-2 h-8 border rounded outline-none text-sm"
        >
            <option value="date">Latest</option>
            <option value="name">Name (A-Z)</option>
            <option value="rating">Highest Rated</option>
            <option value="priceHighToLow">Highest Price</option>
            <option value="priceLowToHigh">Lowest Price</option>
        </select>
        </div>


      {/* Filter buttons */}
      <div className="text-xl flex flex-row items-center justify-center gap-4">
        {/* Wifi */}
        <Tooltip text="Wifi included">
          <button
            aria-label="Wifi included"
            onClick={() => toggleFilter("wifi")}
            className={`p-2 rounded-full duration-150 cursor-pointer ${
              filters.wifi
                ? "bg-buttonPrimary border-1 border-buttonPrimary"
                : "bg-blackSecondary border-1 border-blackSecondary text-grayPrimary hover:border-grayPrimary hover:text-whitePrimary"
            }`}
          >
            <FaWifi />
          </button>
        </Tooltip>


        {/* Parking */}
        <Tooltip text="Parking included">
          <button
            aria-label="Parking included"
            onClick={() => toggleFilter("parking")}
            className={`p-2 rounded-full duration-150 cursor-pointer ${
              filters.parking
                ? "bg-buttonPrimary border-1 border-buttonPrimary"
                : "bg-blackSecondary border-1 border-blackSecondary text-grayPrimary hover:border-grayPrimary hover:text-whitePrimary"
            }`}
          >
            <MdLocalParking />
          </button>
        </Tooltip>


        {/* Breakfast */}
        <Tooltip text="Breakfast included">
          <button
            aria-label="Breakfast included"
            onClick={() => toggleFilter("breakfast")}
            className={`p-2 rounded-full duration-150 cursor-pointer ${
              filters.breakfast
                ? "bg-buttonPrimary border-1 border-buttonPrimary"
                : "bg-blackSecondary border-1 border-blackSecondary text-grayPrimary hover:border-grayPrimary hover:text-whitePrimary"
            }`}
          >
            <MdFreeBreakfast />
          </button>
        </Tooltip>

        {/* Pets */}
        <Tooltip text="Pets allowed">
          <button
            aria-label="Pets allowed"
            onClick={() => toggleFilter("pets")}
            className={`p-2 rounded-full duration-150 cursor-pointer ${
              filters.pets
                ? "bg-buttonPrimary border-1 border-buttonPrimary"
                : "bg-blackSecondary border-1 border-blackSecondary text-grayPrimary hover:border-grayPrimary hover:text-whitePrimary"
            }`}
          >
            <MdOutlinePets />
          </button>
        </Tooltip>
      </div>
      </div>
    )
}

export default Filter;