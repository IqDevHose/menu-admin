import React, { useState } from 'react';
import Papa from 'papaparse';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/axiosInstance';

type Props = {}

interface DataCategory {
    createdAt: String;
    deleted: boolean
    icon: String
    id: String
    name: String
    orderNumber: String
    restaurantId: String
    updatedAt: String
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
const extractHeaders = (data: DataCategory[]): string[] => {
  const flattenedData = data.map(item => flattenObject(item));
  const headers = Array.from(new Set(flattenedData.flatMap(Object.keys)));
  return headers;
};

const ImportCustomerReview = (props: Props) => {
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [isHeaderMatch, setIsHeaderMatch] = useState(false);

  // Fetch headers from the API using react-query
  const { data } = useQuery({
    queryKey: ["customer-review"],
    queryFn: async () => {
      const item = await axiosInstance.get(`/customer-review?page=all`);
      const heads: any[] = extractHeaders(item.data.items);
      setHeaders(heads);
      return item.data;
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
          const data = result.data;
          const csvHeads = result.meta.fields || [];

          console.log(csvHeads);
          console.log(data);
          setCsvHeaders(csvHeads);
          setParsedData(data);

          // Check if the CSV headers match the expected headers
          const headersMatch = csvHeads.every(header => headers.includes(header)) && headers.every(header => csvHeads.includes(header));
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
        const response = await axiosInstance.post('/customer-review/import', parsedData);
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
      <div className="flex justify-between ">
        <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center gap-4 pb-4">
          <label
            htmlFor="file"
            className="text-white cursor-pointer bg-gray-800 hover:bg-gray-900 font-medium rounded-lg py-2.5 px-5 "
          >
            <span className="flex gap-1 ">
              Import
            </span>
          </label>
          <input
            id="file"
            name="file"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden text-white  bg-gray-800 hover:bg-gray-900 font-medium rounded-lg py-2.5 px-5 "
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
}

export default ImportCustomerReview;