import React, { useState } from 'react';
import Papa from 'papaparse';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/axiosInstance';

type Props = {}

interface RestaurantItem {
  accessCode: string;
  createdAt: string;
  deleted: boolean;
  description: string;
  id: string;
  image: string | null;
  name: string;
  updatedAt: string;
  primary?: string; // Add optional fields for theme creation
  secondary?: string;
  bg?: string;
}

// Utility function to flatten the JSON object
const flattenObject = (obj: Record<string, any>, parent = '', res: Record<string, any> = {}): Record<string, any> => {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const propName = parent ? `${parent}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        flattenObject(obj[key], propName, res);
      } else {
        res[propName] = obj[key];
      }
    }
  }
  return res;
};

// Extract headers from the data
const extractHeaders = (data: RestaurantItem[]): string[] => {
  const flattenedData = data.map(item => flattenObject(item));
  const headers = Array.from(new Set(flattenedData.flatMap(Object.keys)));
  return headers;
};

const ImportRestaurant = (props: Props) => {
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [isHeaderMatch, setIsHeaderMatch] = useState(false);

  // Define expected headers explicitly
  const expectedHeaders = [
    'id', 'accessCode', 'name', 'description', 'image',
    'createdAt', 'updatedAt', 'deleted', 'secondary', 'primary', 'bg'
  ];

  // Fetch headers from the API using react-query
  const { data } = useQuery({
    queryKey: ["restaurant"],
    queryFn: async () => {
      const response = await axiosInstance.get(`/restaurant?page=all`);
      const heads: any[] = extractHeaders(response.data.items);
      setHeaders(heads);
      return response.data;
    },
  });

  // Handle file change and parse CSV
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          let data = result.data;

          // Convert `deleted` field to boolean
          data = data.map((item: any) => ({
            ...item,
            deleted: item.deleted === 'true', // Convert to boolean
          }));

          const csvHeads = result.meta.fields || [];
          console.log('CSV Headers:', csvHeads);
          console.log('Parsed Data:', data);

          setCsvHeaders(csvHeads);
          setParsedData(data);

          // Explicitly compare CSV headers with expected headers
          const headersMatch = expectedHeaders.every(header => csvHeads.includes(header)) && csvHeads.every(header => expectedHeaders.includes(header));
          setIsHeaderMatch(headersMatch);
        },
        error: (error) => {
          console.error('Error parsing CSV file:', error);
        },
      });
    }
  };

  // Handle the upload of parsed data
  const handleUpload = async () => {
    if (parsedData.length > 0 && isHeaderMatch) {
      try {
        const response = await axiosInstance.post('/restaurant/import', parsedData);
        console.log('Data uploaded successfully:', response.data);
        // Handle success (e.g., show a success message)
      } catch (error) {
        console.error('Error uploading data:', error);
        // Handle error (e.g., show an error message)
      }
    } else {
      console.log('Headers do not match. Upload aborted.');
    }
  };

  return (
    <div className="relative overflow-x-auto sm:rounded-lg w-full m-14 scrollbar-hide">
      <div className="flex justify-between">
        <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center gap-4 pb-4">
          <label
            htmlFor="file"
            className="text-white cursor-pointer bg-gray-800 hover:bg-gray-900 font-medium rounded-lg py-2.5 px-5"
          >
            <span className="flex gap-1">Import</span>
          </label>
          <input
            id="file"
            name="file"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
          {isHeaderMatch ? (
            <button
              onClick={handleUpload}
              className="text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg py-2.5 px-5"
            >
              Upload Data
            </button>
          ) : (
            <span className="text-red-500">CSV headers do not match the expected headers.</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportRestaurant;
