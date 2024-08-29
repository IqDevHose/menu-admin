// types.ts

export interface Category {
  items?: { id: string }[];
}

export interface Restaurant {
  id: string;
  name: string;
  categories: Category[];
}

export interface Rating {
  score: number;
  customerReview?: {
    resturantId: string;
  };
}

export interface AvgRatingPerRestaurant {
  restaurantName: string;
  avgRating: number;
  restaurantId: string;
}

export interface StatsData {
  totalCustomerReview: number;
  avgRatingPerRestaurant: AvgRatingPerRestaurant[];
  totalRatings: number;
  totalCategories: number;
  totalItems: number;
  topReviewedItems: {
    itemName: string;
    reviews: number;
    restaurantId: string;
  }[];
}

export interface LoginData {
  userName: string;
  password: string;
}
