import { useState, FormEvent } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/axiosInstance";
import Spinner from "@/components/Spinner";

function AddDeal() {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [discount, setDiscount] = useState<string>("");
  const [restaurantId, setRestaurantId] = useState<string>("");
  const [published, setPublished] = useState<boolean>(false);
  const [expiresAt, setExpiresAt] = useState<string>("");
  const navigate = useNavigate();

  const { data: restaurants, isPending: isLoadingRestaurants } = useQuery({
    queryKey: ["restaurants"],
    queryFn: async () => {
      const response = await axiosInstance.get("/restaurant");
      return response.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (newDeal: any) => {
      const response = await axiosInstance.post(`/deal`, newDeal);
      return response.data;
    },
    onSuccess: (data: any) => {
        console.log("Deal added successfully", data);
      navigate("/deals");
    },
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const dealData = {
      title,
      description,
      discount,
      restaurantId,
      published,
      expiresAt: new Date(expiresAt).toISOString(),
    };

    mutation.mutate(dealData);
  };

  if (isLoadingRestaurants) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add Deal</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Deal Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter deal title"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter deal description"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="discount" className="block text-sm font-medium text-gray-700">
            Discount
          </label>
          <input
            type="text"
            id="discount"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter discount"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="restaurantId" className="block text-sm font-medium text-gray-700">
            Restaurant
          </label>
          <select
            id="restaurantId"
            value={restaurantId}
            onChange={(e) => setRestaurantId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          >
            <option value="" disabled>Select a restaurant</option>
            {restaurants?.items?.map((restaurant: any) => (
              <option key={restaurant.id} value={restaurant.id}>
                {restaurant.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="published" className="block text-sm font-medium text-gray-700">
            Published
          </label>
          <input
            type="checkbox"
            id="published"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="mt-1 rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-700">
            Expires At
          </label>
          <input
            type="datetime-local"
            id="expiresAt"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Adding... " : "Add Deal"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddDeal;
