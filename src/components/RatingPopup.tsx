import { FaSmile, FaMeh, FaFrown, FaGrinBeam,  } from 'react-icons/fa';
import { FaFaceAngry } from "react-icons/fa6";
import { FaFaceMeh } from "react-icons/fa6";
import { FaFaceFrown } from "react-icons/fa6";
import { FaFaceSmile } from "react-icons/fa6";
import { FaFaceLaughBeam } from "react-icons/fa6";




const RatingPopup = ({ data }: { data: any[] }) => {
  // Check if data is an array and has elements
  if (!Array.isArray(data) || data.length === 0) {
    return <div>No data available</div>;
  }

  const getIcon = (score: number) => {
    if (score >= 4.5) {
      return <FaFaceLaughBeam   size={24} color="green" title={`${score}`} />;
    } else if (score >= 3 && score < 4.5) {
      return <FaSmile size={24} color="green" title={`${score}`} />;
    } else if (score >= 2 && score < 3) {
      return <FaFaceSmile  size={24} color="orange" title={`${score}`} />;
    } else if (score >= 1 && score < 2) {
      return <FaFaceFrown size={24} color="red" title={`${score}`} />;
    } else if (score < 1) {
      return <FaFaceAngry size={24} color="darkred" title={`${score}`} />;
    } else if (isNaN(score)) {
      return <FaFaceMeh  size={24} color="yellow" title="N/A" />;
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
