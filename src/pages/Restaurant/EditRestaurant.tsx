import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FormEvent, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import { ActionMeta, MultiValue } from "react-select";
import axiosInstance from "@/axiosInstance";
import Spinner from "@/components/Spinner";

type categoryType = {
  name: string;
  icon?: string | null;
};

type CategoryOption = {
  value: string;
  label: string;
};

type restaurantType = {
  name: string | null;
  description: string | null;
  accessCode: string | null;
  image: string | null;
  primary: string | null;
  secondary: string | null;
  bg: string | null;
  categories: categoryType[] | null;
};

function EditRestaurant() {
  const location = useLocation();
  const record = location.state;
  const { restaurantId } = useParams();
  const navigate = useNavigate();

  // State management
  const [name, setName] = useState<string | null>(record.name || "");
  const [description, setDescription] = useState<string | null>(
    record.description || ""
  );
  const [accessCode, setAccessCode] = useState<string | null>(
    record.accessCode || ""
  );
  const [uploadImage, setUploadImage] = useState<File | null>(null); // Initialize as null for file
  const [uploadImageUrl, setUploadImageUrl] = useState<string | null>(
    record.image
  );
  const [primary, setPrimary] = useState<string | null>(
    record?.theme?.primary || ""
  );
  const [secondary, setSecondary] = useState<string | null>(
    record?.theme?.secondary || ""
  );
  const [bg, setBg] = useState<string | null>(record?.theme?.bg || "");
  const [categoriesData, setCategoriesData] = useState<categoryType[]>(
    record?.categories || []
  );

  // Fetch categories
  const { data: categories, isLoading } = useQuery({
    queryKey: ["category"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:3000/category");
      return response.data;
    },
  });

  // Mutation for updating restaurant
  const mutation = useMutation({
    mutationFn: (formData: FormData) => {
      return axiosInstance.put(`/restaurant/${restaurantId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      navigate("/restaurants");
    },
  });

  const handleCategoryChange = (
    newValue: MultiValue<CategoryOption> | null,
    actionMeta: ActionMeta<CategoryOption>
  ) => {
    if (newValue) {
      const selectedCategories = (newValue as MultiValue<CategoryOption>).map(
        (option) => ({
          name: option.value,
          icon: null,
        })
      );
      setCategoriesData(selectedCategories);
    } else {
      setCategoriesData([]);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name || "");
    formData.append("description", description || "");
    formData.append("accessCode", accessCode || "");
    formData.append("primary", primary || "");
    formData.append("secondary", secondary || "");
    formData.append("bg", bg || "");
    if (uploadImage) {
      formData.append("image", uploadImage);
    }

    // Append categories as JSON string
    formData.append("categories", JSON.stringify(categoriesData));

    mutation.mutate(formData);
  };

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-md overflow-auto">
      <h2 className="text-2xl font-bold mb-6">Edit Restaurant</h2>

      <form onSubmit={handleSubmit}>
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
            onChange={handleCategoryChange}
            isMulti
            isClearable
            options={categories?.items?.map((category: any) => ({
              value: category.name,
              label: category.name,
            }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            defaultValue={categoriesData.map((cat) => ({
              value: cat.name,
              label: cat.name,
            }))}
          />
        </div>

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
              value={primary || "#000000"}
              onChange={(e) => setPrimary(e.target.value)}
              className="block h-10 bg-transparent rounded-md sm:text-sm"
            />
            <input
              type="text"
              id="primary"
              value={primary || ""}
              onChange={(e) => setPrimary(e.target.value)}
              className="block border-none h-10 bg-transparent rounded-md sm:text-sm"
              placeholder="Primary color"
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
              value={secondary || "#000000"}
              onChange={(e) => setSecondary(e.target.value)}
              className="block h-10 bg-transparent rounded-md sm:text-sm"
            />
            <input
              type="text"
              id="secondary"
              value={secondary || ""}
              onChange={(e) => setSecondary(e.target.value)}
              className="block border-none h-10 bg-transparent rounded-md sm:text-sm"
              placeholder="Secondary color"
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
              value={bg || "#000000"}
              onChange={(e) => setBg(e.target.value)}
              className="block h-10 bg-transparent rounded-md sm:text-sm"
            />
            <input
              type="text"
              id="bg"
              value={bg || ""}
              onChange={(e) => setBg(e.target.value)}
              className="block border-none h-10 bg-transparent rounded-md sm:text-sm"
              placeholder="Background color"
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

        {/* Upload Image */}
        <div className="mb-4">
          <label
            htmlFor="upload-image"
            className="block text-sm font-medium text-gray-700"
          >
            Upload Image
          </label>
          {uploadImageUrl ? (
            <div className="p-2">
              <img width={100} src={uploadImageUrl} alt="" />
            </div>
          ) : null}
          <input
            type="file"
            id="upload-image"
            onChange={(e) => {
              if (e.target.files) {
                setUploadImage(e.target.files[0]);
                setUploadImageUrl(URL.createObjectURL(e.target.files[0]));
              }
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 disabled:animate-pulse disabled:bg-indigo-300 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Saving... " : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditRestaurant;
