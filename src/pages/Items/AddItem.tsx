// AddItem.tsx
import { useState, FormEvent } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/axiosInstance";
import Spinner from "@/components/Spinner";
import { Progress } from "@/components/ui/progress";

function AddItem() {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number | null>(null);
  const [restaurantId, setRestaurantId] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [uploadImage, setUploadImage] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const navigate = useNavigate();

  // Fetch restaurants from the server
  const { data: restaurants, isLoading: isLoadingRestaurants } = useQuery({
    queryKey: ["restaurant"],
    queryFn: async () => {
      const response = await axiosInstance.get("/restaurant");
      return response.data;
    },
  });

  // Fetch categories based on selected restaurant
  const {
    data: categories,
    isLoading: isLoadingCategories,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: ["categories", restaurantId],
    queryFn: async () => {
      if (!restaurantId) return [];
      const response = await axiosInstance.get(
        `/category?restaurantId=${restaurantId}`
      );
      return response.data;
    },
    enabled: !!restaurantId,
  });

  // Mutation for submitting the form
  const mutation = useMutation({
    mutationFn: (newItem: FormData) => {
      return axiosInstance.post(`/item`, newItem, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (event) => {
          setProgress(Math.round((100 * event.loaded) / event.total));
        },
      });
    },
    onError: (e) => {
      console.log(e);
    },
    onSuccess: () => {
      navigate("/items");
    },
  });

  // Consolidated handleSubmit function using FormData
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", `${price}`);
    formData.append("categoryId", categoryId);
    if (uploadImage) {
      formData.append("file", uploadImage);
    }

    mutation.mutate(formData);
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
      <h2 className="text-2xl font-bold mb-6">Add Item</h2>
      <form onSubmit={handleSubmit}>
        {/* Item Name */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Item Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter item name"
            required
          />
        </div>

        {/* Item Price */}
        <div className="mb-4">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Item Price
          </label>
          <input
            type="number"
            id="price"
            value={price !== null ? price : ""}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter price"
            required
          />
        </div>

        {/* Description */}
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
            placeholder="Enter item description"
            required
          />
        </div>

        {/* Restaurant Select */}
        <div className="mb-4">
          <label htmlFor="restaurantId" className="block text-sm font-medium text-gray-700">
            Restaurant
          </label>
          <select
            id="restaurantId"
            value={restaurantId}
            onChange={(e) => {
              setRestaurantId(e.target.value);
              setCategoryId("");
              refetchCategories();
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          >
            <option value="" disabled>
              Select a restaurant
            </option>
            {restaurants?.items?.map((restaurant: any) => (
              <option key={restaurant.id} value={restaurant.id}>
                {restaurant.name}
              </option>
            ))}
          </select>
        </div>

        {/* Category Select */}
        <div className="mb-4">
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="categoryId"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
            disabled={!restaurantId || isLoadingCategories}
          >
            <option value="" disabled>
              {isLoadingCategories ? "Loading categories..." : "Select a category"}
            </option>
            {categories && categories.items.length > 0 ? (
              categories.items.map((category: any) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))
            ) : (
              <option value="" disabled>
                No categories available
              </option>
            )}
          </select>
        </div>

        {/* File Upload */}
        <div className="mb-4">
          <label htmlFor="upload-image" className="block text-sm font-medium text-gray-700">
            Upload Image
          </label>
          <input
            type="file"
            id="upload-image"
            onChange={(e) => {
              if (e.target.files) setUploadImage(e.target.files[0]);
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* Progress Bar */}
        { (
          <div>     <h1 className="text-lg text-black">
            {progress} 
            </h1>     <Progress value={70} max={100} className="mb-4 " />
      </div>
        )}


        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Item
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddItem;
