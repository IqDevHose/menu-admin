import axiosInstance from "@/axiosInstance";
import { CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { Card } from "antd";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from 'axios';

type Props = {};

const SendOffer = (props: Props) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [From, setFrom] = useState<string | null>(null);
  const [To, setTo] = useState<string | null>(null);
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>(["9647760692282"]); // Add more numbers as needed
  const location = useLocation();
  const offer = location.state;

  const query = useQuery({
    queryKey: ["customerReview", From, To],
    queryFn: async () => {
      if (From || To) {
        const customerReview = await axiosInstance.get(
          `/customer-review?page=all&from=${From}&to=${To}`
        );
        return customerReview.data;
      }
      return [];
    },
    refetchOnWindowFocus: false,
    enabled: !!From && !!To,
  });

  useEffect(() => {
    let fromDate = getTodayDate();
    let toDate;

    if (selectedDate === "month") {
      toDate = getNextMonthDate();
    } else if (selectedDate === "week") {
      toDate = getNextWeekDate();
    } else if (selectedDate === "day") {
      toDate = fromDate;
    }

    setFrom(fromDate);
    setTo(toDate);
  }, [selectedDate]);

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const getNextMonthDate = () => {
    const today = new Date();
    const nextMonth = new Date(today.setMonth(today.getMonth() + 1));
    return nextMonth.toISOString().split("T")[0];
  };

  const getNextWeekDate = () => {
    const today = new Date();
    const nextWeek = new Date(today.setDate(today.getDate() + 7));
    return nextWeek.toISOString().split("T")[0];
  };
  const sendMessage = async (phoneNumbers:string[], message:string) => {
    const url = "https://7103.api.greenapi.com/waInstance7103113800/sendMessage/b531fcd0b034440eb56e280f712c3a869bbec62f62014c5790";
    const headers = {
      'Content-Type': 'application/json'
    };
  
    try {
      // Loop through phone numbers and send the message
      for (const phoneNumber of phoneNumbers) {
        const payload = {
          chatId: `${phoneNumber}@c.us`,
          message: message
        };
  
        await axios.post(url, payload, { headers });
        console.log(`Message sent to ${phoneNumber}`);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  const handleSendMessages = async () => {
    const message = offer.description; // Set your message content here
    await sendMessage(['9647760692282'], message);
  };

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

        <Card key={offer.id} className="cursor-pointer hover:shadow-lg transition-shadow w-96">
          <AspectRatio ratio={16 / 9}>
            <img src={offer.image} alt={offer.title} className="object-cover w-full h-full rounded-t-lg" />
          </AspectRatio>
          <CardHeader className="p-4">
            <CardTitle className="text-lg truncate">{offer.title}</CardTitle>
            <CardDescription className="truncate">{offer.description}</CardDescription>
          </CardHeader>
          <Separator />
        </Card>
      </div>

      <div className="mt-7">
        <h1 className="font-bold text-xl mb-3">Send offer to:</h1>
        <button
          onClick={handleSendMessages}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Send Messages
        </button>
      </div>

      <div className="overflow-x-auto mt-5">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                <input type="checkbox" />
              </th>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Phone</th>
              <th scope="col" className="px-6 py-3">Birthday</th>
              <th scope="col" className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {query.data?.items.length > 0 ? (
              query.data.items.map((item: any) => (
                <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4"><input type="checkbox" /></td>
                  <td className="px-6 py-4">{item.name}</td>
                  <td className="px-6 py-4">{item.phone}</td>
                  <td className="px-6 py-4">{new Date(item.birthday).toLocaleDateString("en-CA")}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4">No data available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default SendOffer;
