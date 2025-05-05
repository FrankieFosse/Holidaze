const Rating = ({ venue }) => {
    const roundedRating = Math.round(venue.rating);
    return <img className="min-h-4 max-h-4" src={`/images/${roundedRating}-star.png`} alt={`${roundedRating} star rating`} />;
  };
  
export default Rating;
