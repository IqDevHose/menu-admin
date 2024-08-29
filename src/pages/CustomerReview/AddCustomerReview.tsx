import { useState } from "react";
import { Query, useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/axiosInstance";
import Spinner from "@/components/Spinner";

type CustomerReviewType = {
  name: string;
  comment: string;
  email: string;
  birthday: string;
  phone: string;
  restaurantId: string;
};

function AddCustomerReview() {
  const [restaurantId, setRestaurantId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [birthday, setBirthday] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  const navigate = useNavigate();

  const {
    data: restaurantData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["restaurant"],
    queryFn: async () => {
      const response = await axiosInstance.get("/restaurant");
      return response.data;
    },
  });

  const mutation = useMutation({
    mutationFn: (newReview: CustomerReviewType) => {
      console.log(newReview);
      return axiosInstance.post(`/customer-review`, newReview);
    },
    onSuccess: () => {
      navigate("/customerReviews"); // Navigate back to the customer reviews list after successful addition
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (restaurantId) {
      const newReview = { name, comment, email, birthday, phone, restaurantId };
      console.log("Submitting review:", newReview); // Log the data being sent
      mutation.mutate(newReview);
    } else {
      alert("Please select a restaurant");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div>Error loading restaurants. Please try again later.</div>;
  }

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add Customer Review</h2>

      <form onSubmit={handleSubmit}>
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
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter customer name"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700"
          >
            Comment
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter comment"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter customer email"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="birthday"
            className="block text-sm font-medium text-gray-700"
          >
            Birthday
          </label>
          <input
            type="date"
            id="birthday"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter customer phone"
            required
          />
        </div>

        {/* Select to restaurants */}
        <div className="mb-4">
          <label
            htmlFor="restaurant"
            className="block text-sm font-medium text-gray-700"
          >
            Restaurant
          </label>
          <select
            id="restaurant"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            onChange={(e) => setRestaurantId(e.target.value)}
            required
            value={restaurantId}
          >
            <option value="">Select a restaurant</option>
            {restaurantData?.items.map((restaurant: any) => (
              <option key={restaurant.id} value={restaurant.id}>
                {restaurant.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Review
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddCustomerReview;
