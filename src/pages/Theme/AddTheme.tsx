import Spinner from "@/components/Spinner";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

type themeType = {
  primary: string | null;
  secondary: string | null;
  bg: string | null;
  restaurantId: string | null;
};
function AddTheme() {
  // const [name, setName] = useState<string | null>("");
  const [restaurantId, setRestaurantId] = useState<string | null>("");
  const [primary, setPrimary] = useState<string | null>("");
  const [secondary, setSecondary] = useState<string | null>("");
  const [bg, setBg] = useState<string | null>("");

  const {
    data: restaurants,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["restaurant"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:3000/restaurant");
      return response.data;
    },
  });

  const mutation = useMutation({
    mutationFn: (newTheme: themeType) => {
      return axios.post(`http://localhost:3000/theme`, newTheme);
    },
  });
  const handleSubmit = () => {
    const newTheme: themeType = {
      restaurantId,
      primary,
      secondary,
      bg,
    };
    mutation.mutate(newTheme);
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }
  if (isError) return <div>Error loading restaurants</div>;

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add Theme</h2>

      <form onSubmit={handleSubmit}>
        {/* Restaurant Select */}
        <div className="mb-4">
          <label
            htmlFor="restaurantId"
            className="block text-sm font-medium text-gray-700"
          >
            Restaurant
          </label>
          <select
            id="restaurantId"
            value={restaurantId || ""}
            onChange={(e) => setRestaurantId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          >
            <option value="" disabled>
              Select a restaurant
            </option>
            {restaurants && restaurants.items.length > 0 ? (
              restaurants.items.map((restaurant: any) => (
                <option key={restaurant.id} value={restaurant.id}>
                  {restaurant.name}
                </option>
              ))
            ) : (
              <option value="" disabled>
                No restaurants available
              </option>
            )}
          </select>
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

export default AddTheme;
