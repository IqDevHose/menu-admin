import { useState } from "react";
import Popup from "@/components/Popup";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Plus, RotateCw, SquarePen, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import happy from "../../assets/smile.png";
import satisfied from "../../assets/neutral.png";
import sad from "../../assets/sad.png";
import Spinner from "@/components/Spinner";
import { highlightText } from "@/utils/utils";
import Pagination from "@/components/Pagination"; // Import the Pagination component
import RatingPopup from "@/components/RatingPopup";
import axiosInstance from "@/axiosInstance";
import exportCSVFile from "json-to-csv-export";
import { DropdownMenuDemo } from "@/components/DropdownMenu";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css"; // Importing the styles
import {
  FaFaceAngry,
  FaFaceFrown,
  FaFaceLaughBeam,
  FaFaceSmile,
} from "react-icons/fa6";
import { FaRegStar, FaSmile, FaStar, FaStarHalfAlt } from "react-icons/fa";

type customerReviewType = {
  id: string;
  name: string;
  comment: string;
  email: string;
  blue: string;
};

interface DataItem {
  birthday: String;
  comment: String;
  createdAt: String;
  deleted: Boolean;
  email: String;
  id: String;
  name: String;
  phone: String;
  resturantId: String;
  updatedAt: String;
}

const flattenObject = (
  obj: Record<string, any>,
  parent = "",
  customerRev: Record<string, any> = {}
): Record<string, any> => {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const propName = parent ? `${parent}.${key}` : key;
      if (typeof obj[key] === "object" && obj[key] !== null) {
        flattenObject(obj[key], propName, customerRev);
      } else {
        customerRev[propName] = obj[key];
      }
    }
  }
  return customerRev;
};

// Extract headers from the data
const extractHeaders = (data: DataItem[]): string[] => {
  const flattenedData = data.map((item) => flattenObject(item));
  const headers = Array.from(new Set(flattenedData.flatMap(Object.keys)));
  return headers;
};

