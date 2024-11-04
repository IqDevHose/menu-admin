import axiosInstance from "@/axiosInstance";
import Spinner from "@/components/Spinner";
import { Progress } from "@/components/ui/progress";
import { toBase64 } from "@/utils/imageUtils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ActionMeta, MultiValue, SingleValue } from "react-select";
import CreatableSelect from "react-select/creatable";

type CategoryOption = {
  value: string;
  label: string;
};

type categoryType = {
  name: string;
  icon?: string | null;
};

type restaurantType = {
  name: string | null;
  icon: string | null;
  categories: categoryType[] | null;
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
  const [uploadImage, setUploadImage] = useState<File | null>(null);
  const [primary, setPrimary] = useState<string | null>("");
  const [secondary, setSecondary] = useState<string | null>("");
  const [categoriesData, setCategoriesData] = useState<categoryType[]>([]);
  const [uploadImageUrl, setUploadImageUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [bg, setBg] = useState<string | null>("");
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const navigate = useNavigate();

  const { data: categories, isLoading } = useQuery({
    queryKey: ["category"],
    queryFn: async () => {
      const response = await axiosInstance.get("/category");
      return response.data;
    },
  });

  const mutation = useMutation({
    mutationFn: (newRest: any) => {
      return axiosInstance.post(`/restaurant`, newRest);
    },
    onError: (e) => {
      console.log(e);
    },
    onSuccess: () => {
      navigate("/restaurants");
    },
  });

  const handleChange = (
    newValue: MultiValue<CategoryOption> | SingleValue<CategoryOption> | null,
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

    const restaurantData = {
      name: name?.trim() || "",
      description: description?.trim() || "",
      accessCode: accessCode?.trim() || "",
      primary,
      secondary,
      bg,
      image: base64Image,
      categories: JSON.stringify(categoriesData),
    };

    mutation.mutate(restaurantData);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadImage(file);
      setUploadImageUrl(URL.createObjectURL(file));
      const base64 = await toBase64(file);
      setBase64Image(base64 as string);
    }
  };

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-md overflow-auto">
      <h2 className="text-2xl font-bold mb-6">Add Restaurant</h2>

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
          {!isLoading && (
            <CreatableSelect
              onChange={handleChange}
              isMulti
              isClearable
              options={categories?.items?.map((category: any) => ({
                value: category.name,
                label: category.name,
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          )}
        </div>

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

        {/* Upload Image */}
        <div className="mb-4">
          <div className="flex gap-4 flex-wrap items-center">
            <label
              htmlFor="upload-image"
              className="block text-sm font-medium text-gray-700"
            >
              Upload image
            </label>
            {progress > 0 && name && uploadImage && (
              <div className="flex items-center gap-1">
                <h1 className="text-gray-400 ">{progress}</h1>
                <Progress value={progress} max={100} className="h-2 w-24 " />
              </div>
            )}
          </div>
          {uploadImageUrl ? (
            <div className="p-4">
              <img width={100} src={uploadImageUrl} alt="" />
            </div>
          ) : null}
          <input
            type="file"
            id="upload-image"
            onChange={handleFileChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 disabled:animate-pulse disabled:bg-indigo-300 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Adding..." : "Add Restaurant"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddRestaurant;
