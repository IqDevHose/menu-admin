import { useMutation, useInfiniteQuery } from "@tanstack/react-query";
import axiosInstance from "@/axiosInstance";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "@/components/Spinner"; // Assuming you have a Spinner component for loading states
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type questionType = {
  title: string | null;
  enTitle: string | null;
  description: string | null;
  restaurantId: string | null;
  answers: string; // Single answer as a string
};

function AddQuestion() {
  const [description, setDescription] = useState<string | null>("");
  const [restaurantId, setRestaurantId] = useState<string>("default");
  const [answer, setAnswer] = useState<string >(""); // Single answer
  const [title, setTitle] = useState<string | null>("");
  const [enTitle, setEnTitle] = useState<string | null>("");
  const navigate = useNavigate();

  // Fetch restaurants from API
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
    mutationFn: (newQuestion: questionType) => {
      return axiosInstance.post(`/question`, newQuestion);
    },
    onSuccess: () => {
      navigate("/questions"); // Navigate to the questions route after successful addition
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload

    if (!title || restaurantId === "default") {
      alert("Please fill in all required fields.");
      return;
    }

    mutation.mutate({
      title,
      enTitle,
      description,
      restaurantId,
      answers: answer,
    });
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner /> {/* Loading spinner while restaurants are being fetched */}
      </div>
    );
  }

  if (isError) return <div>Error loading restaurants</div>;

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add Question</h2>

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title || ""}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter title"
            required
          />
        </div>

        {/* English Title */}
        <div className="mb-4">
          <label
            htmlFor="entitle"
            className="block text-sm font-medium text-gray-700"
          >
            English Title
          </label>
          <input
            type="text"
            id="EnTitle"
            value={enTitle || ""}
            onChange={(e) => setEnTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter English title"
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
            placeholder="Enter question description"
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
          <Select value={restaurantId} onValueChange={setRestaurantId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a restaurant" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default" disabled>
                Select a restaurant
              </SelectItem>
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

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 disabled:animate-pulse disabled:bg-indigo-300 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Adding..." : "Add Question"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddQuestion;
