import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { SquarePen, Trash2 } from 'lucide-react';
import Popup from '@/components/popup';


const Item = () => {
  const [showPopup, setShowPopup] = useState(false); // State to manage popup visibility
  const [selectedItem, setSelectedItem] = useState(null); // State to manage selected item for deletion
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['item'],
    queryFn: async () => {
      const item = await axios.get("http://localhost:3000/item");
      return item.data;
    }
  });

  const mutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`http://localhost:3000/item/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['item'] });
      setShowPopup(false); // Close the popup after successful deletion
    }
  });

  const handleDeleteClick = (item: any) => {
    setSelectedItem(item);
    setShowPopup(true);
  };

  const confirmDelete = () => {
    if (selectedItem) {
      mutation.mutate(selectedItem.id);
    }
  };

  if (query.isLoading) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error</div>;
  }

  return (
    <div className="relative overflow-x-auto sm:rounded-lg w-full m-14">
      <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
        <label htmlFor="table-search" className="sr-only">Search</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-500 " aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>
          </div>
          <input type="text" id="table-search" className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Search for items" />
        </div>
        <button type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg  py-2.5  mb-2 px-5">Add Item</button>

      </div>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
          <tr>
            <th scope="col" className="px-6 py-3 w-4 ">
              #
            </th>
            <th scope="col" className="px-6 py-3 w-4 ">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Description
            </th>
            <th scope="col" className="px-6 py-3">
              Price
            </th>
            <th scope="col" className="px-6 py-3">
              Category name
            </th>
            <th scope="col" className="px-6 py-3">
            </th>
          </tr>
        </thead>
        <tbody>
          {query.data?.map((item, index) => (
            <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
              <td className="px-6 py-4">
                {index + 1}
              </td>
              <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                {item?.name}
              </td>
              <td className="px-6 py-4">
                {item?.description}
              </td>
              <td className="px-6 py-4">
                {item?.price}
              </td>
              <td className="px-6 py-4">
                {item?.categoryName}
              </td>
              <td className="px-6 py-4 flex gap-x-4">
                <button className="font-medium text-blue-600">
                  <SquarePen />
                </button>
                <button className="font-medium text-red-600" onClick={() => handleDeleteClick(item)}>
                  <Trash2 />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showPopup && (
        <Popup
          onClose={() => setShowPopup(false)}
          onConfirm={confirmDelete}
          loading={mutation.isLoading}
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
