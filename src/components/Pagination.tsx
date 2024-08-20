import React from "react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="flex gap-2 items-center mt-7">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 text-white bg-gray-800 rounded-lg hover:bg-gray-900 disabled:bg-gray-400"
      >
        Previous
      </button>
      <span className="text-gray-700">
        {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 text-white bg-gray-800 rounded-lg hover:bg-gray-900 disabled:bg-gray-400"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
