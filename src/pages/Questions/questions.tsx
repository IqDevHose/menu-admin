import Popup from "@/components/Popup";
import Spinner from "@/components/Spinner";
import Pagination from "@/components/Pagination"; // Import the Pagination component
import { highlightText } from "@/utils/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, RotateCw, SquarePen, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "@/axiosInstance";
import exportCSVFile from "json-to-csv-export";
import { DropdownMenuDemo } from "@/components/DropdownMenu";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css"; // Importing the styles

type questionsReviewType = {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryName: string;
};

interface DataItem {
  createdAt: String;
  deleted: Boolean;
  description: String;
  enTitle: String;
  id: String;
  restaurantId: String;
  title: String;
  updatedAt: String;
}

const flattenObject = (
  obj: Record<string, any>,
  parent = "",
  ques: Record<string, any> = {}
): Record<string, any> => {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const propName = parent ? `${parent}.${key}` : key;
      if (typeof obj[key] === "object" && obj[key] !== null) {
        flattenObject(obj[key], propName, ques);
      } else {
        ques[propName] = obj[key];
      }
    }
  }
  return ques;
};

// Extract headers from the data
const extractHeaders = (data: DataItem[]): string[] => {
  const flattenedData = data.map((item) => flattenObject(item));
  const headers = Array.from(new Set(flattenedData.flatMap(Object.keys)));
  return headers;
};

const Questions = () => {
  const [showPopup, setShowPopup] = useState(false); // State to manage popup visibility
  const [showDeleteManyPopup, setShowDeleteManyPopup] = useState(false); // State to manage popup visibility
  const [selectedItem, setSelectedItem] = useState<questionsReviewType | null>(
    null
  ); // State to manage selected item for deletion
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // State to manage current page
  const [selectedItems, setSelectedItems] = useState<string[]>([]); // State to manage selected items for checkbox selection
  const itemsPerPage = 10; // Set the number of items per page
  const queryClient = useQueryClient();
  const [headers, setHeaders] = useState<string[]>([]);

  // Modify useQuery to destructure refetch
  const {
    data: queryData,
    isLoading,
    isError,
    refetch, // Destructure refetch to use later
    isRefetching,
  } = useQuery({
    queryKey: ["questions", currentPage],
    queryFn: async () => {
      const questions = await axiosInstance.get(
        `/question?page=${currentPage}`
      );
      return questions.data;
    },
    refetchOnWindowFocus: true,
  });

  const handleReload = async () => {
    await queryClient.invalidateQueries({ queryKey: ["questions"] });
    refetch(); // Optionally trigger refetch after invalidation
  };

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/question/soft-delete/${id}`);
    },
    onSuccess: () => {
      refetch(); // Refetch data after successful deletion
      setShowPopup(false); // Close the popup after successful deletion
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (selectedItemsIds: string[]) => {
      return axiosInstance.put(`/question/soft-delete-many`, {
        data: selectedItemsIds,
      });
    },
    onSuccess: () => {
      refetch(); // Refetch data after successful deletion
      setShowDeleteManyPopup(false); // Close the popup after successful deletion
    },
  });

  const { data: exportData } = useQuery({
    queryKey: ["questions-all"],
    queryFn: async () => {
      const item = await axiosInstance.get(`/question?page=all`);
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
      filename: "questions",
      delimiter: ",",
      headers,
    };

    exportCSVFile(dataToConvert);
  };

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

  const filteredData = queryData?.items?.filter((item: any) =>
    item.resturant?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination based on filtered data
  const currentData = filteredData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset the current page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Handle select all checkbox
  const handleSelectAll = () => {
    if (selectedItems.length === currentData.length) {
      setSelectedItems([]);
    } else {
      const allIds = currentData.map((item: any) => item.id);
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

  // Calculate the total number of pages
  const totalPages = Math.ceil(queryData?.totalItems / itemsPerPage);

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
    <div className="relative overflow-x-auto sm:rounded-lg w-full mx-6 md:mx-0 scrollbar-hide">
      {/* Tooltip initialization */}
      <ReactTooltip id="delete-many-tooltip" place="top" />
      <ReactTooltip id="reload-tooltip" place="top" />
      <ReactTooltip id="add-question-tooltip" place="top" />
      <ReactTooltip id="trash-tooltip" place="top" />
      <ReactTooltip id="edit-question-tooltip" place="top" />
      <ReactTooltip id="delete-question-tooltip" place="top" />

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
            className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search for items"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="gap-2 flex justify-center items-start">
          {selectedItems.length > 0 && (
            <button
              type="button"
              className="text-white w-10 h-10 xl:w-auto bg-red-600 hover:bg-red-700 focus:outline-none  font-medium rounded-lg  px-3 py-2.5"
              onClick={handleDeleteMany}
              data-tooltip-id="delete-many-tooltip"
              data-tooltip-content="Delete selected questions"
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
            data-tooltip-content="Reload questions"
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

          <Link to={"/questions/add"}>
            <button
              type="button"
              className="text-white w-10 h-10 xl:w-auto bg-gray-800 hover:bg-gray-900 font-medium rounded-lg py-2 xl:py-2.5 px-3 text-nowrap text-sm"
              data-tooltip-id="add-question-tooltip"
              data-tooltip-content="Add new question"
            >
              <span className="hidden xl:flex items-center gap-1">
                <Plus size={16} /> Add Question
              </span>
              <span className="inline xl:hidden">
                <Plus size={16} />
              </span>
            </button>
          </Link>

          <Link to={"/questions/trash"}>
            <button
              type="button"
              className="text-white w-10 h-10 xl:w-auto bg-gray-800 hover:bg-gray-900 font-medium rounded-lg py-2 xl:py-2.5 px-3 text-nowrap text-sm"
              data-tooltip-id="trash-tooltip"
              data-tooltip-content="View trashed questions"
            >
              <span className="flex gap-1 items-center">
                <Trash2 size={20} /> <p className="hidden xl:inline">Trash</p>
              </span>
            </button>
          </Link>

          <DropdownMenuDemo
            handleExport={handleExport}
            link="/questions/import"
          ></DropdownMenuDemo>
        </div>
      </div>

      {/* Conditional rendering when no items are found */}
      {filteredData?.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No questions found.</p>
        </div>
      ) : (
        <>
          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
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
                    Restaurant Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3">
                    en Title
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Answer
                  </th>
                  <th scope="col" className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {currentData?.map((item: any, index: number) => (
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
                    <td
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      {highlightText(item.resturant?.name || "", searchQuery)}
                    </td>
                    <td className="px-6 py-4">{item.title}</td>
                    <td className="px-6 py-4">{item.enTitle}</td>
                    <td className="px-6 py-4">{item.description}</td>
                    <td className="px-6 py-4">{item?.answer}</td>
                    <td className="px-6 py-4 flex gap-x-4">
                      <button
                        className="font-medium text-blue-600"
                        data-tooltip-id="edit-question-tooltip"
                        data-tooltip-content="Edit question"
                      >
                        <Link to={`/questions/edit/${item.id}`} state={item}>
                          <SquarePen />
                        </Link>
                      </button>
                      <button
                        className="font-medium text-red-600"
                        onClick={() => handleDeleteClick(item)}
                        data-tooltip-id="delete-question-tooltip"
                        data-tooltip-content="Delete question"
                      >
                        <Trash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Component */}
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
            {selectedItems && selectedItems.length + " question/s"}?
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

export default Questions;
