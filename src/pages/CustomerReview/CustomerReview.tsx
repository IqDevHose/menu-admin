import { useState, useEffect } from "react";
import Popup from "@/components/Popup";
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { Plus, RotateCw, SquarePen, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import Spinner from "@/components/Spinner";
import { highlightText } from "@/utils/utils";
import Pagination from "@/components/Pagination"; // Import the Pagination component
import RatingPopup from "@/components/RatingPopup";
import axiosInstance from "@/axiosInstance";
import exportCSVFile from "json-to-csv-export";
import { DropdownMenuDemo } from "@/components/DropdownMenu";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css"; // Importing the styles

import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteManyDialogOpen, setDeleteManyDialogOpen] = useState(false);
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<customerReviewType | null>(
    null
  );
  const [selectedChildData, setSelectedChildData] = useState<any[]>([]);
  const [selectedCustomerReview, setSelectedCustomerReview] =
    useState<customerReviewType | null>(null);
  const [searchQuery, setSearchQuery] = useState(""); // State to manage search query
  const [selectedRestaurant, setSelectedRestaurant] = useState("all"); // State to manage selected restaurant
  const [selectedItems, setSelectedItems] = useState<string[]>([]); // State to manage selected items for checkbox selection
  const [currentPage, setCurrentPage] = useState(1); // State to manage current page
  const itemsPerPage = 10; // Set the number of items per page
  const [headers, setHeaders] = useState<string[]>([]);

  const queryClient = useQueryClient();

  const {
    data: restaurants,
    fetchNextPage: fetchNextPageRestaurants,
    hasNextPage: hasNextPageRestaurants,
    isFetchingNextPage: isFetchingNextPageRestaurants,
  } = useInfiniteQuery({
    queryKey: ["restaurants"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axiosInstance.get(`/restaurant?page=${pageParam}`);
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.hasNextPage) return undefined;
      return lastPage.nextPage;
    },
    initialPageParam: 1,
  });

  const {
    data: customerReviewData,
    isLoading,
    isError,
    fetchNextPage: fetchNextPageReviews,
    hasNextPage: hasNextPageReviews,
    isFetchingNextPage: isFetchingNextPageReviews,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: ["customerReview", selectedRestaurant],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams();
      if (selectedRestaurant && selectedRestaurant !== 'all') {
        params.append("restaurantId", selectedRestaurant);
      }
      params.append("page", pageParam.toString());
      const response = await axiosInstance.get(`/customer-review`, { params });
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.hasNextPage) return undefined;
      return lastPage.nextPage;
    },
    initialPageParam: 1,
  });

  const handleReload = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["customerReview", selectedRestaurant],
    });
    refetch();
  };

  const handleExport = () => {
    if (!customerReviewData) return;
    const flattenedData = customerReviewData.pages.flatMap(page => 
      page.items.map((item: any) => flattenObject(item))
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
      setRatingDialogOpen(true);
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
      setShowChildPopup(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (selectedItemsIds: string[]) => {
      return axiosInstance.put(`/customer-review/soft-delete-many`, {
        data: selectedItemsIds,
      });
    },
    onSuccess: () => {
      refetch();
      setShowChildPopup(false);
      return "Items deleted successfully";
    },
  });

  const handleDeleteClick = (item: customerReviewType) => {
    setSelectedCustomerReview(item);
    setDeleteDialogOpen(true);
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

  // Filter data based on the search query
  const filteredData = customerReviewData?.pages.flatMap(page => 
    page.items.filter((item: any) =>
      item?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  ) || [];

  // Calculate total pages and slice data for the current page
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setSelectedItems([]);
    
    // Calculate if we need to fetch more data
    const totalItemsNeeded = newPage * itemsPerPage;
    const currentTotalItems = customerReviewData?.pages.reduce(
      (total, page) => total + page.items.length,
      0
    ) || 0;

    if (totalItemsNeeded > currentTotalItems && hasNextPageReviews) {
      fetchNextPageReviews();
    }
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
    setDeleteManyDialogOpen(true);
  };

  // Add useEffect to reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedItems([]);
  }, [selectedRestaurant, searchQuery]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isError) {
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
          <Select
            value={selectedRestaurant}
            onValueChange={(value) => {
              setSelectedRestaurant(value);
              setCurrentPage(1);
              setSelectedItems([]);
            }}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Restaurants" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Restaurants</SelectItem>
              {restaurants?.pages.map((page) =>
                page.items.map((restaurant: any) => (
                  <SelectItem key={restaurant.id} value={restaurant.id}>
                    {restaurant.name}
                  </SelectItem>
                ))
              )}
              {hasNextPageRestaurants && (
                <Button
                  className="w-full text-center text-gray-600"
                  onClick={(e) => {
                    e.preventDefault();
                    fetchNextPageRestaurants();
                  }}
                  disabled={isFetchingNextPageRestaurants}
                >
                  {isFetchingNextPageRestaurants ? "Loading..." : "Load More"}
                </Button>
              )}
            </SelectContent>
          </Select>
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

      {currentData.length === 0 ? (
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
                {currentData.map((item: any) => (
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

          {currentData.length > 0 && (
            <>
              {/* Add Load More button */}
              {hasNextPageReviews && (
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => fetchNextPageReviews()}
                    disabled={isFetchingNextPageReviews}
                    className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-500"
                  >
                    {isFetchingNextPageReviews ? "Loading more..." : "Load More"}
                  </button>
                </div>
              )}

              {/* Pagination Component */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-4">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </>
      )}

      <Dialog open={deleteManyDialogOpen} onOpenChange={setDeleteManyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Reviews</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedItems.length} review(s)?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteManyDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteMany}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Review</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedCustomerReview?.name}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={ratingDialogOpen} onOpenChange={setRatingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rating Details</DialogTitle>
          </DialogHeader>
          <RatingPopup data={selectedChildData} />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRatingDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerReview;
