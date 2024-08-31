import { useState } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, Row, Col, Statistic, Divider, List, Avatar, Select } from 'antd';
import Spinner from '@/components/Spinner';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AvgRatingPerRestaurant, StatsData, Restaurant, Rating, Category } from '../../utils/types'; // Import Category


import axiosInstance from "@/axiosInstance";
type CustomerReviewType = {
  name: string;
  comment: string;
};
const Home = () => {
  // Fetching data using useQuery
  const query = useQuery<StatsData>({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const customerReview = await axiosInstance.get(`/dashboard`);
      return customerReview.data;
    },
  });

  const customerReviewQuery = useQuery({
    queryKey: ['customerReview'],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:3000/customer-review`);
      return response.data;
    },
  });

  // Fetch restaurant list for selection
  const restaurantQuery = useQuery({
    queryKey: ['restaurants'],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:3000/restaurant`);
      return response.data;
    },
  });

  // Fetch all ratings
  const ratingQuery = useQuery({
    queryKey: ['ratings'],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:3000/rating`);
      return response.data;
    },
  });

  const [selectedRestaurant, setSelectedRestaurant] = useState<string | undefined>('all');

  const handleRestaurantChange = (value: string) => {
    setSelectedRestaurant(value);
  };

  // Calculating the average rating per restaurant
  const calculateAverageRatings = (): AvgRatingPerRestaurant[] => {
    const ratings: Rating[] = Array.isArray(ratingQuery.data?.items) ? ratingQuery.data.items : [];
    const restaurants: Restaurant[] = Array.isArray(restaurantQuery.data?.items) ? restaurantQuery.data.items : [];

    return restaurants.map((restaurant: Restaurant) => {
      const restaurantRatings = ratings.filter(
        (rating: Rating) => rating.customerReview?.resturantId === restaurant.id
      );

      const averageRating =
        restaurantRatings.reduce((sum: number, rating: Rating) => sum + rating.score, 0) /
        (restaurantRatings.length || 1); // Avoid division by zero

      return {
        restaurantName: restaurant.name,
        avgRating: averageRating ? parseFloat(averageRating.toFixed(2)) : 0,
        restaurantId: restaurant.id,
      };
    });
  };

  const avgRatingPerRestaurant = calculateAverageRatings();

  // Extracting topReviewedItems from the query data or setting a default
  const {
    totalCustomerReview,
    totalRatings,
    totalCategories,
    totalItems,
    topReviewedItems = [], // Default to empty array if not defined
  } = query.data || {};

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  if (query.isPending || restaurantQuery.isPending || ratingQuery.isPending) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (query.isError || restaurantQuery.isError || ratingQuery.isError) {
    return <div>Error loading statistics.</div>;
  }

  // Filter data based on selected restaurant
  const filteredAvgRatingData =
    selectedRestaurant === 'all'
      ? avgRatingPerRestaurant
      : avgRatingPerRestaurant.filter((data) => data.restaurantId === selectedRestaurant);

  const filteredTopReviewedItems =
    selectedRestaurant === 'all'
      ? topReviewedItems
      : topReviewedItems.filter((item) => item.restaurantId === selectedRestaurant);

  // Calculate totals based on selected restaurant
  const filteredTotalReviews =
    selectedRestaurant === 'all'
      ? totalCustomerReview
      : ratingQuery.data?.items.filter(
          (rating: Rating) => rating.customerReview?.resturantId === selectedRestaurant
        ).length || 0;

  const filteredTotalRatings =
    selectedRestaurant === 'all'
      ? totalRatings
      : ratingQuery.data?.items.filter(
          (rating: Rating) => rating.customerReview?.resturantId === selectedRestaurant
        ).length || 0;

  const filteredTotalCategories =
    selectedRestaurant === 'all'
      ? totalCategories
      : restaurantQuery.data?.items.find(
          (restaurant: Restaurant) => restaurant.id === selectedRestaurant
        )?.categories.length || 0;

  const filteredTotalItems =
    selectedRestaurant === 'all'
      ? totalItems
      : restaurantQuery.data?.items.find(
          (restaurant: Restaurant) => restaurant.id === selectedRestaurant
        )?.categories.reduce((acc: number, category: Category) => acc + (category.items ? category.items.length : 0), 0) || 0;

  return (
    <div className="p-8 w-full overflow-hidden bg-white min-h-screen flex">
      <div className="flex-1">
        <div className="flex items-center space-x-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          {/* Restaurant Selection */}
          <Select
          placeholder="Select a restaurant"
          style={{ width: 200 }}
          onChange={handleRestaurantChange}
          value={selectedRestaurant}
        >
          <Select.Option key="all" value="all">
            All Restaurants
          </Select.Option>
          {restaurantQuery.data.items.map((restaurant: Restaurant) => (
            <Select.Option key={restaurant.id} value={restaurant.id}>
              {restaurant.name}
            </Select.Option>
          ))}
        </Select>
        </div>

        <Row gutter={24}>
          {/* Total Reviews, Ratings, Categories, Items */}
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic
                title="Total Reviews"
                value={filteredTotalReviews}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic
                title="Total Ratings"
                value={filteredTotalRatings}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic
                title="Total Categories"
                value={filteredTotalCategories}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic
                title="Total Items"
                value={filteredTotalItems}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={24} className="mt-6">
          {/* Average Rating per Restaurant */}
          <Col xs={24} lg={12}>
            <Card hoverable>
              <h2 className="text-lg font-medium mb-4 text-gray-800">
                Average Rating per Restaurant
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={filteredAvgRatingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="restaurantName" tick={{ fill: '#4b5563' }} />
                  <YAxis tick={{ fill: '#4b5563' }} />
                  <Tooltip formatter={(value) => [`${value}`, 'Average Rating']} />
                  <Legend formatter={() => 'Average Rating'} />
                  <Bar dataKey="avgRating" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>

          {/* Ratings Distribution (Pie Chart) */}
          <Col xs={24} lg={12}>
            <Card hoverable>
              <h2 className="text-lg font-medium mb-4 text-gray-800">
                Ratings Distribution
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={filteredAvgRatingData}
                    dataKey="avgRating"
                    nameKey="restaurantName"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                  >
                    {filteredAvgRatingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}`, 'Average Rating']} />
                  <Legend formatter={() => 'Average Rating'} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        <Divider className="my-8" />

        {/* Top Reviewed Items */}
        <div>
          <h2 className="text-lg font-medium mb-4 text-gray-800">
            Top Reviewed Items
          </h2>
          <Row gutter={24}>
            {filteredTopReviewedItems.map((item, index) => (
              <Col key={index} xs={24} sm={12} lg={6}>
                <Card hoverable>
                  <Statistic
                    title={item.itemName}
                    value={item.reviews}
                    valueStyle={{ color: "#3f8600" }}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* Sidebar Content */}
      <div className="w-80 pl-4">
        <Card title="Recent Activity" className="mb-6">
          <List
            itemLayout="horizontal"
            dataSource={customerReviewQuery?.data?.items?.slice(0, 4) as CustomerReviewType[]}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta avatar={<Avatar src={item.name} />} title={item.name + ": " + item.comment} />
              </List.Item>
            )}
          />
        </Card>

        <Card title="Quick Links" className="mb-6">
          <List
            dataSource={[
              { title: "View all Restaurant", link: "/restaurants" },
              { title: "View All Reviews", link: "/customerReviews" },
              { title: "Manage Categories", link: "/categories" },
              { title: "Manage Items", link: "/items" },
            ]}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta title={<Link to={item.link}>{item.title}</Link>} />
              </List.Item>
            )}
          />
        </Card>

        <Card title="Notifications">
          <p>No new notifications.</p>
        </Card>
      </div>
    </div>
  );
};

export default Home;