const CustomerReview = () => {
  const [showChildPopup, setShowChildPopup] = useState(false);
  const [showDeleteManyPopup, setShowDeleteManyPopup] = useState(false); // State to manage popup visibility
  const [selectedItem, setSelectedItem] = useState<customerReviewType | null>(
    null
  );
  const [selectedChildData, setSelectedChildData] = useState<any[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCustomerReview, setSelectedCustomerReview] =
    useState<customerReviewType | null>(null);
  const [searchQuery, setSearchQuery] = useState(""); // State to manage search query
  const [selectedRestaurant, setSelectedRestaurant] = useState(""); // State to manage selected restaurant
  const [selectedItems, setSelectedItems] = useState<string[]>([]); // State to manage selected items for checkbox selection
  const [currentPage, setCurrentPage] = useState(1); // State to manage current page
  const itemsPerPage = 10; // Set the number of items per page
  const [headers, setHeaders] = useState<string[]>([]);

  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["customerReview", currentPage, selectedRestaurant],
    queryFn: async () => {
      const customerReview = await axiosInstance.get(
        `/customer-review?page=${currentPage}&restaurantId=${selectedRestaurant}`
      );
      return customerReview.data;
    },
    refetchOnWindowFocus: false, // Prevent automatic refetching on window focus if not needed
  });

  const handleReload = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["customerReview", currentPage, selectedRestaurant],
    });
    refetch(); // Optionally trigger refetch after invalidation
  };

  const { data: restaurants } = useQuery({
    queryKey: ["restaurants"],
    queryFn: async () => {
      const res = await axiosInstance.get("/restaurant");
      return res.data;
    },
  });
  const {
    data: exportData,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["customer-review-all"],
    queryFn: async () => {
      const item = await axiosInstance.get(`/customer-review?page=all`);

      const heads: any[] = extractHeaders(item.data.items);
      setHeaders(heads);
      return item.data;
    },
  });

  const handleExport = () => {
    const flattenedData = exportData.items.map((item: any) =>
      flattenObject(item)
    );

    const dataToConvert = {
      data: flattenedData,
      filename: "customerReviews",
      delimiter: ",",
      headers,
    };

    exportCSVFile(dataToConvert);
  };

  function summation(ratings: { score: number; question: any }[]) {
    let sum = 0;
    let count = 0;

    // Handle case where no ratings are provided
    if (!ratings || ratings.length === 0) {
      return <FaRegStar size={16} color="gray" title="No ratings" />;
    }

    // Sum up all the valid ratings
    for (let index = 0; index < ratings.length; index++) {
      const score = ratings[index]?.score;
      if (typeof score === "number" && !isNaN(score)) {
        sum += score;
        count += 1;
      }
    }

    // Handle case where there are no valid ratings
    if (count === 0) {
      return <FaRegStar size={16} color="gray" title="No valid ratings" />;
    }

    // Calculate the average score out of 5
    const average = sum / count;
    const fullStars = Math.floor(average); // Full stars based on the integer part
    const halfStar = average % 1 >= 0.5; // Check if there should be a half star
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0); // Calculate empty stars

    // Function to handle star click
    const handleStarClick = () => {
      setSelectedChildData(ratings); // Pass the entire rating array to the popup
      setShowChildPopup(true);
    };

    // Display multiple stars based on the average rating
    return (
      <>
        <div
          onClick={handleStarClick}
          data-tooltip-id="rating-tooltip"
          data-tooltip-content={`Average rating: ${average.toFixed(1)} / 5`}
          className="cursor-pointer flex items-center"
        >
          {/* Render full stars */}
          {Array(fullStars)
            .fill(0)
            .map((_, index) => (
              <FaStar
                key={`full-${index}`}
                size={16}
                className="text-yellow-300"
              />
            ))}

          {/* Render half star */}
          {halfStar && <FaStarHalfAlt size={16} className="text-yellow-300" />}

          {/* Render empty stars */}
          {Array(emptyStars)
            .fill(0)
            .map((_, index) => (
              <FaRegStar
                key={`empty-${index}`}
                size={16}
                className="text-gray-300"
              />
            ))}
        </div>

        {/* Initialize the tooltip */}
        <ReactTooltip id="rating-tooltip" place="top" />
      </>
    );
  }

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/customer-review/soft-delete/${id}`);
    },
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ["customerReview"] });
      setShowPopup(false);
    },
  });
  const deleteMutation = useMutation({
    mutationFn: async (selectedItemsIds: string[]) => {
      return axiosInstance.put(`/customer-review/soft-delete-many`, {
        data: selectedItemsIds, // Ensure only selected items are sent
      });
    },
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ["customerReview"] }); // Refresh the data
      setShowDeleteManyPopup(false); // Close the delete popup
      setSelectedItems([]); // Reset the selected items state after deletion
    },
  });

  const handleDeleteClick = (item: customerReviewType) => {
    setSelectedCustomerReview(item);
    setShowPopup(true);
  };

  const confirmDeleteMany = () => {
    if (selectedItems.length > 0) {
      deleteMutation.mutate(selectedItems); // Pass only selected items
    }
  };

  const confirmDelete = () => {
    if (selectedCustomerReview) {
      mutation.mutate(selectedCustomerReview.id);
    }
  };

  // Filter the data based on the search query
  const filteredData = query?.data?.items.filter((item: any) =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate the total number of pages
  const totalPages = Math.ceil(query?.data?.totalItems / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setSelectedItems([]);
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredData.length) {
      setSelectedItems([]); // Unselect all if everything is already selected
    } else {
      const allIds = filteredData.map((item: any) => item.id);
      setSelectedItems(allIds); // Select all items
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems(
      (prevSelectedItems) =>
        prevSelectedItems.includes(id)
          ? prevSelectedItems.filter((itemId) => itemId !== id) // Remove from selected if already selected
          : [...prevSelectedItems, id] // Add to selected if not selected
    );
  };

  const handleDeleteMany = () => {
    setShowDeleteManyPopup(true);
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
    <div className="relative overflow-x-auto sm:rounded-lg w-full mx-6 md:mx-0 scrollbar-hide">
      {/* Tooltip initialization */}
      <ReactTooltip id="delete-many-tooltip" place="top" />
      <ReactTooltip id="reload-tooltip" place="top" />
      <ReactTooltip id="add-review-tooltip" place="top" />
      <ReactTooltip id="trash-tooltip" place="top" />
      <ReactTooltip id="edit-review-tooltip" place="top" />
      <ReactTooltip id="delete-review-tooltip" place="top" />

      <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
        <label htmlFor="table-search" className="sr-only">
          Search
        </label>
        <div className="flex gap-4 flex-wrap items-center">
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
          <select
            value={selectedRestaurant}
            onChange={(e) => setSelectedRestaurant(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Restaurants</option>
            {restaurants?.items.map((restaurant: any) => (
              <option key={restaurant.id} value={restaurant.id}>
                {restaurant.name}
              </option>
            ))}
          </select>
        </div>
        <div className="gap-2 flex justify-center items-center">
          {selectedItems.length > 0 && (
            <button
              type="button"
              className="text-white w-10 h-10 xl:w-auto bg-red-600 hover:bg-red-700 focus:outline-none font-medium rounded-lg px-3 py-2.5"
              onClick={handleDeleteMany}
              data-tooltip-id="delete-many-tooltip"
              data-tooltip-content="Delete selected reviews"
            >
              <div className="flex items-center flex-nowrap gap-1">
                <Trash2 size={16} />
                <span className="hidden xl:flex">Delete</span>
                <span className="hidden xl:flex">{selectedItems.length}</span>
              </div>
            </button>
          )}
          <button
            type="button"
            disabled={isRefetching}
            className="text-white w-10 h-10 xl:w-auto bg-gray-800 text-sm hover:bg-gray-900 font-medium rounded-lg py-2.5 px-3 disabled:animate-pulse disabled:bg-gray-600"
            onClick={handleReload} // Updated to handleReload
            data-tooltip-id="reload-tooltip"
            data-tooltip-content="Reload reviews"
          >
            <span className="hidden xl:flex items-center gap-1">
              <RotateCw
                size={16}
                className={isRefetching ? `animate-spin` : ""}
              />{" "}
              Reload
            </span>
            <span className="inline xl:hidden">
              <RotateCw
                size={16}
                className={isRefetching ? `animate-spin` : ""}
              />
            </span>
          </button>
          <Link to="/customerReviews/add">
            <button
              type="button"
              className="text-white w-10 h-10 xl:w-auto bg-gray-800 hover:bg-gray-900 font-medium rounded-lg py-2 xl:py-2.5 px-3 text-sm"
              data-tooltip-id="add-review-tooltip"
              data-tooltip-content="Add new review"
            >
              <span className="hidden xl:flex items-center gap-1">
                <Plus size={16} /> Add Review
              </span>
              <span className="inline xl:hidden">
                <Plus size={16} />
              </span>
            </button>
          </Link>
          <Link to="/customerReviews/trash">
            <button
              type="button"
              className="text-white w-10 h-10 xl:w-auto bg-gray-800 hover:bg-gray-900 font-medium rounded-lg py-2 xl:py-2.5 px-3 text-sm"
              data-tooltip-id="trash-tooltip"
              data-tooltip-content="View trashed reviews"
            >
              <span className="flex gap-1 items-center">
                <Trash2 size={16} /> <p className="hidden xl:inline">Trash</p>
              </span>
            </button>
          </Link>
          <DropdownMenuDemo
            handleExport={handleExport}
            link="/customerReviews/import"
          ></DropdownMenuDemo>
        </div>
      </div>

      {filteredData?.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No customer reviews found.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 ">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === filteredData?.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th scope="col" className="px-6 py-3 ">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 ">
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
                {filteredData?.map((item: any, index: number) => (
                  <tr
                    key={item.id}
                    className="bg-white border-b hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      {new Date(item.createdAt).toLocaleDateString()} -{" "}
                      {new Date(item.createdAt).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {highlightText(item.name || "", searchQuery)}
                    </td>
                    <td className="px-6 py-4">{item.comment}</td>
                    <td className="px-6 py-4">{summation(item.rating)}</td>
                    <td className="px-6 py-4">{item.phone}</td>
                    <td className="px-6 py-4">{item.email}</td>
                    <td className="px-6 py-4">
                      {new Date(item.birthday).toLocaleDateString("en-CA")}
                    </td>
                    <td className="px-6 py-4 flex gap-x-4">
                      <Link
                        to={`/customerReviews/edit/${item.id}`}
                        className="font-medium text-blue-600"
                        state={item}
                        data-tooltip-id="edit-review-tooltip"
                        data-tooltip-content="Edit review"
                      >
                        <SquarePen />
                      </Link>
                      <button
                        className="font-medium text-red-600"
                        onClick={() => handleDeleteClick(item)}
                        data-tooltip-id="delete-review-tooltip"
                        data-tooltip-content="Delete review"
                      >
                        <Trash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center items-center mt-10">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}

      {showDeleteManyPopup && (
        <Popup
          onClose={() => setShowDeleteManyPopup(false)}
          onConfirm={confirmDeleteMany}
          loading={deleteMutation.isPending}
          confirmText="Delete"
          loadingText="Deleting..."
          cancelText="Cancel"
          confirmButtonVariant="red"
        >
          <p>
            Are you sure you want to delete{" "}
            {selectedItems && selectedItems.length + " review/s"}?
          </p>
        </Popup>
      )}

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
          showOneBtn={true}
          onConfirm={() => setShowChildPopup(false)}
          confirmButtonVariant="red"
        >
          <RatingPopup data={selectedChildData} />
        </Popup>
      )}
    </div>
  );
};

export default CustomerReview;
