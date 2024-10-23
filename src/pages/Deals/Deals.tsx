import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, RotateCw, SquarePen, Trash2 } from "lucide-react";
import Popup from "@/components/Popup";
import { Link } from "react-router-dom";
import Spinner from "@/components/Spinner";
import { highlightText } from "../../utils/utils";
import Pagination from "@/components/Pagination";
import axiosInstance from "@/axiosInstance";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import exportCSVFile from "json-to-csv-export";
import { DropdownMenuDemo } from "@/components/DropdownMenu";
import { Switch } from "@/components/ui/switch";

type DealType = {
  id: string;
  title: string;
  description: string;
  discount: string;
  restaurantId: string;
  published: boolean;
  expiresAt: string;
};

const Deals = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showDeleteManyPopup, setShowDeleteManyPopup] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<DealType | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [selectedDeals, setSelectedDeals] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [headers, setHeaders] = useState<string[]>([]);
  const itemsPerPage = 10;

  const queryClient = useQueryClient();

  const {
    data: dealsData,
    isPending,
    isError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["deals", selectedRestaurant, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      if (selectedRestaurant) {
        params.append("restaurantId", selectedRestaurant);
      }
      const response = await axiosInstance.get(`/deal`, { params });
      console.log("response", response.data);
      return await response.data;
    },
    refetchOnWindowFocus: false,
  });

  const handleExport = () => {
    const dataToConvert = {
      data: dealsData.items,
      filename: "deals",
      delimiter: ",",
      headers,
    };

    exportCSVFile(dataToConvert);
  };

  const handleReload = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["deals", selectedRestaurant],
    });
    refetch();
  };

  const { data: restaurants } = useQuery({
    queryKey: ["restaurants"],
    queryFn: async () => {
      const res = await axiosInstance.get("/restaurant");
      return res.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/deal/soft-delete/${id}`);
    },
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ["deals"] });
      setShowPopup(false);
    },
  });

  const deleteManyMutation = useMutation({
    mutationFn: (selectedDealIds: string[]) => {
      return axiosInstance.put(`/deal/soft-delete-many`, { ids: selectedDealIds });
    },
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ["deals"] });
      setShowDeleteManyPopup(false);
      setSelectedDeals([]);
    },
  });

  const updatePublishedMutation = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      await axiosInstance.put(`/deal/${id}`, { published });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
    },
  });

  const handlePublishedToggle = (id: string, currentStatus: boolean) => {
    updatePublishedMutation.mutate({ id, published: !currentStatus });
  };

  const filteredData = dealsData?.items?.filter((deal: DealType) =>
    deal.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentData = filteredData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredData?.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedRestaurant, searchQuery]);

  useEffect(() => {
    if (dealsData?.items?.length > 0) {
      setHeaders(Object.keys(dealsData.items[0]));
    }
  }, [dealsData]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setSelectedDeals([]);
  };

  const handleSelectAll = () => {
    if (selectedDeals.length === currentData.length) {
      setSelectedDeals([]);
    } else {
      const allIds = currentData.map((deal: DealType) => deal.id);
      setSelectedDeals(allIds);
    }
  };

  const handleSelectDeal = (id: string) => {
    setSelectedDeals((prevSelectedDeals) =>
      prevSelectedDeals.includes(id)
        ? prevSelectedDeals.filter((dealId) => dealId !== id)
        : [...prevSelectedDeals, id]
    );
  };

  const handleDeleteClick = (deal: DealType) => {
    setSelectedDeal(deal);
    setShowPopup(true);
  };

  const confirmDelete = () => {
    if (selectedDeal) {
      mutation.mutate(selectedDeal.id);
    }
  };

  const confirmDeleteMany = () => {
    if (selectedDeals.length > 0) {
      deleteManyMutation.mutate(selectedDeals);
    }
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
    return <div>Error loading deals</div>;
  }

  return (
    <div className="relative overflow-x-auto sm:rounded-lg w-full mx-6 md:mx-0 scrollbar-hide">
      <ReactTooltip id="delete-many-tooltip" place="top" />
      <ReactTooltip id="reload-tooltip" place="top" />
      <ReactTooltip id="add-deal-tooltip" place="top" />
      <ReactTooltip id="edit-deal-tooltip" place="top" />
      <ReactTooltip id="delete-deal-tooltip" place="top" />

      <div className="flex flex-wrap justify-between mb-4">
        <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center gap-4 pb-4">
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
              placeholder="Search for deals"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            value={selectedRestaurant}
            onChange={(e) => setSelectedRestaurant(e.target.value)}
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
          {selectedDeals.length > 0 && (
            <button
              type="button"
              className="text-white w-10 h-10 xl:w-auto bg-red-600 hover:bg-red-700 focus:outline-none font-medium rounded-lg px-3 py-2.5"
              onClick={handleDeleteMany}
              data-tooltip-id="delete-many-tooltip"
              data-tooltip-content="Delete selected deals"
            >
              <div className="flex items-center flex-nowrap gap-1">
                <Trash2 size={16} />
                <span className="hidden xl:flex">Delete</span>
                <span className="hidden xl:flex">{selectedDeals.length}</span>
              </div>
            </button>
          )}

          <button
            type="button"
            disabled={isRefetching}
            className="text-white w-10 h-10 xl:w-auto bg-gray-800 text-sm hover:bg-gray-900 font-medium rounded-lg py-2.5 px-3 disabled:animate-pulse disabled:bg-gray-600"
            onClick={handleReload}
            data-tooltip-id="reload-tooltip"
            data-tooltip-content="Reload deals"
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

          <Link to="/deals/add">
            <button
              type="button"
              className="text-white w-10 h-10 xl:w-auto bg-gray-800 hover:bg-gray-900 font-medium rounded-lg py-2 xl:py-2.5 px-3 text-nowrap text-sm"
              data-tooltip-id="add-deal-tooltip"
              data-tooltip-content="Add new deal"
            >
              <span className="hidden xl:flex items-center gap-1">
                <Plus size={16} /> Add Deal
              </span>
              <span className="inline xl:hidden">
                <Plus size={16} />
              </span>
            </button>
          </Link>
          <Link to="/deals/trash">
            <button
              type="button"
              className="text-white w-10 h-10 xl:w-auto bg-gray-800 text-sm hover:bg-gray-900 font-medium rounded-lg py-2.5 px-3"
              data-tooltip-id="trash-tooltip"
              data-tooltip-content="View trashed items"
            >
              <span className="flex gap-1 items-center">
                <Trash2 size={16} /> <p className="hidden xl:inline">Trash</p>
              </span>
            </button>
          </Link>

          <DropdownMenuDemo handleExport={handleExport} link="/deals/import" />
        </div>
      </div>

      {currentData && currentData.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg font-medium">No Deals available</p>
        </div>
      ) : (
        <>
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 w-4">
                  <input
                    type="checkbox"
                    checked={selectedDeals.length === currentData?.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th scope="col" className="px-6 py-3">#</th>
                <th scope="col" className="px-6 py-3">Title</th>
                <th scope="col" className="px-6 py-3">Description</th>
                <th scope="col" className="px-6 py-3">Discount</th>
                <th scope="col" className="px-6 py-3">Published</th>
                <th scope="col" className="px-6 py-3">Expires At</th>
                <th scope="col" className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {currentData?.map((deal: DealType, index: number) => (
                <tr key={deal.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedDeals.includes(deal.id)}
                      onChange={() => handleSelectDeal(deal.id)}
                    />
                  </td>
                  <td className="px-6 py-4">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {highlightText(deal.title, searchQuery)}
                  </td>
                  <td className="px-6 py-4">{deal.description}</td>
                  <td className="px-6 py-4">{deal.discount}</td>
                  <td className="px-6 py-4">
                    <Switch
                      className="data-[state=checked]:bg-green-400"
                      checked={deal.published}
                      onCheckedChange={() => handlePublishedToggle(deal.id, deal.published)}
                      disabled={updatePublishedMutation.isPending}
                    />  
                  </td>
                  <td className="px-6 py-4">{new Date(deal.expiresAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 flex gap-x-4">
                    <Link
                      to={`/deals/edit/${deal.id}`}
                      state={deal}
                      data-tooltip-id="edit-deal-tooltip"
                      data-tooltip-content="Edit deal"
                    >
                      <SquarePen className="text-blue-600" />
                    </Link>
                    <button
                      className="font-medium text-red-600"
                      onClick={() => handleDeleteClick(deal)}
                      data-tooltip-id="delete-deal-tooltip"
                      data-tooltip-content="Delete deal"
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
        </>
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
          <p>Are you sure you want to delete {selectedDeal?.title}?</p>
        </Popup>
      )}

      {showDeleteManyPopup && (
        <Popup
          onClose={() => setShowDeleteManyPopup(false)}
          onConfirm={confirmDeleteMany}
          loading={deleteManyMutation.isPending}
          confirmText="Delete"
          loadingText="Deleting..."
          cancelText="Cancel"
          confirmButtonVariant="red"
        >
          <p>
            Are you sure you want to delete {selectedDeals.length} deal(s)?
          </p>
        </Popup>
      )}
    </div>
  );
};

export default Deals;
