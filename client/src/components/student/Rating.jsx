import React, { useState, useEffect } from 'react';

// Rating Component: Allows users to select a rating from 1 to 5 stars.
const Rating = ({ initialRating, onRate }) => {
  // State to track the current rating
  const [rating, setRating] = useState(initialRating || 0);

  // Handle the rating selection
  const handleRating = (value) => {
    setRating(value);
    // Call the parent callback function with the selected rating
    if (onRate) {
      onRate(value);
    }
  };

  // Update rating if the initialRating prop changes (e.g., from a backend or edit mode)
  useEffect(() => {
    if (initialRating) {
      setRating(initialRating);
    }
  }, [initialRating]);

  return (
    <div className="flex items-center">
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;
        return (
          <span
            key={index}
            className={`cursor-pointer text-xl sm:text-2xl transition-colors ${
              starValue <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
            onClick={() => handleRating(starValue)}
          >
            &#9733; {/* Unicode for a filled star */}
          </span>
        );
      })}
    </div>
  );
};

export default Rating;
