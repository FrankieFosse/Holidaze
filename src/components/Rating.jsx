const Rating = ({ venue }) => {
    const roundedRating = Math.round(venue.rating);
    return <img className="min-h-4 max-h-4 lg:min-h-6 lg:max-h-6" src={`/images/${roundedRating}-star.png`} alt={`${roundedRating} star rating`} />;
  };
  
export default Rating;
