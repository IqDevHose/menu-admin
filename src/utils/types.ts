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
  id: string; // Assuming 'id' is of type string
  name: string; // Assuming 'name' is of type string
  averageRating: number; // Assuming there is an averageRating field
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
