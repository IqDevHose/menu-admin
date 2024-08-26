import React, { useState } from 'react';
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
import { Card, Row, Col, Statistic, Divider, List, Avatar, Select } from 'antd'; // Import Select from Ant Design
import Spinner from '@/components/Spinner';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';

type CustomerReviewType = {
  name: string;
  comment: string;
};

const Home = () => {
  // Fetching data using useQuery
  const query = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const customerReview = await axios.get(`http://localhost:3000/dashboard`);
      return customerReview.data;
    },
  });

  const customerReviewQuery = useQuery({
    queryKey: ['customerReview'],
    queryFn: async () => {
      const customerReview = await axios.get(`http://localhost:3000/customer-review`);
      return customerReview.data;
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

  const [selectedRestaurant, setSelectedRestaurant] = useState<string | undefined>(undefined);

  const handleRestaurantChange = (value: string) => {
    setSelectedRestaurant(value);
    // Add any additional logic you want to perform when a restaurant is selected
  };

  const statsData = {
    totalReviews: 250,
    avgRatingPerRestaurant: [
      { restaurantName: 'Pizza Palace', avgRating: 4.5 },
      { restaurantName: 'Burger Barn', avgRating: 4.0 },
      { restaurantName: 'Taco Town', avgRating: 4.7 },
      { restaurantName: 'Pasta Place', avgRating: 3.9 },
    ],
    topReviewedItems: [
      { itemName: 'Margherita Pizza', reviews: 50 },
      { itemName: 'Cheeseburger', reviews: 45 },
      { itemName: 'Steak Taco', reviews: 40 },
      { itemName: 'Spaghetti Bolognese', reviews: 35 },
    ],
    totalRatings: 1500,
    totalCategories: 10,
    totalItems: 300,
  };

  // Extract data from the response
  const {
    totalReviews,
    avgRatingPerRestaurant,
    topReviewedItems,
    totalRatings,
    totalCategories,
    totalItems,
  } = statsData;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (query.isPending || restaurantQuery.isPending) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (query.isError || !statsData || restaurantQuery.isError) {
    return <div>Error loading statistics.</div>;
  }

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
        {restaurantQuery.data.items.map((restaurant: { id: string; name: string }) => (
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
                value={query.data.totalCustomerReview}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic title="Total Ratings" value={query.data.totalRatings} valueStyle={{ color: '#3f8600' }} />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic title="Total Categories" value={query.data.totalCategories} valueStyle={{ color: '#3f8600' }} />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic title="Total Items" value={query.data.totalItems} valueStyle={{ color: '#3f8600' }} />
            </Card>
          </Col>
        </Row>

        <Row gutter={24} className="mt-6">
          {/* Average Rating per Restaurant */}
          <Col xs={24} lg={12}>
            <Card hoverable>
              <h2 className="text-lg font-medium mb-4 text-gray-800">Average Rating per Restaurant</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={avgRatingPerRestaurant}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="restaurantName" tick={{ fill: '#4b5563' }} />
                  <YAxis tick={{ fill: '#4b5563' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="avgRating" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>

          {/* Ratings Distribution (Pie Chart) */}
          <Col xs={24} lg={12}>
            <Card hoverable>
              <h2 className="text-lg font-medium mb-4 text-gray-800">Ratings Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={avgRatingPerRestaurant}
                    dataKey="avgRating"
                    nameKey="restaurantName"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                  >
                    {avgRatingPerRestaurant.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        <Divider className="my-8" />

        {/* Top Reviewed Items */}
        <div>
          <h2 className="text-lg font-medium mb-4 text-gray-800">Top Reviewed Items</h2>
          <Row gutter={24}>
            {topReviewedItems.map((item, index) => (
              <Col key={index} xs={24} sm={12} lg={6}>
                <Card hoverable>
                  <Statistic title={item.itemName} value={item.reviews} valueStyle={{ color: '#3f8600' }} />
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
              { title: 'View all Restaurant', link: '/restaurant' },
              { title: 'View All Reviews', link: '/customerReview' },
              { title: 'Manage Categories', link: '/category' },
              { title: 'Manage Items', link: '/items' },
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
