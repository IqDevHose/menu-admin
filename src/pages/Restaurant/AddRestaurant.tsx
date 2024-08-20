import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
type restaurantType = {
  name: string | null;
  icon: string | null;
  categories: string[] | null;
  description: string | null;
  accessCode: string | null;
  primary: string | null;
  secondary: string | null;
  bg: string | null;
  image: string | null;
};
function AddRestaurant() {
  const [name, setName] = useState<string | null>("");
  const [description, setDescription] = useState<string | null>("");
  const [accessCode, setAccessCode] = useState<string | null>("");
  const [uploadImage, setUploadImage] = useState<string | null>();
  const [primary, setPrimary] = useState<string | null>("");
  const [secondary, setSecondary] = useState<string | null>("");
  const [bg, setBg] = useState<string | null>("");
  const navigate = useNavigate();

  const { data: categories } = useQuery({
    queryKey: ["category"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:3000/category");
      return response.data;
    },
  });
  const mutation = useMutation({
    mutationFn: (newRest: restaurantType) => {
      return axios.post(`http://localhost:3000/restaurant`, newRest);
    },
    onSuccess: () => {
      navigate("/restaurant"); // Navigate back to the item list after successful addition
    },
  });
  const handleSubmit = () => {
    mutation.mutate({
      name,
      categories,
      icon: null,
      description,
      accessCode,
      image: null,
      primary,
      secondary,
      bg,
    });
  };

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add Restaurant</h2>

      <form>
        {/* Restaurant Name */}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Restaurant Name
          </label>
          <input
            type="text"
            id="name"
            value={name || ""}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter restaurant name"
          />
        </div>

        {/* Category Select */}
        <div className="mb-4">
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Category Name
          </label>
          <CreatableSelect
            isMulti
            isClearable
            options={categories?.items?.map((category: any) => ({
              value: category.name,
              label: category.name,
            }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          ></CreatableSelect>
        </div>

        {/* Category Name */}
        {/* <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Category Name
          </label>
          <input
            type="text"
            id="name"
            value={category || ""}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter restaurant name"
          />
        </div> */}

        {/* Primary Color */}
        <div className="mb-4">
          <label
            htmlFor="primary"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Primary Color
          </label>
          <div className="flex items-center gap-2 rounded-md border w-fit p-2 justify-center">
            <input
              type="color"
              id="primary"
              value={primary || ""}
              onChange={(e) => setPrimary(e.target.value)}
              className={` block  h-10 bg-transparent rounded-md sm:text-sm`}
              placeholder="Enter primary color"
            />
            <input
              type="text"
              id="primary"
              value={primary || ""}
              onChange={(e) => setPrimary(e.target.value)}
              className={` block border-none  h-10 bg-transparent rounded-md sm:text-sm`}
              placeholder="Enter primary color"
            />
          </div>
        </div>

        {/* Secondary Color */}
        <div className="mb-4">
          <label
            htmlFor="secondary"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Secondary Color
          </label>
          <div className="flex items-center gap-2 rounded-md border w-fit p-2 justify-center">
            <input
              type="color"
              id="secondary"
              value={secondary || ""}
              onChange={(e) => setSecondary(e.target.value)}
              className={` block  h-10 bg-transparent rounded-md sm:text-sm`}
              placeholder="Enter secondary color"
            />
            <input
              type="text"
              id="secondary"
              value={secondary || ""}
              onChange={(e) => setSecondary(e.target.value)}
              className={` block border-none  h-10 bg-transparent rounded-md sm:text-sm`}
              placeholder="Enter secondary color"
            />
          </div>
        </div>

        {/* Background Color */}
        <div className="mb-4">
          <label
            htmlFor="bg"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Background Color
          </label>
          <div className="flex items-center gap-2 rounded-md border w-fit p-2 justify-center">
            <input
              type="color"
              id="bg"
              value={bg || ""}
              onChange={(e) => setBg(e.target.value)}
              className={` block border-none  h-10 bg-transparent rounded-md sm:text-sm`}
              placeholder="Enter background color"
            />
            <input
              type="text"
              id="bg"
              value={bg || ""}
              onChange={(e) => setBg(e.target.value)}
              className={` block border-none  h-10 bg-transparent rounded-md sm:text-sm`}
              placeholder="Enter background color"
            />
          </div>
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
            placeholder="Enter restaurant description"
          />
        </div>

        {/* Access Code */}
        <div className="mb-4">
          <label
            htmlFor="access-code"
            className="block text-sm font-medium text-gray-700"
          >
            Access Code
          </label>
          <input
            type="text"
            id="access-code"
            value={accessCode || ""}
            onChange={(e) => setAccessCode(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter access code"
          />
        </div>

        {/* upload image */}
        <div className="mb-4">
          <label
            htmlFor="access-code"
            className="block text-sm font-medium text-gray-700 "
          >
            Upload image
          </label>
          <input
            type="file"
            id="upload-image"
            value={uploadImage || ""}
            onChange={(e) => setUploadImage(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Upload an image"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            onSubmit={handleSubmit}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddRestaurant;
