import React, { useState } from 'react';
import { Plus, Eye } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import Popup from '@/components/Popup';

const Offer = () => {
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  // Dummy data for offers
  const offers = [
    {
      id: 1,
      title: '50% Off Summer Sale',
      image: 'https://via.placeholder.com/150',
      description: 'Get 50% off on all summer items. Limited time offer!',
    },
    {
      id: 2,
      title: 'Buy One Get One Free',
      image: 'https://via.placeholder.com/150',
      description: 'Buy one item and get another one for free. Don\'t miss out!',
    },
    {
      id: 3,
      title: 'Free Shipping on Orders Over $100',
      image: 'https://via.placeholder.com/150',
      description: 'Enjoy free shipping when your order exceeds $100.',
    },
  ];

  const handleViewOffer = (offer) => {
    setSelectedOffer(offer);
    setShowPopup(true);
  };

  return (
    <div className="relative w-full p-6">
      <div className="flex items-center justify-between pb-4">
        <h1 className="text-2xl font-bold">Offers</h1>
        <button
          className="flex items-center bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900"
        >
          <Plus className="mr-2" />
          Add New Offer
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <div key={offer.id} className="bg-white border border-gray-200 rounded-lg shadow-lg">
            <img
              src={offer.image}
              alt={offer.title}
              className="w-full h-40 object-cover rounded-t-lg"
            />
            <div className="p-4">
              <h2 className="text-lg font-bold">{offer.title}</h2>
              <p className="text-sm text-gray-600 my-2">{offer.description}</p>
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => handleViewOffer(offer)}
                  className="text-white bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                >
                  <Eye className="mr-2" /> View
                </button>
                <span className="text-xs text-gray-500">Offer ID: {offer.id}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Popup for viewing offer details */}
      {showPopup && (
        <Popup
          onClose={() => setShowPopup(false)}
          confirmText="Close"
          showOneBtn={true}
          confirmButtonVariant="primary"
          onConfirm={() => setShowPopup(false)}
        >
          <div className="p-4">
            <h2 className="text-xl font-bold">{selectedOffer.title}</h2>
            <img
              src={selectedOffer.image}
              alt={selectedOffer.title}
              className="w-full h-60 object-cover my-4"
            />
            <p>{selectedOffer.description}</p>
            <p className="text-gray-500 text-sm mt-4">Offer ID: {selectedOffer.id}</p>
          </div>
        </Popup>
      )}
    </div>
  );
};

export default Offer;
