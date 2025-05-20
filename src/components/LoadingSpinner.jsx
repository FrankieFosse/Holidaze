const LoadingSpinner = () => {
    return (
      <div className="absolute lg:pl-72 inset-0 z-20 flex items-center justify-center bg-black/20">
        <div className="border-4 border-white border-t-transparent rounded-full w-10 h-10 animate-spin"></div>
      </div>
    );
  };
  
  export default LoadingSpinner;
  