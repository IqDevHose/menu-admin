import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function AddItem() {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number | null>(null);
  const [categoryId, setCategoryId] = useState<string>(""); // Ensure this is populated
  const [uploadImage, setUploadImage] = useState<File | null>(null);
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (newItem: FormData) => {
      console.log("Data being sent to API:", Array.from(newItem.entries())); // Debugging: log the FormData entries
      return await axios.post(`http://localhost:3000/item`, newItem);
    },
    onSuccess: () => {
      navigate("/item"); // Navigate back to the item list after successful addition
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description || "");
    formData.append("price", price?.toString() || "0");
    formData.append("categoryId", categoryId);

    if (uploadImage) {
      formData.append("image", uploadImage);
    }

    // Log the data before submitting to check if it's correctly populated
    console.log("Form data before sending:", {
      name,
      description,
      price,
      categoryId,
      uploadImage,
    });

    mutation.mutate(formData);
  };

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add Item</h2>
      <form onSubmit={handleSubmit}>
        {/* Item Name */}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Item Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter item name"
            required
          />
        </div>

        {/* Item Price */}
        <div className="mb-4">
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Item Price
          </label>
          <input
            type="number"
            id="price"
            value={price !== null ? price : ""}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter price"
            required
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter item description"
            required
          />
        </div>

        {/* Category ID */}
        <div className="mb-4">
          <label
            htmlFor="categoryId"
            className="block text-sm font-medium text-gray-700"
          >
            Category ID
          </label>
          <input
            type="text"
            id="categoryId"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)} // Bind the value to state
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter category ID"
            required
          />
        </div>

        {/* Upload Image */}
        <div className="mb-4">
          <label
            htmlFor="upload-image"
            className="block text-sm font-medium text-gray-700"
          >
            Upload Image
          </label>
          <input
            type="file"
            id="upload-image"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setUploadImage(e.target.files[0]);
              }
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Item
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddItem;
