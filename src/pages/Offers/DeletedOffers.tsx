import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RotateCw, Trash2 } from "lucide-react";
import Popup from "@/components/Popup";
import Spinner from "@/components/Spinner";
import Pagination from "@/components/Pagination";
import axiosInstance from "@/axiosInstance";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

type OfferType = {
  id: string;
  title: string;
  description: string;
  image: string;
};

const DeletedOffers = () => {
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showRestorePopup, setShowRestorePopup] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<OfferType | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const queryClient = useQueryClient();

  // Fetch deleted offers based on current page
  const {
    data: offersData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["findAll-deleted-offers", currentPage],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", String(currentPage));
      const response = await axiosInstance.get(`/offers/findAll-deleted`, {
        params,
      });
      return response.data;
    },
  });

  // Mutation to restore an offer
  const restoreMutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.put(`/offers/restore/${id}`);
    },
    onSuccess: () => {
      // Corrected invalidateQueries and refetchQueries usage
      queryClient.invalidateQueries({ queryKey: ["findAll-deleted-offers"] });
      setShowRestorePopup(false); // Close restore popup after success
    },
  });

  // Mutation to permanently delete an offer
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/offers/${id}`);
    },
    onSuccess: () => {
      // Corrected invalidateQueries and refetchQueries usage
      queryClient.invalidateQueries({ queryKey: ["findAll-deleted-offers"] });
      setShowDeletePopup(false); // Close delete popup after success
    },
  });

  // Handle restore and delete operations
  const handleRestoreClick = (offer: OfferType) => {
    setSelectedOffer(offer);
    setShowRestorePopup(true); // Show restore popup
  };

  const handleDeleteClick = (offer: OfferType) => {
    setSelectedOffer(offer);
    setShowDeletePopup(true); // Show delete popup
  };

  const confirmRestore = () => {
    if (selectedOffer) {
      restoreMutation.mutate(selectedOffer.id);
    }
  };

  const confirmDelete = () => {
    if (selectedOffer) {
      deleteMutation.mutate(selectedOffer.id);
    }
  };

  const totalPages = Math.ceil(offersData?.totalOffers / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return <div>Error loading deleted offers.</div>;
  }

  return (
    <div className="relative overflow-x-auto sm:rounded-lg w-full mx-6 scrollbar-hide">
      <ReactTooltip id="restore-tooltip" place="top" />
      <ReactTooltip id="delete-tooltip" place="top" />

      <div className="flex flex-wrap justify-between mb-4">
        <h1 className="text-xl font-bold">Deleted Offers</h1>
      </div>

      {/* Deleted Offers Table */}
      {offersData?.offers?.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No deleted offers found.</p>
        </div>
      ) : (
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Offer ID
              </th>
              <th scope="col" className="px-6 py-3">
                Title
              </th>
              <th scope="col" className="px-6 py-3">
                Description
              </th>
              <th scope="col" className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {offersData?.offers?.map((offer: OfferType) => (
              <tr key={offer.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4">{offer.id}</td>
                <td className="px-6 py-4">{offer.title}</td>
                <td className="px-6 py-4">{offer.description}</td>
                <td className="px-6 py-4 flex gap-x-4">
                  <button
                    className="font-medium text-green-600"
                    onClick={() => handleRestoreClick(offer)}
                    data-tooltip-id="restore-tooltip"
                    data-tooltip-content="Restore"
                  >
                    <RotateCw />
                  </button>
                  <button
                    className="font-medium text-red-600"
                    onClick={() => handleDeleteClick(offer)}
                    data-tooltip-id="delete-tooltip"
                    data-tooltip-content="Delete"
                  >
                    <Trash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-10">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      )}

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
          <p>Are you sure you want to restore {selectedOffer?.title}?</p>
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
          <p>Are you sure you want to delete {selectedOffer?.title}?</p>
        </Popup>
      )}
    </div>
  );
};

export default DeletedOffers;
