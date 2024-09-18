import { useState } from 'react';
import { Plus, Eye, RotateCw, Trash2, SquarePen } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Popup from '@/components/Popup';
import Spinner from '@/components/Spinner';
import Pagination from '@/components/Pagination';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

const Offer = () => {
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Set the number of items per page
  const queryClient = useQueryClient();

  // Dummy data for offers
  const offers = [
    {
      id: 1,
      title: '50% Off Summer Sale',
      image: 'https://plus.unsplash.com/premium_photo-1670509045675-af9f249b1bbe?q=80&w=2035&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      description: 'Get 50% off on all summer items. Limited time offer!',
    },
    {
      id: 2,
      title: 'Buy One Get One Free',
      image: 'https://plus.unsplash.com/premium_photo-1670509045675-af9f249b1bbe?q=80&w=2035&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      description: 'Buy one item and get another one for free. Don\'t miss out!',
    },
    {
      id: 3,
      title: 'Free Shipping on Orders Over $100',
      image: 'https://plus.unsplash.com/premium_photo-1670509045675-af9f249b1bbe?q=80&w=2035&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      description: 'Enjoy free shipping when your order exceeds $100.',
    },
  ];

  // Simulate fetching offers with search and pagination
  const filteredOffers = offers.filter(offer =>
    offer.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredOffers.length / itemsPerPage);
  const currentData = filteredOffers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleReload = async () => {
    // Trigger a reload of the data
    await queryClient.invalidateQueries({ queryKey: ['offers'] });
  };

  const handleViewOffer = (offer) => {
    setSelectedOffer(offer);
    setShowPopup(true);
  };

  const handleDeleteClick = (offer) => {
    setSelectedOffer(offer);
    setShowPopup(true); // Show confirmation popup
  };

  const confirmDelete = () => {
    // Logic for deleting the selected offer
    console.log(`Deleted offer: ${selectedOffer.title}`);
    setSelectedOffer(null);
    setShowPopup(false);
  };

  return (
    <div className="relative w-full p-2">
      {/* Tooltip initialization */}
      <ReactTooltip id="reload-tooltip" place="top" />
      <ReactTooltip id="add-offer-tooltip" place="top" />
      <ReactTooltip id="trash-tooltip" place="top" />

      <div className="flex items-center justify-between pb-12">
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
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
            className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search for offers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-x-2">
          <button
            type="button"
            className="text-white w-10 h-10 xl:w-auto bg-gray-800 hover:bg-gray-900 font-medium rounded-lg py-2.5 px-3"
            onClick={handleReload}
            data-tooltip-id="reload-tooltip"
            data-tooltip-content="Reload offers"
          >
            <span className="hidden xl:flex items-center gap-1">
              <RotateCw size={16} /> Reload
            </span>
            <span className="inline xl:hidden">
              <RotateCw size={16} />
            </span>
          </button>

          <Button
            variant="default"
            className="flex items-center"
            data-tooltip-id="add-offer-tooltip"
            data-tooltip-content="Add new offer"
          >
            <Plus className="mr-2" />
            Add New Offer
          </Button>

          <Button
            variant="default"
            className="flex items-center bg-gray-800 hover:bg-gray-900 text-white"
            data-tooltip-id="trash-tooltip"
            data-tooltip-content="View trashed offers"
            onClick={() => {
              // Navigate or trigger logic to show trashed offers
              console.log("Navigate to trash view");
            }}
          >
            <Trash2 className="mr-2" />
            Trash
          </Button>
        </div>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentData.map((offer) => (
          <Card
            key={offer.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
          >
            <AspectRatio ratio={16 / 9}>
              <img
                src={offer.image}
                alt={offer.title}
                className="object-cover w-full h-full rounded-t-lg"
              />
            </AspectRatio>
            <CardHeader className="p-4">
              <CardTitle className="text-lg truncate">{offer.title}</CardTitle>
              <CardDescription className="truncate">{offer.description}</CardDescription>
            </CardHeader>
            <Separator />
            <CardFooter className="flex justify-between p-3 items-center">
              <span className="text-xs text-gray-500">Offer ID: {offer.id}</span>
              <div className="flex gap-4">
                <Eye className="text-gray-500 cursor-pointer" onClick={() => handleViewOffer(offer)} />
                <SquarePen className="text-blue-500 cursor-pointer" />
                <Trash2 className="text-red-500 cursor-pointer" onClick={() => handleDeleteClick(offer)} />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-10">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Popup for viewing offer details */}
      {showPopup && (
        <Popup
          onClose={() => setShowPopup(false)}
          onConfirm={confirmDelete}
          confirmText="Delete"
          cancelText="Cancel"
          confirmButtonVariant="red"
        >
          <div className="p-4">
            <h2 className="text-xl font-bold">Are you sure you want to delete this offer?</h2>
            <p className="text-gray-500 text-sm mt-4">Offer: {selectedOffer?.title}</p>
            <p className="text-gray-500 text-sm">Offer ID: {selectedOffer?.id}</p>
          </div>
        </Popup>
      )}
    </div>
  );
};

export default Offer;
