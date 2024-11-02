import { Plus, RotateCw, SquarePen, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import Popup from "@/components/Popup";
import Spinner from "@/components/Spinner";
import { highlightText } from "@/utils/utils";
import Pagination from "@/components/Pagination";
import axiosInstance from "@/axiosInstance";
import exportCSVFile from "json-to-csv-export";
import { DropdownMenuDemo } from "@/components/DropdownMenu";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

type restaurantReviewType = {
  id: string;
  name: string;
};

interface ThemeType {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  bg: string;
}

interface DataItem {
  accessCode: string;
  createdAt: string;
  deleted: boolean;
  description: string;
  id: string;
  image: string | null;
  name: string;
  updatedAt: string;
  theme: ThemeType;
}

const flattenObject = (
  obj: Record<string, any>,
  parent = "",
  res: Record<string, any> = {}
): Record<string, any> => {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      // Determine the full key path
      let propName = parent ? `${parent}.${key}` : key;

      // Remove "theme." prefix from keys that belong to the theme object
      if (parent === "theme") {
        propName = key;
      }

      if (typeof obj[key] === "object" && obj[key] !== null) {
        flattenObject(obj[key], propName, res);
      } else {
        res[propName] = obj[key];
      }
    }
  }
  return res;
};

// Extract headers from the data
const extractHeaders = (data: DataItem[]): string[] => {
  const flattenedData = data.map((item) => flattenObject(item));
  const headers = Array.from(new Set(flattenedData.flatMap(Object.keys)));
  return headers;
};

