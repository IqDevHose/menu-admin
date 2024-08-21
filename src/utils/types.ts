export interface AvgRatingPerRestaurant {
    restaurantName: string;
    avgRating: number;
  }
  
  export interface StatsData {
    totalReviews: number;
    avgRatingPerRestaurant: AvgRatingPerRestaurant[];
    totalRatings: number;
    totalCategories: number;
    totalItems: number;
  }
  