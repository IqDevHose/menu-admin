import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const RatingPopup = ({ data }: { data: any[] }) => {
  // Check if data is an array and has elements
  if (!Array.isArray(data) || data.length === 0) {
    return <div>No data available</div>;
  }

  // Function to get the appropriate star rating based on the score
  const getStarRating = (score: number) => {
    const fullStars = Math.floor(score); // Full stars based on integer part of score
    const halfStar = score - fullStars >= 0.5; // If the decimal part >= 0.5, show half star
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0); // Remaining empty stars

    return (
      <div className="flex items-center">
        {/* Full stars */}
        {Array(fullStars)
          .fill(0)
          .map((_, index) => (
            <FaStar key={`full-${index}`} size={24}  className="text-yellow-300" />
          ))}
        {/* Half star */}
        {halfStar && <FaStarHalfAlt size={24}  className="text-yellow-300" />}
        {/* Empty stars */}
        {Array(emptyStars)
          .fill(0)
          .map((_, index) => (
            <FaRegStar key={`empty-${index}`} size={24} className="text-yellow-300" />
          ))}
      </div>
    );
  };

  return (
    <div>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 w-4">#</th>
            <th scope="col" className="px-6 py-3">Question</th>
            <th scope="col" className="px-6 py-3">Score</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="bg-white border-b hover:bg-gray-50">
              <td className="px-6 py-4">{index + 1}</td>
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                {item.question.title || "N/A"} {/* Displaying the question title */}
              </td>
              <td className="px-6 py-4 flex items-center gap-x-2">
                {getStarRating(item.score)} {/* Displaying the star rating */}
                <span>{item.score}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RatingPopup;
