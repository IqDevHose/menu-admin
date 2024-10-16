import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Plus, RotateCw, SquarePen, Trash2 } from "lucide-react";
import Popup from "@/components/Popup";
import { Link } from "react-router-dom";
import Pagination from "../../components/Pagination";
import Spinner from "@/components/Spinner";
import { highlightText } from "@/utils/utils";
import axiosInstance from "@/axiosInstance";
import exportCSVFile from "json-to-csv-export";
import { DropdownMenuDemo } from "@/components/DropdownMenu";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css"; // Importing the styles
import { getIconByTitle } from "@/utils/data";

type categoryReviewType = {
  id: string;
  name: string;
};

interface DataCategory {
  createdAt: String;
  deleted: boolean;
  icon: String;
  id: String;
  name: String;
  orderNumber: String;
  restaurantId: String;
  updatedAt: String;
}

const flattenObject = (
  obj: Record<string, any>,
  parent = "",
  category: Record<string, any> = {}
): Record<string, any> => {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const propName = parent ? `${parent}.${key}` : key;
      if (typeof obj[key] === "object" && obj[key] !== null) {
        flattenObject(obj[key], propName, category);
      } else {
        category[propName] = obj[key];
      }
    }
  }
  return category;
};

// Extract headers from the data
const extractHeaders = (data: DataCategory[]): string[] => {
  const flattenedData = data.map((item) => flattenObject(item));
  const headers = Array.from(new Set(flattenedData.flatMap(Object.keys)));
  return headers;
};

