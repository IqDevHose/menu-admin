import { useState, FormEvent } from "react";
import { useMutation, useInfiniteQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/axiosInstance";
import Spinner from "@/components/Spinner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

function AddDeal() {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [discount, setDiscount] = useState<string>("");
  const [restaurantId, setRestaurantId] = useState<string>("");
  const [published, setPublished] = useState<boolean>(false);
  const [expiresAt, setExpiresAt] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const navigate = useNavigate();

  const {
    data: restaurants,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["restaurants"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axiosInstance.get(`/restaurant?page=${pageParam}`);
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.hasNextPage) return undefined;
      return lastPage.nextPage;
    },
    initialPageParam: 1,
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const dealData = {
      title,
      description,
      discount,
      restaurantId,
      published,
      expiresAt: new Date(expiresAt).toISOString(),
      image,
    };

    mutation.mutate(dealData);
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isError) return <div>Error loading restaurants</div>;

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
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Deal Image
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
          />
          {image && (
            <div className="mt-2">
              <img
                src={image}
                alt="Deal preview"
                className="w-32 h-32 object-cover rounded-md"
              />
            </div>
          )}
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
          <Select value={restaurantId} onValueChange={setRestaurantId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a restaurant" />
            </SelectTrigger>
            <SelectContent>
              {restaurants?.pages.map((page) =>
                page.items.map((restaurant: any) => (
                  <SelectItem key={restaurant.id} value={restaurant.id}>
                    {restaurant.name}
                  </SelectItem>
                ))
              )}
              {hasNextPage && (
                <Button
                  className="w-full text-center text-gray-600"
                  onClick={(e) => {
                    e.preventDefault();
                    fetchNextPage();
                  }}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? "Loading..." : "Load More"}
                </Button>
              )}
            </SelectContent>
          </Select>
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
            className="px-4 py-2 bg-indigo-600 disabled:animate-pulse disabled:bg-indigo-300 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
