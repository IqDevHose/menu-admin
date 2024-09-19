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
  const [selectedDate, setSelectedDate] = useState("day");
  const [From, setFrom] = useState<string | null>(null);
  const [To, setTo] = useState<string | null>(null);

  const location = useLocation();
  const offer = location.state;

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
    }

    setFrom(fromDate);
    setTo(toDate);
  }, [selectedDate]);

  const query = useQuery({
    queryKey: ["customerReview", From, To],
    queryFn: async () => {
      if (From && To) {
        const customerReview = await axiosInstance.get(
          `/customer-review?page=all&from=${From}&to=${To}`
        );
        return customerReview.data;
      }
      return [];
    },
    refetchOnWindowFocus: false,
  });

  console.log(From);
  console.log(To);

  return (
    <div>
      {/* Date Range Filter */}
      <div className="mb-10">
        <select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg"
        >
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
  );
};

export default SendOffer;
