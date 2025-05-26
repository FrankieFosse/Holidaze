function CategoryCard({ title, image, onClick }) {
    return (
      <div
        onClick={() => onClick(title)}
        className="relative w-full h-36 2xl:h-64 sm:h-48 group cursor-pointer duration-300 bottom-0 hover:bottom-0.5"
      >
        <img
          src={image}
          className="w-full h-full object-cover brightness-50 rounded-2xl"
          alt={`${title} card`}
        />
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
          <p className="text-lg sm:text-2xl z-20 transform transition-transform duration-300 group-hover:scale-110 font-black px-4 py-2 rounded">
            {title}
          </p>
        </div>
      </div>
    );
  }
  
  export default CategoryCard;
  