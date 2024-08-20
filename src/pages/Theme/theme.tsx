import Popup from "@/components/Popup";
import Spinner from "@/components/Spinner";
import Pagination from "@/components/Pagination"; // Import the Pagination component
import { highlightText } from "@/utils/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { SquarePen, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

type themeType = {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  bg: string;
};

const Theme = () => {
  const [showPopup, setShowPopup] = useState(false); // State to manage popup visibility
  const [selectedItem, setSelectedItem] = useState<themeType | null>(null); // State to manage selected item for deletion
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // State to manage current page
  const itemsPerPage = 10; // Set the number of items per page

  const query = useQuery({
    queryKey: ["theme", currentPage],
    queryFn: async () => {
      const theme = await axios.get(
        `http://localhost:3000/theme?page=${currentPage}`
      );
      return theme.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`http://localhost:3000/theme/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["theme"] });
      setShowPopup(false); // Close the popup after successful deletion
    },
  });

  const handleDeleteClick = (item: any) => {
    setSelectedItem(item);
    setShowPopup(true);
  };

  const confirmDelete = () => {
    if (selectedItem) {
      mutation.mutate(selectedItem.id);
    }
  };

  const filteredData = query.data?.items?.filter((item: any) =>
    item?.restaurant?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate the total number of pages
  const totalPages = Math.ceil(query.data?.totalItems / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (query.isPending) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (query.isError) {
    return <div>Error</div>;
  }

  return (
    <div className="relative overflow-x-auto sm:rounded-lg w-full m-14 scrollbar-hide">
      <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
        <label htmlFor="table-search" className="sr-only">
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-500"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <input
            type="text"
            id="table-search"
            className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 "
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for items"
          />
        </div>
        <Link to="/add-theme">
          <button
            type="button"
            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none font-medium rounded-lg  py-2.5  mb-2 px-5"
          >
            Add theme
          </button>
        </Link>
      </div>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 w-4 ">
              #
            </th>
            <th scope="col" className="px-6 py-3 w-4 ">
              Restaurant Name
            </th>
            <th scope="col" className="px-6 py-3">
              Primary color
            </th>
            <th scope="col" className="px-6 py-3">
              Secondary color
            </th>
            <th scope="col" className="px-6 py-3">
              bg color
            </th>
            <th scope="col" className="px-6 py-3"></th>
            <th scope="col" className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {filteredData?.map((item: any, index: number) => (
            <tr key={item.id} className="bg-white border-b hover:bg-gray-50 ">
              <td className="px-6 py-4">
                {(currentPage - 1) * itemsPerPage + index + 1}
              </td>
              <td
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
              >
                {highlightText(item?.restaurant?.name || "", searchQuery)}
              </td>
              <td className="px-6 py-4">
                <label
                  htmlFor=""
                  className={`${item?.primary ? "bg-[" + item?.primary + "]" : ""
                    } text-white px-2 py-1 rounded-full`}
                >
                  {item?.primary}
                </label>
              </td>
              <td className="px-6 py-4">
                <label
                  className={`${item?.secondary ? "bg-[" + item?.secondary + "]" : ""
                    } text-white px-2 py-1 rounded-full`}
                >
                  {item?.secondary}
                </label>
              </td>
              <td className="px-6 py-4">{item?.bg}</td>
              <td className="px-6 py-4 flex gap-x-4">
                <button className="font-medium text-blue-600">
                  <Link to={`/edit-theme/${item.id}`} state={item}>
                    <SquarePen />
                  </Link>
                </button>
                <button
                  className="font-medium text-red-600"
                  onClick={() => handleDeleteClick(item)}
                >
                  <Trash2 />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center items-center mt-10">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      {showPopup && (
        <Popup
          onClose={() => setShowPopup(false)}
          onConfirm={confirmDelete}
          loading={mutation.isPending}
          confirmText="Delete"
          loadingText="Deleting..."
          cancelText="Cancel"
          confirmButtonVariant="red"
        >
          <p>Are you sure you want to delete {selectedItem?.name}?</p>
        </Popup>
      )}
    </div>
  );
};

export default Theme;
