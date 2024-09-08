import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "@/axiosInstance";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "@/components/Spinner"; // Assuming you have a Spinner component for loading states

type questionType = {
  title: string | null;
  enTitle: string | null;
  description: string | null;
  restaurantId: string | null;
  answers: string; // Single answer as a string
};

function AddQuestion() {
  const [description, setDescription] = useState<string | null>("");
  const [restaurantId, setRestaurantId] = useState<string | null>("");
  const [answer, setAnswer] = useState<string >(""); // Single answer
  const [title, setTitle] = useState<string | null>("");
  const [enTitle, setEnTitle] = useState<string | null>("");
  const navigate = useNavigate();

  // Fetch restaurants from API
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
    mutationFn: (newQuestion: questionType) => {
      return axiosInstance.post(`/question`, newQuestion);
    },
    onSuccess: () => {
      navigate("/questions"); // Navigate to the questions route after successful addition
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload

    if (!title || !restaurantId ) {
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

        {/* Answer
        <div className="mb-4">
          <label
            htmlFor="answer"
            className="block text-sm font-medium text-gray-700"
          >
            Answer
          </label>
          <input
            type="text"
            id="answer"
            value={answer || ""}
            onChange={(e) => setAnswer(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter answer"
           
          />
        </div> */}

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
            {restaurants && restaurants.items.length > 0 ? (
              restaurants.items.map((restaurant: any) => (
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
