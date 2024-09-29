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
  LineChart,
  Line,
} from 'recharts';
import { Card, Row, Col, Statistic, Divider, List, Avatar, Select } from 'antd';
import Spinner from '@/components/Spinner';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from "@/axiosInstance";
import { Link } from 'react-router-dom';
import { AvgRatingPerRestaurant } from '../../utils/types';

type CustomerReviewType = {
  name: string;
  comment: string;
};

type ItemsCustomerReviewType = {
  items: CustomerReviewType[];
};

const Home: React.FC = () => {
  const statsQuery = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await axiosInstance.get(`/dashboard`);
      return response.data;
    },
  });

  const avgRatingsQuery = useQuery({
    queryKey: ['all-average'],
    queryFn: async () => {
      const response = await axiosInstance.get(`/dashboard/all-average`);
      return response.data as AvgRatingPerRestaurant[];
    },
  });

  const [selectedRestaurant, setSelectedRestaurant] = useState<string | undefined>('all');

  const customerReviewQuery = useQuery({
    queryKey: ['customerReview'],
    queryFn: async () => {
      const response = await axiosInstance.get(`/customer-review`);
      return response.data as ItemsCustomerReviewType;
    },
  });

  const restaurantStatsQuery = useQuery({
    queryKey: ['restaurantStats', selectedRestaurant],
    queryFn: async () => {
      if (selectedRestaurant && selectedRestaurant !== 'all') {
        const response = await axiosInstance.get(`/dashboard/${selectedRestaurant}`);
        return response.data;
      }
      return null;
    },
    enabled: selectedRestaurant !== 'all',
  });

  const handleRestaurantChange = (value: string) => {
    setSelectedRestaurant(value);
  };

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

  const {
    totalRestaurants,
    totalRatings,
    totalCustomerReview,
    totalItems,
    totalCategories,
  } = statsQuery.data || {};

  const avgRatingPerRestaurant: AvgRatingPerRestaurant[] = avgRatingsQuery.data || [];
  const specificRestaurantData = restaurantStatsQuery.data || {};

  const restaurantList = avgRatingPerRestaurant.map((avgRating: AvgRatingPerRestaurant) => ({
    id: avgRating.id,
    name: avgRating.name,
  }));

  const filteredAvgRatingData =
    selectedRestaurant === 'all'
      ? avgRatingPerRestaurant
      : avgRatingPerRestaurant.filter((data: AvgRatingPerRestaurant) => data.id === selectedRestaurant);

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

  // Example data for the line chart (replace with real data)
  const lineChartData = [
    { date: '2023-01', averageRating: 3.5 },
    { date: '2023-02', averageRating: 8.0 },
    { date: '2023-03', averageRating: 4.2 },
    { date: '2023-04', averageRating: 3.9 },
    { date: '2023-05', averageRating: 4.5 },
    { date: '2023-06', averageRating: 4.3 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="p-4 sm:p-8 w-full bg-white min-h-screen flex flex-col md:flex-row">
      <div className="flex-1">
        <div className="flex items-center space-x-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
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

        <Row gutter={[16, 24]}>
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

        <Row gutter={[16, 24]} className="mt-6">
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

          <Col xs={24} lg={12}>
            <Card hoverable>
              <h2 className="text-lg font-medium mb-4 text-gray-800">
                Average Ratings Over Time
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="averageRating" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Col>

          {selectedRestaurant === 'all' && (
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
          )}
        </Row>

        <Divider className="my-8" />

        <div>
          <h2 className="text-lg font-medium mb-4 text-gray-800">
            Total Restaurants
          </h2>
          <Row gutter={[16, 24]}>
            <Col xs={24} sm={12} lg={6}>
              <Card hoverable>
                <Statistic
                  title="Restaurants"
                  value={totalRestaurants}
                  valueStyle={{ color: '#3f8600' }}
                />
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      <div className="w-full md:w-80 md:pl-4 mt-6 md:mt-0">
        <Card title="Recent Activity" className="mb-6">
          <List
            itemLayout="horizontal"
            dataSource={customerReviewQuery?.data?.items?.slice(0, 4)}
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

        <Card title="Quick Links" className="mb-6">
          <List
            dataSource={[
              { title: "View all Restaurants", link: "/restaurants" },
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
