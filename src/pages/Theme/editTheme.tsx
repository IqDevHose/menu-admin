import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom';

type themeType = {
  name: string | null;
  primary: string | null;
  secondary: string | null;
  bg: string | null;
};
function EditTheme() {

  let [searchParams, setSearchParams] = useSearchParams();
  const { themeId } = useParams();
  const [name, setName] = useState<string | null>(searchParams.get("name"));
  const [primary, setPrimary] = useState<string | null>(searchParams.get("primary"));
  const [secondary, setSecondary] = useState<string | null>(searchParams.get("secondary"));
  const [bg, setBg] = useState<string | null>(searchParams.get("bg"));
  const mutation = useMutation({
    mutationFn: (newEdit: themeType) => {
      return axios.put(`http://localhost:3000/theme/${themeId}`, newEdit);
    },
  });
  const handleSubmit = () => {
    mutation.mutate({ name, primary, secondary, bg });
  };
  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Edit Theme</h2>

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

        {/* Primary Color */}
        <div className="mb-4">
          <label
            htmlFor="primary"
            className="block text-sm font-medium text-gray-700"
          >
            Primary Color
          </label>
          <input
            type="text"
            id="primary"
            value={primary || ""}
            onChange={(e) => setPrimary(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter primary color"
          />
        </div>

        {/* Secondary Color */}
        <div className="mb-4">
          <label
            htmlFor="secondary"
            className="block text-sm font-medium text-gray-700"
          >
            Secondary Color
          </label>
          <input
            type="text"
            id="secondary"
            value={secondary || ""}
            onChange={(e) => setSecondary(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter secondary color"
          />
        </div>

        {/* Background Color */}
        <div className="mb-4">
          <label
            htmlFor="bg"
            className="block text-sm font-medium text-gray-700"
          >
            Background Color
          </label>
          <input
            type="text"
            id="bg"
            value={bg || ""}
            onChange={(e) => setBg(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter background color"
          />
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
  )
}

export default EditTheme