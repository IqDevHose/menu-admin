import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

type customerReviewType = {
  id: string;
  name: string;
  comment: string;
  email: string;
};

function EditCustomerReview() {
  const [searchParams] = useSearchParams();
  const [name, setName] = useState<string | null>(searchParams.get("name"));
  const [comment, setComment] = useState<string | null>(searchParams.get("comment"));
  const [email, setEmail] = useState<string | null>(searchParams.get("email"));
  const { id } = useParams();

  const mutation = useMutation({
    mutationFn: (updatedReview: customerReviewType) => {
      return axios.put(`http://localhost:3000/customer-review/${id}`, updatedReview);
    },
  });

  const handleSubmit = () => {
    mutation.mutate({ id: id as string, name: name as string, comment: comment as string, email: email as string });
  };

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Edit Customer Review</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name || ""}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter customer name"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
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

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email || ""}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter customer email"
          />
        </div>

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

export default EditCustomerReview;
