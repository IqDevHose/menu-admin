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
import { Link, useLocation, useNavigate } from "react-router-dom";

type Props = {};

const SendOffer = (props: Props) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [From, setFrom] = useState<string | null>(null);
  const [To, setTo] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const offer = location.state;

  // Function to get the first and last date of the current month
  const getCurrentMonthDates = () => {
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return {
      from: firstDay.toISOString().split("T")[0], 
      to: lastDay.toISOString().split("T")[0],
    };
  };

  // Set From and To on component mount
  useEffect(() => {
    const { from, to } = getCurrentMonthDates();
    setFrom(from);
    setTo(to);
  }, []);

  const query = useQuery({
    queryKey: ["customerReview", From, To], // Include From and To in the queryKey to refetch when they change
    queryFn: async () => {
      if (From && To) {
        const customerReview = await axiosInstance.get(
          `/customer-review?page=all&from=${From}&to=${To}`
        );
        return customerReview.data;
      }
      return [];
    },
    refetchOnWindowFocus: false, // Prevent automatic refetching on window focus if not needed
  });
console.log(From);
console.log(To);

  return (
    <div>
      {/* Restaurant Filter */}
      <div>
        <select
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
          }}
          className="p-2 border border-gray-300 rounded-lg"
        >
          <option value="">This month</option>
          {query?.data?.map((query: any) => (
            <option key={query.id} value={query.id}>
              {query.name}
            </option>
          ))}
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
        {/* <CardFooter className="flex justify-end p-3 items-center">
              <div className="flex items-center gap-4">
              
              </div>
            </CardFooter> */}
      </Card>
    </div>
  );
};

export default SendOffer;
