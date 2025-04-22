const Rating = ({ venue }) => {
    const roundedRating = Math.round(venue.rating);
    return <img className="min-h-6 max-h-6" src={`/public/images/${roundedRating}-star.png`} alt={`${roundedRating} star rating`} />;
  };
  
export default Rating;
