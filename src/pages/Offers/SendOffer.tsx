import axiosInstance from "@/axiosInstance";
import {
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { Card } from "antd";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

type Props = {};

const SendOffer = (props: Props) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [From, setFrom] = useState<string | null>(null);
  const [To, setTo] = useState<string | null>(null);
  const location = useLocation();
  const offer = location.state;

  // Fetch customer reviews based on selected date range
  const query = useQuery({
    queryKey: ["customerReview", From, To],
    queryFn: async () => {
      if (From || To) {
        const customerReview = await axiosInstance.get(
          `/customer-review?page=all&from=${From}&to=${To}`
        );
        console.log(customerReview.data);
        return customerReview.data;
      }
      return [];
    },
    refetchOnWindowFocus: false,
    enabled: !!From && !!To, // Ensures query only runs when both From and To are set
  });

  // Function to get today's date
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Function to get one month ahead from today
  const getNextMonthDate = () => {
    const today = new Date();
    const nextMonth = new Date(today.setMonth(today.getMonth() + 1));
    return nextMonth.toISOString().split("T")[0];
  };

  // Function to get one week ahead from today
  const getNextWeekDate = () => {
    const today = new Date();
    const nextWeek = new Date(today.setDate(today.getDate() + 7));
    return nextWeek.toISOString().split("T")[0];
  };

  // Set the date range based on the selected option
  useEffect(() => {
    let fromDate = getTodayDate();
    let toDate;

    if (selectedDate === "month") {
      toDate = getNextMonthDate(); // Set "To" as one month from today
    } else if (selectedDate === "week") {
      toDate = getNextWeekDate(); // Set "To" as one week from today
    } else if (selectedDate === "day") {
      toDate = fromDate; // "From" and "To" are both today for day selection
    } else {
    }

    setFrom(fromDate);
    setTo(toDate);
  }, [selectedDate]);
  console.log(query.data);
  return (
    <>
      <div>
        <div className="mb-10">
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg"
            defaultValue={"select"}
          >
            <option value="select">select time</option>
            <option value="day">Today</option>
            <option value="week">This week</option>
            <option value="month">This month</option>
          </select>
        </div>

        <Card
          key={offer.id}
          className="cursor-pointer hover:shadow-lg transition-shadow w-96"
        >
          <AspectRatio ratio={16 / 9}>
            <>
              <img
                src={offer.image}
                alt={offer.title}
                className="object-cover w-full h-full rounded-t-lg"
              />
            </>
          </AspectRatio>
          <CardHeader className="p-4">
            <CardTitle className="text-lg truncate">{offer.title}</CardTitle>
            <CardDescription className="truncate">
              {offer.description}
            </CardDescription>
          </CardHeader>
          <Separator />
        </Card>
      </div>
      <>
        <h1>Send offer to:</h1>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  <input type="checkbox" />
                </th>

                <th scope="col" className="px-6 py-3">
                  Name
                </th>

                <th scope="col" className="px-6 py-3">
                  Phone
                </th>

                <th scope="col" className="px-6 py-3">
                  Birthday
                </th>
                <th scope="col" className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {query.data?.items.length > 0 ? (
                query.data.items.map((item: any) => (
                  <tr
                    key={item.id}
                    className="bg-white border-b hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <input type="checkbox" />
                    </td>

                    <td className="px-6 py-4">{item.name}</td>

                    <td className="px-6 py-4">{item.phone}</td>

                    <td className="px-6 py-4">
                      {new Date(item.birthday).toLocaleDateString("en-CA")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    No data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </>
    </>
  );
};

export default SendOffer;
