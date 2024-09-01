import axios from "axios";
import { SquarePen, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Popup from "@/components/Popup";
import Spinner from "@/components/Spinner";
import { highlightText } from "@/utils/utils";
import Pagination from "@/components/Pagination";
import axiosInstance from "@/axiosInstance";
import exportCSVFile from "json-to-csv-export";
import { DropdownMenuDemo } from "@/components/DropdownMenu";

type restaurantReviewType = {
  id: string;
  name: string;
};

interface DataItem {
  accessCode: string;
  createdAt: string;
  deleted: boolean;
  description: string;
  id: string;
  image: string | null;
  name: string;
  updatedAt: string;
}

const flattenObject = (
  obj: Record<string, any>,
  parent = "",
  res: Record<string, any> = {}
): Record<string, any> => {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const propName = parent ? `${parent}.${key}` : key;
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

  const query = useQuery({
    queryKey: ["restaurant", currentPage],
    queryFn: async () => {
      const res = await axiosInstance.get(`/restaurant?page=${currentPage}`);

      // console.log(res.data)
      return res.data;
    },
  });

  const { data: exportData } = useQuery({
    queryKey: ["items"],
    queryFn: async () => {
      const item = await axios.get(`http://localhost:3000/restaurant?page=all`);

      console.log(item.data.items);
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
      filename: "restaurants",
      delimiter: ",",
      headers,
    };

    // console.log(dataToConvert)
    exportCSVFile(dataToConvert);
  };

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/restaurant/soft-delete/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurant"] });
      setShowPopup(false); // Close the popup after successful deletion
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (selectedItemsIds: string[]) => {
      console.log(selectedItemsIds);
      return axiosInstance.delete(`/restaurant/soft-delete-many`, {
        data: selectedItemsIds,
      });
    },
    onSuccess: () => {
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
  const filteredData = query.data?.items.filter((item: any) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
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
            placeholder="Search for items"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-start gap-x-2">
          {selectedItems.length > 0 && (
            <button
              type="button"
              className="text-white bg-red-600 hover:bg-red-700 focus:outline-none  font-medium rounded-lg  px-3 py-2.5"
              onClick={handleDeleteMany}
            >
              Delete {selectedItems.length}
            </button>
          )}
          <Link to="/restaurants/add">
            <button
              type="button"
              className="text-white bg-gray-800 hover:bg-gray-900 font-medium rounded-lg py-2 xl:py-2.5 px-5"
            >
              <span className="hidden xl:inline">Add Restaurant</span>
              <span className="inline xl:hidden">+</span>
            </button>
          </Link>
          <Link to="/restaurants/trash">
            <button
              type="button"
              className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none  font-medium rounded-lg  py-2.5  mb-2 px-5"
            >
              <span className="flex gap-1 items-center">
                <Trash2 size={20} /> <p className="hidden xl:inline">Trash</p>
              </span>
            </button>
          </Link>

          <DropdownMenuDemo
            handleExport={handleExport}
            link="/restaurants/import"
          ></DropdownMenuDemo>
        </div>
      </div>
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
            <th scope="col" className="px-6 py-3 w-4">
              #
            </th>
            <th scope="col" className="px-6 py-3 w-4">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Description
            </th>
            <th scope="col" className="px-6 py-3">
              Access code
            </th>
            <th scope="col" className="px-6 py-3">
              Categories No.
            </th>
            <th scope="col" className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {filteredData?.map((item: any, index: number) => (
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
                  <Link to={`/restaurants/edit/${item.id}`} state={item}>
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

      {/* Use the Pagination component */}
      <div className="flex justify-center items-center mt-10">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

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
