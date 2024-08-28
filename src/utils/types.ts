
// types.ts

export interface Category {
  items?: { id: string }[];
}

export interface Rating {
  score: number;
}

export interface CustomerReviewType {
  name: string | null;
  comment: string | null;
  rating?: Rating[]; // Optional: Include this if you want to access ratings directly from customer reviews
}

export interface Restaurant {
  id: string;
  name: string;
  categories: Category[];
  customerReview?: CustomerReviewType[]; // Optional: customerReview can be undefined
}

export interface AvgRatingPerRestaurant {
  restaurantName: string;
  avgRating: number;
  restaurantId: string;
}

export interface StatsData {
  totalCustomerReview?: number;
  avgRatingPerRestaurant?: AvgRatingPerRestaurant[];
  totalRatings?: number;
  totalCategories?: number;
  totalItems?: number;
  topReviewedItems?: { itemName: string; reviews: number; restaurantId: string }[];
  restaurants?: Restaurant[]; // Make sure 'restaurants' is part of StatsData for 'all' case
  customerReview?: CustomerReviewType[]; // For single restaurant
  categories?: Category[]; // For single restaurant
  name?: string; // For single restaurant
  id?: string; // For single restaurant
}

