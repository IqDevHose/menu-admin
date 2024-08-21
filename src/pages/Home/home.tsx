import React from 'react';
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
import { Card, Row, Col, Statistic, Divider, List, Avatar } from 'antd';
import Spinner from '@/components/Spinner';

const Home = () => {
  // Mocked data for statistics
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

  const isLoading = false;
  const isError = false;

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

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isError || !statsData) {
    return <div>Error loading statistics.</div>;
  }

  return (
    <div className="p-8 w-full bg-white min-h-screen flex">
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>
        <Row gutter={24}>
          {/* Total Reviews, Ratings, Categories, Items */}
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic title="Total Reviews" value={totalReviews} valueStyle={{ color: '#3f8600' }} />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic title="Total Ratings" value={totalRatings} valueStyle={{ color: '#3f8600' }} />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic title="Total Categories" value={totalCategories} valueStyle={{ color: '#3f8600' }} />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic title="Total Items" value={totalItems} valueStyle={{ color: '#3f8600' }} />
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
            dataSource={[
              { title: 'John Doe reviewed Pizza Palace', avatar: 'https://via.placeholder.com/40' },
              { title: 'Jane Smith rated Taco Town', avatar: 'https://via.placeholder.com/40' },
              { title: 'Sam Green added a review for Burger Barn', avatar: 'https://via.placeholder.com/40' },
            ]}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={item.avatar} />}
                  title={item.title}
                />
              </List.Item>
            )}
          />
        </Card>

        <Card title="Quick Links" className="mb-6">
          <List
            dataSource={[
              'View All Reviews',
              'Manage Categories',
              'Add New Item',
              'View Analytics',
            ]}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={<a href="#">{item}</a>}
                />
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
