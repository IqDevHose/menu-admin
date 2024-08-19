import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type restaurantType = {
  name: string | null;
  description: string | null;
  accessCode: string | null;
  image: string | null;
};
function AddRestaurant() {
  const [name, setName] = useState<string | null>("");
  const [description, setDescription] = useState<string | null>("");
  const [accessCode, setAccessCode] = useState<string | null>("");
  const [uploadImage, setUploadImage] = useState<string | null>();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (newRest: restaurantType) => {
      return axios.post(`http://localhost:3000/restaurant`, newRest);
    },
    onSuccess: () => {
      navigate("/restaurant");
    },
  });
  const handleSubmit = () => {
    mutation.mutate({ name, description, accessCode, image: null });
  };

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add Restaurant</h2>

      <form onSubmit={handleSubmit}>
        {/* Restaurant Name */}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Restaurant Name
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

        {/* Description */}
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description || ""}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter restaurant description"
          />
        </div>

        {/* Access Code */}
        <div className="mb-4">
          <label
            htmlFor="access-code"
            className="block text-sm font-medium text-gray-700"
          >
            Access Code
          </label>
          <input
            type="text"
            id="access-code"
            value={accessCode || ""}
            onChange={(e) => setAccessCode(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter access code"
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

export default AddRestaurant;
