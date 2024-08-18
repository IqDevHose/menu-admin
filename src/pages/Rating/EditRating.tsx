import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

type ratingType = {
  score: number | null;
  comment: string | null;
};

function EditRating() {
  let [searchParams, setSearchParams] = useSearchParams();
  const [score, setScore] = useState<number | null>(
    searchParams.get("score") ? parseInt(searchParams.get("score") as string) : null
  );
  const [comment, setComment] = useState<string | null>(
    searchParams.get("comment")
  );
  const { ratingId } = useParams();
  const mutation = useMutation({
    mutationFn: (newEdit: ratingType) => {
      return axios.put(`http://localhost:3000/ratings/${ratingId}`, newEdit);
    },
  });
  const handleSubmit = () => {
    mutation.mutate({ score, comment });
  };

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Edit Rating</h2>

      <form onSubmit={handleSubmit}>
        {/* Rating Score */}
        <div className="mb-4">
          <label
            htmlFor="score"
            className="block text-sm font-medium text-gray-700"
          >
            Rating Score
          </label>
          <input
            type="number"
            id="score"
            value={score || ""}
            onChange={(e) => setScore(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter rating score"
            min="1"
            max="5"
          />
        </div>

        {/* Comment */}
        <div className="mb-4">
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700"
          >
            Comment
          </label>
          <textarea
            id="comment"
            value={comment || ""}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter comment"
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

export default EditRating;
