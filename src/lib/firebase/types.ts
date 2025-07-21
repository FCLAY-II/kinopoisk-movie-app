export interface FirebaseConfig {
  apiKey: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  measurementId?: string;
}

export interface Review {
  id: string;
  movieId: number;
  userId: string;
  userDisplayName: string;
  rating: number;
  comment: string;
  createdAt: number;
  updatedAt: number;
}

export interface ReviewInput {
  movieId: number;
  rating: number;
  comment: string;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}
