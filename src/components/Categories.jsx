import CategoryCard from "./CategoryCard";

const categoryData = [
  {
    title: "MOUNTAIN",
    image: "https://blog.sothebysrealty.co.uk/hubfs/Cabin-jpg.jpeg",
  },
  {
    title: "CITY",
    image: "https://live.staticflickr.com/126/387606063_be63334fd8_h.jpg",
  },
  {
    title: "BEACH",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  },
  {
    title: "CABIN",
    image: "https://www.precisioncraft.com/wp-content/uploads/2023/05/cozy-luxury-log-cabin.jpg",
  },
  {
    title: "HOTEL",
    image: "https://www.koseahotel.com/uploads/nr_photos/1366/home_8976.webp",
  },
  {
    title: "VILLA",
    image: "https://croatia-exclusive.com/storage/app/uploads/public/65f/9bf/625/65f9bf6250362398091181.jpg",
  },
];

function Categories() {
  return (
    <>
    <div className="flex flex-col justify-center items-center">
    <div className="border-y-1 border-blackSecondary py-8 w-11/12 sm:w-3/4 md:w-2/3 2xl:w-full">
        <h2 className="font-thin text-whiteSecondary">What are you looking for?</h2>
        <div className="flex flex-wrap justify-center gap-6 mt-6 sm:grid grid-cols-2 xl:grid-cols-3 place-items-center">
        {categoryData.map((category, idx) => (
            <CategoryCard key={idx} title={category.title} image={category.image} />
        ))}
        </div>
    </div>
    </div>
    </>
  );
}

export default Categories;
