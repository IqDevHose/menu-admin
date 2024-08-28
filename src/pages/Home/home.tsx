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
import { StatsData, Restaurant, Rating, Category } from '../../utils/types';
import axiosInstance from "@/axiosInstance";

type CustomerReviewType = {
  name: string | null;
  comment: string | null;
  rating?: Rating[];
};

// Custom YAxis component using default parameters
const CustomYAxis = ({ tick = { fill: '#4b5563' }, ...props }) => {
  return <YAxis tick={tick} {...props} />;
};

const Home = () => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | undefined>('all');

  // Fetching statistics data from the dashboard endpoint
  const { data: dashboardData, isLoading: isDashboardLoading, isError: isDashboardError } = useQuery<StatsData>({
    queryKey: ['dashboard', selectedRestaurant],
    queryFn: async () => {
      const endpoint =
        selectedRestaurant === 'all'
          ? '/dashboard'
          : `/dashboard/${selectedRestaurant}`;
      const response = await axiosInstance.get(endpoint);
      return response.data;
    },
  });

  // Fetch restaurant list for selection
  const { data: restaurantData, isLoading: isRestaurantLoading, isError: isRestaurantError } = useQuery<Restaurant[]>({
    queryKey: ['restaurants'],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:3000/restaurant`);
      return response.data.items; // Assuming response.data.items contains the list of restaurants
    },
  });

  const handleRestaurantChange = (value: string) => {
    setSelectedRestaurant(value);
  };

  if (isDashboardLoading || isRestaurantLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isDashboardError || isRestaurantError || !dashboardData || !restaurantData) {
    return <div>Error loading statistics.</div>;
  }

  // Extracting statistics from the dashboard API response
  let totalCustomerReview = 0;
  let totalRatings = 0;
  let totalCategories = 0;
  let totalItems = 0;
  let customerReviews: CustomerReviewType[] = [];

  // Initialize avgRatingData array to hold rating data
  let avgRatingData: { restaurantName: string; avgRating: number; restaurantId: string }[] = [];

  console.log("Selected Restaurant:", selectedRestaurant);
  console.log("Dashboard Data:", dashboardData);
  console.log("Restaurant Data:", restaurantData);
  console.log("All Restaurants Data:", dashboardData?.restaurants);

  if (selectedRestaurant === 'all') {
    const allRestaurantsData = dashboardData.restaurants || [];
    
    totalCustomerReview = allRestaurantsData.reduce((acc: number, restaurant: Restaurant) => {
      return acc + (restaurant.customerReview ? restaurant.customerReview.length : 0);
    }, 0);

    totalRatings = allRestaurantsData.reduce((acc: number, restaurant: Restaurant) => {
      return acc + (restaurant.customerReview ? restaurant.customerReview.reduce((acc2: number, review: CustomerReviewType) => {
        return acc2 + (review.rating ? review.rating.length : 0);
      }, 0) : 0);
    }, 0);

    totalCategories = allRestaurantsData.reduce((acc: number, restaurant: Restaurant) => {
      return acc + (restaurant.categories ? restaurant.categories.length : 0);
    }, 0);

    totalItems = allRestaurantsData.reduce((acc: number, restaurant: Restaurant) => {
      return acc + (restaurant.categories ? restaurant.categories.reduce((acc2: number, category: Category) => {
        return acc2 + (category.items ? category.items.length : 0);
      }, 0) : 0);
    }, 0);

    avgRatingData = allRestaurantsData.map((restaurant: Restaurant) => {
      const ratings = restaurant.customerReview ? restaurant.customerReview.flatMap((review: CustomerReviewType) => review.rating || []) : [];
      const totalScore = ratings.reduce((sum: number, rating: Rating) => sum + (rating.score || 0), 0);
      const avgRating = ratings.length ? parseFloat((totalScore / ratings.length).toFixed(2)) : 0;
      
      return {
        restaurantName: restaurant.name,
        avgRating: avgRating,
        restaurantId: restaurant.id,
      };
    });

    customerReviews = allRestaurantsData.flatMap((restaurant: Restaurant) => restaurant.customerReview || []) || [];
  } else {
    const restaurantDetail = dashboardData as Restaurant;

    totalCustomerReview = restaurantDetail.customerReview ? restaurantDetail.customerReview.length : 0;
    totalCategories = restaurantDetail.categories ? restaurantDetail.categories.length : 0;
    totalItems = restaurantDetail.categories
      ? restaurantDetail.categories.reduce((acc: number, category: Category) => acc + (category.items ? category.items.length : 0), 0)
      : 0;

    if (restaurantDetail.customerReview) {
      totalRatings = restaurantDetail.customerReview.reduce((acc: number, review: CustomerReviewType) => {
        if (review.rating) {
          return acc + review.rating.length;
        }
        return acc;
      }, 0);

      const ratings = restaurantDetail.customerReview.flatMap((review: CustomerReviewType) => review.rating || []);
      const totalScore = ratings.reduce((sum: number, rating: Rating) => sum + (rating.score || 0), 0);
      const avgRating = ratings.length ? parseFloat((totalScore / ratings.length).toFixed(2)) : 0;

      avgRatingData = [
        {
          restaurantName: restaurantDetail.name || '',
          avgRating: avgRating,
          restaurantId: restaurantDetail.id || '',
        },
      ];
    }

    customerReviews = restaurantDetail.customerReview || [];
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="p-8 w-full overflow-hidden bg-white min-h-screen flex">
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
            {restaurantData.map((restaurant: Restaurant) => (
              <Select.Option key={restaurant.id} value={restaurant.id}>
                {restaurant.name}
              </Select.Option>
            ))}
          </Select>
        </div>

        <Row gutter={24}>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic
                title="Total Reviews"
                value={totalCustomerReview}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic
                title="Total Ratings"
                value={totalRatings}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic
                title="Total Categories"
                value={totalCategories}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic
                title="Total Items"
                value={totalItems}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={24} className="mt-6">
          <Col xs={24} lg={12}>
            <Card hoverable>
              <h2 className="text-lg font-medium mb-4 text-gray-800">
                Average Rating per Restaurant
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={avgRatingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="restaurantName" tick={{ fill: '#4b5563' }} />
                  <CustomYAxis />
                  <Tooltip formatter={(value) => [`${value}`, 'Average Rating']} />
                  <Legend formatter={() => 'Average Rating'} />
                  <Bar dataKey="avgRating" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card hoverable>
              <h2 className="text-lg font-medium mb-4 text-gray-800">
                Ratings Distribution
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={avgRatingData}
                    dataKey="avgRating"
                    nameKey="restaurantName"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                  >
                    {avgRatingData.map((entry, index) => (
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

        <div>
          <h2 className="text-lg font-medium mb-4 text-gray-800">
            Top Reviewed Items
          </h2>
          <Row gutter={24}>
            {avgRatingData.map((item, index) => (
              <Col key={index} xs={24} sm={12} lg={6}>
                <Card hoverable>
                  <Statistic
                    title={item.restaurantName}
                    value={item.avgRating}
                    valueStyle={{ color: "#3f8600" }}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      <div className="w-80 pl-4">
        <Card title="Recent Activity" className="mb-6">
          <List
            itemLayout="horizontal"
            dataSource={customerReviews.slice(0, 4)}
            renderItem={(item) => {
              const displayName = item.name ? item.name.trim() : 'Anonymous';
              const displayComment = item.comment ? item.comment.trim() : 'No comment available';
              return (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar>{displayName.charAt(0).toUpperCase()}</Avatar>}
                    title={displayName + ": " + displayComment}
                  />
                </List.Item>
              );
            }}
          />
        </Card>

        <Card title="Quick Links" className="mb-6">
          <List
            dataSource={[
              { title: "View all Restaurant", link: "/restaurant" },
              { title: "View All Reviews", link: "/customerReview" },
              { title: "Manage Categories", link: "/category" },
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