const Restaurant = () => {
  const [showPopup, setShowPopup] = useState(false); // State to manage popup visibility
  const [showDeleteManyPopup, setShowDeleteManyPopup] = useState(false); // State to manage popup visibility
  const [selectedItem, setSelectedItem] = useState<restaurantReviewType | null>(
    null
  ); // State to manage selected item for deletion
  const [searchQuery, setSearchQuery] = useState(""); // State to manage search query
  const [currentPage, setCurrentPage] = useState(1); // State to manage current page
  const [selectedItems, setSelectedItems] = useState<string[]>([]); // State to manage selected items for checkbox selection
  const itemsPerPage = 10; // Set the number of items per page
  const [headers, setHeaders] = useState<string[]>([]);

  const queryClient = useQueryClient();

  const {
    data: restaurantData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isPending,
    isError,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: ["restaurant"],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axiosInstance.get(`/restaurant?page=${pageParam}`);
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.hasNextPage) return undefined;
      return lastPage.nextPage;
    },
    initialPageParam: 1,
  });

  const handleReload = async () => {
    await queryClient.invalidateQueries({ queryKey: ["restaurant"] });
    refetch();
  };

  const handleExport = () => {
    if (!restaurantData) return;
    const flattenedData = restaurantData.pages.flatMap(page => 
      page.items.map((item: any) => flattenObject(item))
    );

    const dataToConvert = {
      data: flattenedData,
      filename: "restaurants",
      delimiter: ",",
      headers,
    };

    exportCSVFile(dataToConvert);
  };

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/restaurant/soft-delete/${id}`);
    },
    onSuccess: () => {
      refetch();
      setShowPopup(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (selectedItemsIds: string[]) => {
      return axiosInstance.put(`/restaurant/soft-delete-many`, {
        data: selectedItemsIds,
      });
    },
    onSuccess: () => {
      refetch();
      setShowDeleteManyPopup(false);
      return "Items deleted successfully";
    },
  });

  const handleDeleteClick = (item: any) => {
    setSelectedItem(item);
    setShowPopup(true);
  };

  const confirmDeleteMany = () => {
    if (selectedItems) {
      deleteMutation.mutate(selectedItems);
    }
  };
  const confirmDelete = () => {
    if (selectedItem) {
      mutation.mutate(selectedItem.id);
    }
  };

  // Filter the data based on the search query
  const filteredData = restaurantData?.pages.flatMap(page => 
    page.items.filter((item: any) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  ) || [];

  // Calculate the total number of pages
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
    const currentTotalItems = restaurantData?.pages.reduce(
      (total, page) => total + page.items.length,
      0
    ) || 0;

    if (totalItemsNeeded > currentTotalItems && hasNextPage) {
      fetchNextPage();
    }
  };

  // Add useEffect to reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
    setSelectedItems([]);
  }, [searchQuery]);

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

  const handleDeleteMany = () => {
    setShowDeleteManyPopup(true);
  };

  if (isPending) {
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
    <div className="relative overflow-x-auto sm:rounded-lg w-full mx-4 md:mx-0 scrollbar-hide">
      {/* Tooltip initialization */}
      <ReactTooltip id="delete-many-tooltip" place="top" />
      <ReactTooltip id="reload-tooltip" place="top" />
      <ReactTooltip id="add-restaurant-tooltip" place="top" />
      <ReactTooltip id="trash-tooltip" place="top" />
      <ReactTooltip id="edit-restaurant-tooltip" place="top" />
      <ReactTooltip id="delete-restaurant-tooltip" place="top" />

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
            placeholder="Search for items"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-x-2">
          {selectedItems.length > 0 && (
            <button
              type="button"
              className="text-white w-10 h-10 xl:w-auto bg-red-600 hover:bg-red-700 focus:outline-none  font-medium rounded-lg  px-3 py-2.5"
              onClick={handleDeleteMany}
              data-tooltip-id="delete-many-tooltip"
              data-tooltip-content="Delete selected restaurants"
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
            onClick={handleReload}
            data-tooltip-id="reload-tooltip"
            data-tooltip-content="Reload restaurants"
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

          <Link to="/restaurants/add">
            <button
              type="button"
              className="text-white w-10 h-10 xl:w-auto bg-gray-800 hover:bg-gray-900 text-sm font-medium rounded-lg py-2 xl:py-2.5 px-3"
              data-tooltip-id="add-restaurant-tooltip"
              data-tooltip-content="Add new restaurant"
            >
              <span className="hidden xl:flex items-center gap-1">
                <Plus size={16} /> Add Restaurant
              </span>
              <span className="inline xl:hidden">
                <Plus size={16} />
              </span>
            </button>
          </Link>

          <Link to="/restaurants/trash">
            <button
              type="button"
              className="text-white w-10 h-10 xl:w-auto bg-gray-800 hover:bg-gray-900 text-sm font-medium rounded-lg py-2 xl:py-2.5 px-3"
              data-tooltip-id="trash-tooltip"
              data-tooltip-content="View trashed restaurants"
            >
              <span className="flex gap-1 items-center">
                <Trash2 size={16} /> <p className="hidden xl:inline">Trash</p>
              </span>
            </button>
          </Link>

          <DropdownMenuDemo
            handleExport={handleExport}
            link="/restaurants/import"
          ></DropdownMenuDemo>

        </div>
      </div>
      {currentData.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No restaurants found.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 w-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === filteredData?.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th scope="col" className="px-6 py-3 w-4">#</th>
                  <th scope="col" className="px-6 py-3 w-4">Name</th>
                  <th scope="col" className="px-6 py-3">Description</th>
                  <th scope="col" className="px-6 py-3">Access code</th>
                  <th scope="col" className="px-6 py-3">Categories No.</th>
                  <th scope="col" className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((item: any, index: number) => (
                  <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                      />
                    </td>
                    <td className="px-6 py-4">{index + 1}</td>
                    <td
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      {highlightText(item.name, searchQuery)}
                    </td>
                    <td className="px-6 py-4">{item.description}</td>
                    <td className="px-6 py-4">{item.accessCode}</td>
                    <td className="px-6 py-4">{item.categories.length}</td>
                    <td className="px-6 py-4 flex gap-x-4">
                      <button className="font-medium text-blue-600">
                        <Link
                          to={`/restaurants/edit/${item.id}`}
                          state={item}
                          data-tooltip-id="edit-restaurant-tooltip"
                          data-tooltip-content="Edit restaurant"
                        >
                          <SquarePen />
                        </Link>
                      </button>
                      <button
                        className="font-medium text-red-600"
                        onClick={() => handleDeleteClick(item)}
                        data-tooltip-id="delete-restaurant-tooltip"
                        data-tooltip-content="Delete restaurant"
                      >
                        <Trash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Load More button */}
          {hasNextPage && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-500"
              >
                {isFetchingNextPage ? "Loading more..." : "Load More"}
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
            {selectedItems && selectedItems.length + " restaurant/s"}?
          </p>
        </Popup>
      )}
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

export default Restaurant;
