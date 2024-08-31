import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { SquarePen, Trash2 } from "lucide-react";
import Popup from "@/components/Popup";
import { Link } from "react-router-dom";
import Spinner from "@/components/Spinner";
import { highlightText } from "../../utils/utils";
import Pagination from "@/components/Pagination"; // Import the Pagination component
import exportCSVFile from "json-to-csv-export";
import axiosInstance from "@/axiosInstance";
import Papa from "papaparse";
import { DropdownMenuDemo } from "@/components/DropdownMenu";

type itemReviewType = {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryName: string;
  image: string;
};

interface DataItem {
  categoryId: string;
  createdAt: string;
  deleted: boolean;
  description: string;
  id: string;
  image: string | null;
  name: string;
  price: number;
  updatedAt: string;
}

// Utility function to flatten the JSON object
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

const Item = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showDeleteManyPopup, setShowDeleteManyPopup] = useState(false); // State to manage popup visibility
  const [selectedItem, setSelectedItem] = useState<itemReviewType | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]); // State to manage selected items for checkbox selection
  const [currentPage, setCurrentPage] = useState(1);
  const [headers, setHeaders] = useState<string[]>();
  const itemsPerPage = 10;

  // Import Data
  // const [parsedData, setParsedData] = useState<any[]>([]);
  // const [csvHeaders, setCsvHeaders] = useState<string[]>();

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.files && event.target.files.length > 0) {
  //     const file = event.target.files[0];

  //     Papa.parse(file, {
  //       header: true,
  //       skipEmptyLines: true,
  //       complete: (result) => {
  //         const data = result.data;
  //         const csvHeads = result.meta.fields || [];

  //         console.log(csvHeads)
  //         console.log(data)
  //         setCsvHeaders(csvHeads);
  //         setParsedData(data);
  //       },
  //       error: (error) => {
  //         console.error('Error parsing CSV file:', error);
  //       },
  //     });

  //   }
  // };

  // const handleUpload = async () => {
  //   console.log(parsedData)
  //   // if (parsedData.length > 0) {
  //   //   try {
  //   //     const response = await axios.post('/api/upload', parsedData);
  //   //     console.log('Data uploaded successfully:', response.data);
  //   //     // Handle success (e.g., show a success message)
  //   //   } catch (error) {
  //   //     console.error('Error uploading data:', error);
  //   //     // Handle error (e.g., show an error message)
  //   //   }
  //   // }
  // };

  const queryClient = useQueryClient();

  const { data: exportData } = useQuery({
    queryKey: ["items"],
    queryFn: async () => {
      const item = await axios.get(`http://localhost:3000/item?page=all`);

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
      filename: "items",
      delimiter: ",",
      headers,
    };

    // console.log(dataToConvert)
    exportCSVFile(dataToConvert);
  };
  // Fetch items based on current page, category, and restaurant filters
  const {
    data: itemsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["items", currentPage, selectedCategory, selectedRestaurant],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", String(currentPage));
      if (selectedCategory) params.append("categoryId", selectedCategory);
      if (selectedRestaurant) params.append("restaurantId", selectedRestaurant);

      const item = await axios.get(`http://localhost:3000/item`, { params });
      // const heads: any[] = extractHeaders(item.data.items)
      // setHeaders(heads)
      return item.data;
    },
  });

  // Handle item deletion

  // Fetch categories based on the selected restaurant
  const { data: categories } = useQuery({
    queryKey: ["categories", selectedRestaurant],
    queryFn: async () => {
      if (!selectedRestaurant) return []; // Return empty array if no restaurant is selected
      const res = await axios.get(
        `http://localhost:3000/category?restaurantId=${selectedRestaurant}`
      );
      return res.data;
    },
    enabled: !!selectedRestaurant, // Only fetch categories when a restaurant is selected
  });

  // Fetch restaurants
  const { data: restaurants } = useQuery({
    queryKey: ["restaurants"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3000/restaurant");
      return res.data;
    },
  });

  // Handle item deletion
  const mutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`http://localhost:3000/item/soft-delete/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      setShowPopup(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (selectedItemsIds: string[]) => {
      console.log(selectedItemsIds);
      return axiosInstance.delete(`/item/soft-delete-many`, {
        data: selectedItemsIds,
      });
    },
    onSuccess: () => {
      setShowDeleteManyPopup(false);
      return "Items deleted successfully";
    },
  });

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

  // Reset the current page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedRestaurant]);

  const handleDeleteClick = (item: itemReviewType) => {
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

  const filteredData = itemsData?.items?.filter((item: itemReviewType) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(itemsData?.totalItems / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setSelectedItems([]);
  };

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
    <div className="relative overflow-x-auto sm:rounded-lg w-full m-14 scrollbar-hide">
      <div className="flex justify-between ">
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
              placeholder="Search for items"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg disabled:bg-gray-200"
            disabled={!selectedRestaurant} // Disable category filter until a restaurant is selected
          >
            <option value="">All Categories</option>
            {categories?.items?.map((category: any) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          {/* Restaurant Filter */}
          <select
            value={selectedRestaurant}
            onChange={(e) => {
              setSelectedRestaurant(e.target.value);
              setSelectedCategory(""); // Reset the category when a new restaurant is selected
            }}
            className="p-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Restaurants</option>
            {restaurants?.items?.map((restaurant: any) => (
              <option key={restaurant.id} value={restaurant.id}>
                {restaurant.name}
              </option>
            ))}
          </select>
        </div>
        <div className="gap-2 flex items-start justify-center">
          {selectedItems.length > 0 && (
            <button
              type="button"
              className="text-white bg-red-700 hover:bg-gray-900 focus:outline-none  font-medium rounded-lg  px-3 py-2.5"
              onClick={handleDeleteMany}
            >
              Delete {selectedItems.length}
            </button>
          )}
          <Link to="/items/add">
            <button
              type="button"
              className="text-white bg-gray-800 hover:bg-gray-900 font-medium rounded-lg py-2 xl:py-2.5 px-5"
            >
              <span className="hidden xl:inline">Add Item</span>
              <span className="inline xl:hidden">+</span>
            </button>
          </Link>
          <Link to="/items/trash">
            <button
              type="button"
              className="text-white  bg-gray-800 hover:bg-gray-900 font-medium rounded-lg py-2.5 px-5 "
            >
              <span className="flex gap-1 items-center">
                <Trash2 size={20} /> <p className="hidden xl:inline">Trash</p>
              </span>
            </button>
          </Link>

          <DropdownMenuDemo
            handleExport={handleExport}
            link="/items/import"
          ></DropdownMenuDemo>
          {/* <label
            htmlFor="file"
              className="text-white cursor-pointer bg-gray-800 hover:bg-gray-900 font-medium rounded-lg py-2.5 px-5 "
            >
              <span className="flex gap-1 ">
                Import
              </span>
            </label>
            <input
              id="file"
              name="file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden text-white  bg-gray-800 hover:bg-gray-900 font-medium rounded-lg py-2.5 px-5 "
            /> */}
        </div>
      </div>

      {/* Items Table */}
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
            <th scope="col" className="px-6 py-3">
              #
            </th>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Description
            </th>
            <th scope="col" className="px-6 py-3">
              Price
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
              <td className="px-6 py-4">
                {(currentPage - 1) * itemsPerPage + index + 1}
              </td>
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                {highlightText(item?.name, searchQuery)}
              </td>
              <td className="px-6 py-4">{item?.description}</td>
              <td className="px-6 py-4">{item?.price}</td>
              <td className="px-6 py-4 flex gap-x-4">
                <Link to={`/items/edit/${item.id}`} state={item}>
                  <SquarePen className="text-blue-600" />
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

      {/* Pagination Component */}
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
            {selectedItems && selectedItems.length + " item/s"}?
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
    </div>
  );
};

export default Item;
