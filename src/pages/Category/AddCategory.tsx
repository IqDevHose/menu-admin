import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useParams } from "react-router-dom";

type categoryType = {
  name: string | null;
  restaurantId: string | null;
};
function AddCategory() {
  const [name, setName] = useState<string | null>("");
  const [restaurantName, setRestaurantName] = useState<string | null>("");
  const [restaurantId, setRestaurantId] = useState<string | null>("");
  const [uploadImage, setUploadImage] = useState<string | null>("");
  const { categoryId } = useParams();
  const mutation = useMutation({
    mutationFn: (newEdit: categoryType) => {
      return axios.put(`http://localhost:3000/${categoryId}`, newEdit);
    },
  });
  const handleSubmit = () => {
    mutation.mutate({ name, restaurantId });
  };

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add Category</h2>

      <form onSubmit={handleSubmit}>
        {/* Category Name */}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Category Name
          </label>
          <input
            type="text"
            id="name"
            value={name || ""}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter restaurant name"
          />
        </div>

        {/* Restaurant Name */}
        <div className="mb-4">
          <label
            htmlFor="restaurantName"
            className="block text-sm font-medium text-gray-700"
          >
            Restaurant Name
          </label>
          <input
            type="text"
            id="restaurantName"
            value={restaurantName || ""}
            onChange={(e) => setRestaurantName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter restaurant name"
          />
        </div>

        {/* upload image */}
        <div className="mb-4">
          <label
            htmlFor="access-code"
            className="block text-sm font-medium text-gray-700 "
          >
            Upload image
          </label>
          <input
            type="file"
            id="upload-image"
            value={uploadImage || ""}
            onChange={(e) => setUploadImage(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Upload an image"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddCategory;
