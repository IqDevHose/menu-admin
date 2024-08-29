import axiosInstance from "@/axiosInstance";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

type customerReviewType = {
  id: string | null;
  name: string | null;
  comment: string | null;
  email: string | null;
  phone: string | null;
  birthday: string | null;
  resturantId: string | null;
};

function EditCustomerReview() {
  const location = useLocation();
  const record = location.state;
  console.log(record);

  const [name, setName] = useState<string | null>(record.name || null);
  const [comment, setComment] = useState<string | null>(record.comment);
  const [email, setEmail] = useState<string | null>(record.email);
  const [phone, setPhone] = useState<string | null>(record.phone);
  const [birthday, setBirthday] = useState<string | null>(
    record.birthday
      ? new Date(record.birthday).toISOString().split("T")[0]
      : null
  );
  const { customerReviewId } = useParams();
  const navigate = useNavigate();

  const query = useQuery({
    queryKey: ["customerReview"],
    queryFn: async () => {
      const customerReview = await axiosInstance.get(
        `/customer-review/${customerReviewId}`
      );
      console.log(customerReview.data);
      return customerReview.data;
    },
  });

  const mutation = useMutation({
    mutationFn: (updatedReview: customerReviewType) => {
      return axiosInstance.put(
        `/customer-review/${customerReviewId}`,
        updatedReview
      );
    },
    onSuccess: () => {
      navigate("/customerReviews"); // Navigate back to the item list after successful update
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      id: customerReviewId as string,
      name: name,
      comment: comment,
      email: email,
      phone: phone,
      birthday: birthday, // Use birthday as a string in yyyy-MM-dd format
      resturantId: query.data.resturant.id,
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
          <label
            htmlFor="restaurant"
            className="block text-sm font-medium text-gray-700"
          >
            Restaurant
          </label>
          <input
            type="text"
            id="restaurant"
            disabled
            value={query?.data?.resturant?.name || ""}
            className="mt-1 block w-full rounded-md text-gray-400 bg-gray-50 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
            placeholder={query?.data?.resturant?.name || ""}
          />
        </div>

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

export default EditCustomerReview;
