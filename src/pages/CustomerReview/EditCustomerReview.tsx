import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";

type customerReviewType = {
  id: string;
  name: string;
  comment: string;
  email: string;
  phone: string;
  birthday: string;
  resturantId: string;
};

function EditCustomerReview() {
  const location = useLocation();
  const record = location.state;
  console.log(record);
  const [name, setName] = useState<string | null>(record.name);
  const [comment, setComment] = useState<string | null>(record.comment);
  const [email, setEmail] = useState<string | null>(record.email);
  const [phone, setPhone] = useState<string | null>(record.phone);
  const [birthday, setBirthday] = useState<string | null>(record.birthday);
  const { customerReviewId } = useParams();
  const navigate = useNavigate();

  const query = useQuery({
    queryKey: ["customerReview"],
    queryFn: async () => {
      const customerReview = await axios.get(
        `http://localhost:3000/customer-review/${customerReviewId}`
      );
      console.log(customerReview.data);
      return customerReview.data;
    },
  });

  const mutation = useMutation({
    mutationFn: (updatedReview: customerReviewType) => {
      return axios.put(
        `http://localhost:3000/customer-review/${customerReviewId}`,
        updatedReview
      );
    },
    onSuccess: () => {
      navigate("/customerReview"); // Navigate back to the item list after successful addition
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      id: customerReviewId as string,
      name: name as string,
      comment: comment as string,
      email: email as string,
      phone: phone as string,
      birthday: birthday as string,
      resturantId: query.data.resturant.id
    });
  };

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Edit Customer Review</h2>

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
            value={name || ""}
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
            value={comment || ""}
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
            value={email || ""}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter customer email"
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
            type="text"
            id="phone"
            value={phone || ""}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter customer phone"
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
            value={birthday || ""}
            onChange={(e) => setBirthday(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="restaurant" className="block text-sm font-medium text-gray-700">
            restaurant
          </label>
          <input
            type="text"
            id="restaurant"
            disabled
            value={query?.data?.resturant?.name}
            className="mt-1 block w-full rounded-md text-gray-400 bg-gray-50 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
            placeholder={query?.data?.resturant?.name}
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
