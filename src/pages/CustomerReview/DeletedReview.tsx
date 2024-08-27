import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { SquarePen, Trash2 } from "lucide-react";
import Popup from "@/components/Popup";
import { Link } from "react-router-dom";
import Spinner from "@/components/Spinner";
import { highlightText } from "../../utils/utils";
import Pagination from "@/components/Pagination"; // Import the Pagination component

type itemReviewType = {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryName: string;
  image: string;
};

const DeletedReview = () => {
  const [showDeletePopup, setShowDeletePopup] = useState(false); // Separate state for delete popup
  const [showRestorePopup, setShowRestorePopup] = useState(false); // Separate state for restore popup
  const [selectedItem, setSelectedItem] = useState<itemReviewType | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const queryClient = useQueryClient();

  // Fetch deleted items based on current page and search query
  const {
    data: itemsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["findAll-deleted-review", currentPage],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", String(currentPage));
      // Fetching deleted items from the server
      const item = await axios.get(`http://localhost:3000/customer-review/findAll-deleted`, { params });
      return item.data;
    },
  });

  // Handle item restoration
  const restoreMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.put(`http://localhost:3000/customer-review/restore/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["findAll-deleted-review"] });
      setShowRestorePopup(false); // Close the restore popup after success
    },
  });

  // Handle item final deletion
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`http://localhost:3000/customer-review/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["findAll-deleted-review"] });
      setShowDeletePopup(false); // Close the delete popup after success
    },
  });

  // Handle restore and delete operations
  const handleRestoreClick = (item: itemReviewType) => {
    setSelectedItem(item);
    setShowRestorePopup(true); // Show restore popup
  };

  const handleDeleteClick = (item: itemReviewType) => {
    setSelectedItem(item);
    setShowDeletePopup(true); // Show delete popup
  };

  const confirmRestore = () => {
    if (selectedItem) {
      restoreMutation.mutate(selectedItem.id);
    }
  };

  const confirmDelete = () => {
    if (selectedItem) {
      deleteMutation.mutate(selectedItem.id);
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
      <div className="flex justify-between">
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
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 w-4"></th>
            <th scope="col" className="px-6 py-3">#</th>
            <th scope="col" className="px-6 py-3">Name</th>
            <th scope="col" className="px-6 py-3">Description</th>
            <th scope="col" className="px-6 py-3">Price</th>
            <th scope="col" className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {filteredData?.map((item: any, index: number) => (
            <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4">
                {(currentPage - 1) * itemsPerPage + index + 1}
              </td>
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                {highlightText(item?.name, searchQuery)}
              </td>
              <td className="px-6 py-4">{item?.description}</td>
              <td className="px-6 py-4">{item?.price}</td>
              <td className="px-6 py-4 flex gap-x-4">
                <Link to={`/edit-items/${item?.id}`} state={item}>
                  <SquarePen className="text-blue-600" />
                </Link>
                <button
                  className="font-medium text-green-600"
                  onClick={() => handleRestoreClick(item)}
                >
                  Restore
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

      {/* Pagination Component */}
      <div className="flex justify-center items-center mt-10">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Restore Confirmation Popup */}
      {showRestorePopup && (
        <Popup
          onClose={() => setShowRestorePopup(false)}
          onConfirm={confirmRestore}
          loading={restoreMutation.isPending}
          confirmText="Restore"
          loadingText="Restoring..."
          cancelText="Cancel"
        >
          <p>Are you sure you want to restore {selectedItem?.name}?</p>
        </Popup>
      )}

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <Popup
          onClose={() => setShowDeletePopup(false)}
          onConfirm={confirmDelete}
          loading={deleteMutation.isPending}
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

export default DeletedReview;
