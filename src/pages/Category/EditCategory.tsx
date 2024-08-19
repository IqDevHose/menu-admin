import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

type categoryType = {
  name: string | null;
  restaurantId: string | null;
  icon?: string | null; // Use a base64 encoded string instead of a File
};

function EditCategory() {
  let [searchParams, setSearchParams] = useSearchParams();

  const [name, setName] = useState<string | null>(searchParams.get("name"));
  const [restaurantId, setRestaurantId] = useState<string | null>(
    searchParams.get("restaurantId")
  );
  const [uploadImage, setUploadImage] = useState<string | null>(null); // Base64 encoded string
  const { categoryId } = useParams();
  const navigate = useNavigate();

  // Fetch restaurants from the server
  const {
    data: restaurants,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["restaurant"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:3000/restaurant");
      return response.data;
    },
  });

  const mutation = useMutation({
    mutationFn: (newEdit: categoryType) => {
      return axios.put(`http://localhost:3000/category/${categoryId}`, newEdit);
    },
    onSuccess: () => {
      navigate("/category"); // Navigate back to the item list after successful addition
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newEdit: categoryType = {
      name,
      restaurantId,
      icon: uploadImage || null,
    };

    mutation.mutate(newEdit);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading restaurants</div>;

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Edit Category</h2>

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
            placeholder="Enter category name"
            required
          />
        </div>

        {/* Restaurant Select */}
        <div className="mb-4">
          <label
            htmlFor="restaurantId"
            className="block text-sm font-medium text-gray-700"
          >
            Restaurant
          </label>
          <select
            id="restaurantId"
            value={restaurantId || ""}
            onChange={(e) => setRestaurantId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          >
            <option value="" disabled>
              Select a restaurant
            </option>
            {restaurants && restaurants.length > 0 ? (
              restaurants.map((restaurant: any) => (
                <option key={restaurant.id} value={restaurant.id}>
                  {restaurant.name}
                </option>
              ))
            ) : (
              <option value="" disabled>
                No restaurants available
              </option>
            )}
          </select>
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

export default EditCategory;
