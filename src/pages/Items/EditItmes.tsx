import axiosInstance from "@/axiosInstance";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, FormEvent, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Spinner from "@/components/Spinner";

type itemType = {
  name: string | null;
  description: string | null;
  price: number | null;
  categoryId: string | null;
  image: string | null;
};

function EditItem() {
  const { data: record } = useQuery({
    queryKey: ["item"],
    queryFn: async () => {
      const response = await axiosInstance.get(`/item/${itemId}`);
      console.log(response);
      return response.data;
    },
  });
  const [name, setName] = useState<string | null>();
  const [description, setDescription] = useState<string | null>();
  const [price, setPrice] = useState<number | null>();
  const [restaurantId, setRestaurantId] = useState<string | null>();
  const [uploadImage, setUploadImage] = useState<File | null>(null); // Handle file uploads
  const [uploadImageUrl, setUploadImageUrl] = useState<string | null>();
  const [categoryId, setCategoryId] = useState<string | null>();

  const { itemId } = useParams();
  const navigate = useNavigate();

  // Use Effect to update state when record is fetched
  useEffect(() => {
    if (record) {
      setName(record.name);
      setDescription(record.description);
      setPrice(record.price);
      setRestaurantId(record.category.restaurantId);
      setCategoryId(record.categoryId);
      setUploadImageUrl(record.image);
    }
  }, [record]);

  // Fetch restaurants from the server
  const {
    data: restaurants,
    isLoading: isLoadingRestaurants,
    isError: isErrorRestaurants,
  } = useQuery({
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
      if (restaurantId) {
        const response = await axiosInstance.get(
          `/category?restaurantId=${restaurantId}`
        );
        return response.data;
      } else {
        const response = await axiosInstance.get(`/category`);
        return response.data;
      }
    },
    enabled: !!restaurantId,
  });

  const mutation = useMutation({
    mutationFn: (formData: FormData) => {
      return axiosInstance.put(`/item/${itemId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      navigate("/items");
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name || "");
    formData.append("description", description || "");
    formData.append("price", price?.toString() || "");
    formData.append("categoryId", categoryId || "");
    if (uploadImage) {
      formData.append("image", uploadImage);
    }

    mutation.mutate(formData);
  };

  if (isLoadingRestaurants) return;

  <div className="w-full h-screen flex items-center justify-center">
    <Spinner />
  </div>;

  if (isErrorRestaurants) return <div>Error loading restaurants</div>;

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Edit Item</h2>

      <form onSubmit={handleSubmit}>
        {/* Item Name */}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Item Name
          </label>
          <input
            type="text"
            id="name"
            value={name || ""}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter item name"
            required
          />
        </div>

        {/* Item Price */}
        <div className="mb-4">
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Item Price
          </label>
          <input
            type="number"
            id="price"
            value={price !== null ? price : ""}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter price"
            required
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
            placeholder="Enter item description"
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
            onChange={(e) => {
              setRestaurantId(e.target.value);
              setCategoryId(""); // Clear category when changing restaurant
              refetchCategories();
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          >
            <option value="" disabled>
              Select a restaurant
            </option>
            {restaurants.items.map((restaurant: any) => (
              <option key={restaurant.id} value={restaurant.id}>
                {restaurant.name}
              </option>
            ))}
          </select>
        </div>

        {/* Category Select */}
        <div className="mb-4">
          <label
            htmlFor="categoryId"
            className="block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <select
            id="categoryId"
            value={categoryId || ""}
            onChange={(e) => setCategoryId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
            disabled={!restaurantId || isLoadingCategories}
          >
            <option value="" disabled>
              {isLoadingCategories
                ? "Loading categories..."
                : "Select a category"}
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

        {/* Upload Image */}
        <div className="mb-4">
          <label
            htmlFor="upload-image"
            className="block text-sm font-medium text-gray-700"
          >
            Upload Image
          </label>
          {uploadImageUrl ? (
            <div className="p-2">
              <img width={100} src={uploadImageUrl} alt="" />
            </div>
          ) : null}
          <input
            type="file"
            id="upload-image"
            onChange={(e) => {
              if (e.target.files) {
                setUploadImage(e.target.files[0]);
                setUploadImageUrl(URL.createObjectURL(e.target.files[0]));
              }
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 disabled:animate-pulse disabled:bg-indigo-300 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Saving... " : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditItem;