const Category = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showDeleteManyPopup, setShowDeleteManyPopup] = useState(false); // State to manage popup visibility
  const [selectedCategory, setSelectedCategory] =
    useState<categoryReviewType | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState(""); // State to manage selected restaurant
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<string[]>([]); // State to manage selected items for checkbox selection
  const itemsPerPage = 10;

  const queryClient = useQueryClient();
  const [headers, setHeaders] = useState<string[]>([]);

  // Fetch restaurants
  const { data: restaurants } = useQuery({
    queryKey: ["restaurants"],
    queryFn: async () => {
      const res = await axiosInstance.get("/restaurant");
      return res.data;
    },
  });

  const { data: exportData } = useQuery({
    queryKey: ["categories-export"],
    queryFn: async () => {
      const item = await axiosInstance.get(`/category?page=all`);
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
      filename: "categories",
      delimiter: ",",
      headers,
    };

    exportCSVFile(dataToConvert);
  };

  // Fetch categories based on selected restaurant
  const {
    data: categoryData,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["categories", selectedRestaurant],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", "all"); // Fetch all items to handle filtering manually
      if (selectedRestaurant) {
        params.append("restaurantId", selectedRestaurant);
      }
      const category = await axiosInstance.get(`/category`, { params });
      return category.data;
    },
    refetchOnWindowFocus: false, // Prevent automatic refetching on window focus if not needed
  });

  const handleReload = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["categories", selectedRestaurant],
    });
    refetch(); // Optionally trigger refetch after invalidation
  };

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/category/soft-delete/${id}`);
    },
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setShowPopup(false);
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (selectedItemsIds: string[]) => {
      return axiosInstance.put(`/category/soft-delete-many`, {
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
    setSelectedCategory(item);
    setShowPopup(true);
  };

  const confirmDeleteMany = () => {
    if (selectedItems.length > 0) {
      deleteMutation.mutate(selectedItems);
    }
  };

  const confirmDelete = () => {
    if (selectedCategory) {
      mutation.mutate(selectedCategory.id);
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === currentData.length) {
      setSelectedItems([]);
    } else {
      const allIds = currentData.map((item: any) => item.id);
      setSelectedItems(allIds);
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(id)
        ? prevSelectedItems.filter((itemId) => itemId !== id)
        : [...prevSelectedItems, id]
    );
  };

  // Filter data based on the search query
  const filteredData =
    categoryData?.items.filter((item: any) =>
      item?.name?.toLowerCase().includes(searchQuery.toLowerCase())
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
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedRestaurant, searchQuery]);

  const handleDeleteMany = () => {
    setShowDeleteManyPopup(true);
  };

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
      <ReactTooltip id="add-category-tooltip" place="top" />
      <ReactTooltip id="trash-tooltip" place="top" />
      <ReactTooltip id="edit-category-tooltip" place="top" />
      <ReactTooltip id="delete-category-tooltip" place="top" />

      <div className="flex flex-wrap justify-between mb-4">
        <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center gap-4 pb-4">
          {/* Search Bar */}
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
              placeholder="Search for categories"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {/* Restaurant Filter */}
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

        <div className="gap-2 flex justify-center items-start">
          {selectedItems.length > 0 && (
            <button
              type="button"
              className="text-white w-10 h-10 xl:w-auto bg-red-600 hover:bg-red-700 focus:outline-none  font-medium rounded-lg  px-3 py-2.5"
              onClick={handleDeleteMany}
              data-tooltip-id="delete-many-tooltip"
              data-tooltip-content="Delete selected categories"
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
            onClick={handleReload} // Updated to handleReload            data-tooltip-id="reload-tooltip"
            data-tooltip-content="Reload categories"
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

          <Link to={"/categories/add"}>
            <button
              type="button"
              className="text-white w-10 h-10 xl:w-auto bg-gray-800 hover:bg-gray-900 font-medium rounded-lg py-2 xl:py-2.5 px-3 text-nowrap text-sm"
              data-tooltip-id="add-category-tooltip"
              data-tooltip-content="Add new category"
            >
              <span className="hidden xl:flex items-center gap-1">
                <Plus size={16} /> Add Category
              </span>
              <span className="inline xl:hidden">
                <Plus size={16} />
              </span>
            </button>
          </Link>

          <Link to={"/categories/trash"}>
            <button
              type="button"
              className="text-white w-10 h-10 xl:w-auto bg-gray-800 hover:bg-gray-900 font-medium rounded-lg py-2.5 px-3 text-sm"
              data-tooltip-id="trash-tooltip"
              data-tooltip-content="View trashed categories"
            >
              <span className="flex gap-1 items-center">
                <Trash2 size={16} /> <p className="hidden xl:inline">Trash</p>
              </span>
            </button>
          </Link>

          <DropdownMenuDemo
            handleExport={handleExport}
            link="/categories/import"
          ></DropdownMenuDemo>
        </div>
      </div>

      {currentData.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No categories found.</p>
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
                      checked={selectedItems.length === currentData.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th scope="col" className="px-6 py-3 w-4">
                    #
                  </th>
                  <th scope="col" className="px-6 py-3 w-4">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 w-4">
                    Icon
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Items No.
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Restaurant
                  </th>
                  <th scope="col" className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((item: any, index: number) => (
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
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {highlightText(item?.name || "", searchQuery)}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {item?.icon}
                    </td>
                    <td className="px-6 py-4">{item?.items?.length || 0}</td>
                    <td className="px-6 py-4">{item?.name || "N/A"}</td>
                    <td className="px-6 py-4 flex gap-x-4">
                      <Link
                        to={`/categories/edit/${item.id}`}
                        state={item}
                        className="font-medium text-blue-600"
                        data-tooltip-id="edit-category-tooltip"
                        data-tooltip-content="Edit category"
                      >
                        <SquarePen />
                      </Link>
                      <button
                        className="font-medium text-red-600"
                        onClick={() => handleDeleteClick(item)}
                        data-tooltip-id="delete-category-tooltip"
                        data-tooltip-content="Delete category"
                      >
                        <Trash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-10">
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
            {selectedItems && selectedItems.length + " category/s"}?
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
          <p>Are you sure you want to delete {selectedCategory?.name}?</p>
        </Popup>
      )}
    </div>
  );
};

export default Category;
