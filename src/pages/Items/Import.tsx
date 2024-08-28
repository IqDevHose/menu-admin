import React, {useState} from 'react'
import Papa from 'papaparse';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/axiosInstance';

type Props = {}

interface DataItem {
    categoryId: string;
    createdAt: string;
    deleted: boolean;
    description: string;
    id: string;
    image: string | null;
    name: string;
    price: number;
    updatedAt: string;
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
  const extractHeaders = (data: DataItem[]): string[] => {
    const flattenedData = data.map(item => flattenObject(item));
    const headers = Array.from(new Set(flattenedData.flatMap(Object.keys)));
    return headers;
  };

const Import = (props: Props) => {
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>();
  const [headers , setHeaders] = useState<string[]>();


  const {data} = useQuery({
    queryKey: ["items"],
    queryFn: async () => {
      const item = await axiosInstance.get(`/item?page=all`);

      const heads: any[] = extractHeaders(item.data.items)
      setHeaders(heads)
      return item.data;
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const data = result.data;
          const csvHeads = result.meta.fields || [];

          console.log(csvHeads)
          console.log(data)
          setCsvHeaders(csvHeads);
          setParsedData(data);
        },
        error: (error) => {
          console.error('Error parsing CSV file:', error);
        },
      });
    }
  };

  const handleUpload = async () => {
    console.log(parsedData)
    // if (parsedData.length > 0) {
    //   try {
    //     const response = await axios.post('/api/upload', parsedData);
    //     console.log('Data uploaded successfully:', response.data);
    //     // Handle success (e.g., show a success message)
    //   } catch (error) {
    //     console.error('Error uploading data:', error);
    //     // Handle error (e.g., show an error message)
    //   }
    // }
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
            </div>
            </div></div>
  );
}

export default Import