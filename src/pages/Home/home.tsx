import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, Row, Col, Statistic, Divider, List, Avatar, Select } from 'antd';
import Spinner from '@/components/Spinner';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import axiosInstance from "@/axiosInstance";
import { Link } from 'react-router-dom';
import { AvgRatingPerRestaurant } from '../../utils/types';

type CustomerReviewType = {
  name: string;
  comment: string;
};

const Home: React.FC = () => {
  // Fetching overall dashboard statistics
  const statsQuery = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await axiosInstance.get(`/dashboard`);
      return response.data;
    },
  });

  // Fetching all average ratings for restaurants
  const avgRatingsQuery = useQuery({
    queryKey: ['all-average'],
    queryFn: async () => {
      const response = await axiosInstance.get(`/dashboard/all-average`);
      return response.data as AvgRatingPerRestaurant[]; // Type assertion here
    },
  });

  // Fetching recent customer reviews
  const customerReviewQuery = useQuery({
    queryKey: ['customerReview'],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:3000/customer-review`);
      return response.data as CustomerReviewType[]; // Type assertion here
    },
  });

  const [selectedRestaurant, setSelectedRestaurant] = useState<string | undefined>('all');

  // Fetching specific restaurant stats when a restaurant is selected
  const restaurantStatsQuery = useQuery({
    queryKey: ['restaurantStats', selectedRestaurant],
    queryFn: async () => {
      if (selectedRestaurant && selectedRestaurant !== 'all') {
        const response = await axiosInstance.get(`/dashboard/${selectedRestaurant}`);
        return response.data;
      }
      return null;
    },
    enabled: selectedRestaurant !== 'all', // Only run this query when a specific restaurant is selected
  });

  const handleRestaurantChange = (value: string) => {
    setSelectedRestaurant(value);
  };

  // Check for loading or error states
  if (statsQuery.isLoading || avgRatingsQuery.isLoading || restaurantStatsQuery.isLoading || customerReviewQuery.isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (statsQuery.isError || avgRatingsQuery.isError || restaurantStatsQuery.isError || customerReviewQuery.isError) {
    return <div>Error loading statistics.</div>;
  }

  // Destructure and extract data from the fetched dashboard data
  const {
    totalRestaurants,
    totalRatings,
    totalCustomerReview,
    totalItems,
    totalCategories,
  } = statsQuery.data || {};

  const avgRatingPerRestaurant: AvgRatingPerRestaurant[] = avgRatingsQuery.data || [];
  const specificRestaurantData = restaurantStatsQuery.data || {};
  const topReviewedItems = specificRestaurantData.topReviewedItems || [];

  // Create a restaurant list from avgRatingPerRestaurant data for the dropdown
  const restaurantList = avgRatingPerRestaurant.map((avgRating: AvgRatingPerRestaurant) => ({
    id: avgRating.id,
    name: avgRating.name,
  }));


  // Filter data based on selected restaurant
  const filteredAvgRatingData =
    selectedRestaurant === 'all'
      ? avgRatingPerRestaurant
      : avgRatingPerRestaurant.filter((data: AvgRatingPerRestaurant) => data.id === selectedRestaurant);

  // Calculate totals based on selected restaurant
  const filteredTotalReviews =
    selectedRestaurant === 'all'
      ? totalCustomerReview
      : specificRestaurantData.totalReviews || 0;

  const filteredTotalRatings =
    selectedRestaurant === 'all'
      ? totalRatings
      : specificRestaurantData.totalRatings || 0;

  const filteredTotalCategories =
    selectedRestaurant === 'all'
      ? totalCategories
      : specificRestaurantData.categoriesCount || 0;

  const filteredTotalItems =
    selectedRestaurant === 'all'
      ? totalItems
      : specificRestaurantData.itemsCount || 0;

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

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
            {restaurantList.map((restaurant) => (
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
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}`, 'Average Rating']} />
                  <Legend />
                  <Bar dataKey="averageRating" fill="#0088FE" />
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
                    dataKey="averageRating"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                  >
                    {filteredAvgRatingData.map((entry: AvgRatingPerRestaurant, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value}`, `${name}`]} />
                  <Legend />
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
            {topReviewedItems.map((item: { itemName: string; reviews: number }, index: number) => (
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
        {/* Recent Activity */}
        <Card title="Recent Activity" className="mb-6">
          <List
            itemLayout="horizontal"
            dataSource={customerReviewQuery?.data?.items?.slice(0, 4) as CustomerReviewType[]}
            renderItem={(item: CustomerReviewType) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={item.name} />}
                  title={`${item.name}: ${item.comment}`}
                />
              </List.Item>
            )}
          />
        </Card>

        {/* Quick Links */}
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

        {/* Notifications */}
        <Card title="Notifications">
          <p>No new notifications.</p>
        </Card>
      </div>
    </div>
  );
};

export default Home;
