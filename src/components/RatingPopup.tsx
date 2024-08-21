import React from 'react';
import happy from "../assets/smile.png";
import satisfied from "../assets/neutral.png";
import sad from "../assets/sad.png";

const RatingPopup = ({ data }: { data: any[] }) => {
  // Check if data is an array and has elements
  if (!Array.isArray(data) || data.length === 0) {
    return <div>No data available</div>;
  }

  const getIcon = (score: number) => {
    if (score >= 1.5) {
      return <img title={`${score}`} width={24} height={24} src={happy} alt="happy" />;
    } else if (score >= 1) {
      return <img title={`${score}`} width={24} height={24} src={satisfied} alt="satisfied" />;
    } else {
      return <img title={`${score}`} width={24} height={24} src={sad} alt="sad" />;
    }
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
                {getIcon(item.score)} {/* Displaying the appropriate icon */}
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
