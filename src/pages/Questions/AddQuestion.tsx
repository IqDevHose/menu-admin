import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

type questionType = {
  title: string | null;
  enTitle: string | null;
  description: string | null;
  restaurantId: string | null;
  answer: string | null;
};

function AddQuestion() {
  const [description, setDescription] = useState<string | null>("");
  const [restaurantId, setrestaurantId] = useState<string | null>("");
  const [answer, setanswer] = useState<string | null>("");
  const [title, setTitle] = useState<string | null>("");
  const [enTitle, setEnTitle] = useState<string | null>("");
  
  const mutation = useMutation({
    mutationFn: (newQuestion: questionType) => {
      return axios.post(`http://localhost:3000/question`, newQuestion);
    },
  });
  const handleSubmit = () => {
    mutation.mutate({ title, enTitle, description, restaurantId, answer });
  };

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add Question</h2>

      <form onSubmit={handleSubmit}>
        {/* title */}
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
            placeholder="Enter Question description"
          />
        </div>

        {/* enTitle */}
        <div className="mb-4">
          <label
            htmlFor="entitle"
            className="block text-sm font-medium text-gray-700"
          >
            enTitle
          </label>
          <input
            type="text"
            id="EnTitle"
            value={enTitle || ""}
            onChange={(e) => setEnTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter entitle"
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

export default AddQuestion;
