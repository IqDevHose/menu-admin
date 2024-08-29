import axiosInstance from "@/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

type ratingType = {
  score: number | null;
  comment: string | null;
  name: string | null;
};

function EditRating() {
  const location = useLocation();
  const record = location.state;
  console.log(record);
  const [name, setName] = useState<string | null>(record.name);
  const [score, setScore] = useState<number | null>(record.score);
  const [comment, setComment] = useState<string | null>(record.comment);
  const { ratingId } = useParams();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (newEdit: ratingType) => {
      return axiosInstance.put(`/rating/${ratingId}`, newEdit);
    },
    onSuccess: () => {
      navigate("/ratings"); // Navigate back to the ratings list after successful addition
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ name, score, comment });
  };

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Edit Rating</h2>

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name || ""}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter name"
            required
          />
        </div>

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
            required
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
            required
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={mutation.isPending}
          >
             {mutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditRating;
