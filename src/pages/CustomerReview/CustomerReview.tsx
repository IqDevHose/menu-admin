import React, { useState } from "react";
import Popup from "@/components/Popup";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { SquarePen, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import happy from "../../assets/smile.png";
import satisfied from "../../assets/neutral.png";
import sad from "../../assets/sad.png";
import Spinner from "@/components/Spinner";
import { highlightText } from "@/utils/utils";
import Pagination from "@/components/Pagination"; // Import the Pagination component
import RatingPopup from "@/components/RatingPopup";
import axiosInstance from "@/axiosInstance";

type customerReviewType = {
  id: string;
  name: string;
  comment: string;
  email: string;
  blue: string;
};

const CustomerReview = () => {
  const [showChildPopup, setShowChildPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState<customerReviewType | null>(
    null
  );
  const [selectedChildData, setSelectedChildData] = useState<any[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCustomerReview, setSelectedCustomerReview] =
    useState<customerReviewType | null>(null);
  const [searchQuery, setSearchQuery] = useState(""); // State to manage search query
  const [selectedItems, setSelectedItems] = useState<string[]>([]); // State to manage selected items for checkbox selection
  const [currentPage, setCurrentPage] = useState(1); // State to manage current page
  const itemsPerPage = 10; // Set the number of items per page

  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["customerReview", currentPage],
    queryFn: async () => {
      const customerReview = await axiosInstance.get(
        `/customer-review?page=${currentPage}`
      );
      console.log(customerReview.data.items);
      return customerReview.data;
    },
  });

  function summation(ratings: { score: number; question: any }[]) {
    let sum = 0;
    let count = 0;

    for (let index = 0; index < ratings.length; index++) {
      sum += ratings[index].score;
      count += 1;
    }
    const average = sum / count;

    const handleIconClick = () => {
      setSelectedChildData(ratings); // Pass the entire rating array to the popup
      setShowChildPopup(true);
    };

    if (average >= 2.5) {
      return (
        <img
          title={`${average}`}
          width={24}
          height={24}
          src={happy}
          alt="happy"
          onClick={handleIconClick}
          style={{ cursor: "pointer" }}
        />
      );
    } else if (average > 1 && average <= 2.5) {
      return (
        <img
          title={`${average}`}
          width={24}
          height={24}
          src={satisfied}
          alt="satisfied"
          onClick={handleIconClick}
          style={{ cursor: "pointer" }}
        />
      );
    } else if (isNaN(average)) {
      return (
        <img
          title={`${average}`}
          width={24}
          height={24}
          src={happy}
          alt="happy"
          onClick={handleIconClick}
          style={{ cursor: "pointer" }}
        />
      );
    } else if (average <= 1) {
      return (
        <img
          title={`${average}`}
          width={24}
          height={24}
          src={sad}
          alt="sad"
          onClick={handleIconClick}
          style={{ cursor: "pointer" }}
        />
      );
    }
  }

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/customer-review/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customerReview"] });
      setShowPopup(false);
    },
  });

  const handleDeleteClick = (item: customerReviewType) => {
    setSelectedCustomerReview(item);
    setShowPopup(true);
  };

  const confirmDelete = () => {
    if (selectedCustomerReview) {
      mutation.mutate(selectedCustomerReview.id);
    }
  };

  // Filter the data based on the search query
  const filteredData = query.data?.items.filter((item: any) =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate the total number of pages
  const totalPages = Math.ceil(query.data?.totalItems / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setSelectedItems([]);
  };
  // Handle select all checkbox
  const handleSelectAll = () => {
    if (selectedItems.length === filteredData.length) {
      setSelectedItems([]);
    } else {
      const allIds = filteredData.map((item: any) => item.id);
      setSelectedItems(allIds);
    }
  };

  // Handle individual row checkbox
  const handleSelectItem = (id: string) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(id)
        ? prevSelectedItems.filter((itemId) => itemId !== id)
        : [...prevSelectedItems, id]
    );
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
            className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for items"
          />
        </div>
        <div className="gap-4 flex justify-center">
          <Link to="/add-customer-review">
            <button
              type="button"
              className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none font-medium rounded-lg py-2.5 mb-2 px-5"
            >
              <span className="hidden xl:inline">Add Customer Review</span>
              <span className="inline xl:hidden">+</span>
            </button>
          </Link>
          <Link to="/deleted-customer-review">
            <button
              type="button"
              className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none font-medium rounded-lg py-2.5 mb-2 px-5"
            >
              <span className="flex gap-1 ">
                <Trash2 /> <p className="hidden xl:inline">Trash</p>
              </span>
            </button>
          </Link>
        </div>
      </div>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 w-4">
              {/* <input
                type="checkbox"
                checked={selectedItems.length === filteredData?.length}
                onChange={handleSelectAll}
              /> */}
            </th>
            <th scope="col" className="px-6 py-3 w-4">
              #
            </th>
            <th scope="col" className="px-6 py-3 w-4">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Comment
            </th>
            <th scope="col" className="px-6 py-3">
              Avg Rating
            </th>
            <th scope="col" className="px-6 py-3">
              Phone
            </th>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
            <th scope="col" className="px-6 py-3">
              Birthday
            </th>
            <th scope="col" className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(query.data.items) &&
            filteredData?.map((item: any, index: number) => (
              <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  {/* <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => handleSelectItem(item.id)}
                /> */}
                </td>
                <td className="px-6 py-4">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {highlightText(item.name || "", searchQuery)}
                </td>
                <td className="px-6 py-4">{item.comment}</td>
                <td className="px-6 py-4">{summation(item.rating)}</td>
                <td className="px-6 py-4">{item.phone}</td>
                <td className="px-6 py-4">{item.email}</td>
                <td className="px-6 py-4">{item.birthday}</td>
                <td className="px-6 py-4 flex gap-x-4">
                  <Link
                    to={`/edit-customer-review/${item.id}`}
                    className="font-medium text-blue-600"
                    state={item}
                  >
                    <SquarePen />
                  </Link>

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

      {/* Delete Confirmation Popup */}
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
      {/* popup for customer review rating */}
      {showChildPopup && (
        <Popup
          onClose={() => setShowChildPopup(false)}
          loading={query.isLoading}
          confirmText="Close"
          showOneBtn={true} // This ensures only one button is shown
          onConfirm={() => setShowChildPopup(false)} // The close functionality
          confirmButtonVariant="red" // You can choose the variant
        >
          <RatingPopup data={selectedChildData} />
        </Popup>
      )}
    </div>
  );
};

export default CustomerReview;
