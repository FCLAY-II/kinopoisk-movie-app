import { 
  collection, 
  doc, 
  setDoc,
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit,
  Timestamp,
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db } from './config';

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

const REVIEWS_COLLECTION = 'reviews';

/**
 * Получение отзыва пользователя для конкретного фильма
 */
export const getUserReview = async (userId: string, movieId: number): Promise<Review | null> => {
  try {
    const reviewsRef = collection(db, REVIEWS_COLLECTION);
    const q = query(
      reviewsRef, 
      where('userId', '==', userId),
      where('movieId', '==', movieId)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const reviewDoc = querySnapshot.docs[0];
    const reviewData = reviewDoc.data();
    
    return {
      id: reviewDoc.id,
      movieId: reviewData.movieId,
      userId: reviewData.userId,
      userDisplayName: reviewData.userDisplayName,
      rating: reviewData.rating,
      comment: reviewData.comment,
      createdAt: reviewData.createdAt?.toMillis() || 0,
      updatedAt: reviewData.updatedAt?.toMillis() || 0
    };
  } catch (error) {
    console.error('Error getting user review:', error);
    throw new Error('Ошибка при получении отзыва');
  }
};

/**
 * Сохранение/обновление отзыва пользователя
 */
export const saveUserReview = async (
  user: User, 
  reviewInput: ReviewInput
): Promise<Review> => {
  try {
    const { movieId, rating, comment } = reviewInput;
    
    // Проверяем, есть ли уже отзыв от этого пользователя
    const existingReview = await getUserReview(user.uid, movieId);
    
    const now = Timestamp.now();
    const reviewData = {
      movieId,
      userId: user.uid,
      userDisplayName: user.displayName || 'Анонимный пользователь',
      rating,
      comment: comment.trim(),
      updatedAt: now
    };
    
    let reviewId: string;
    
    if (existingReview) {
      // Обновляем существующий отзыв
      reviewId = existingReview.id;
      const reviewRef = doc(db, REVIEWS_COLLECTION, reviewId);
      await updateDoc(reviewRef, reviewData);
    } else {
      // Создаем новый отзыв
      reviewId = doc(collection(db, REVIEWS_COLLECTION)).id;
      const reviewRef = doc(db, REVIEWS_COLLECTION, reviewId);
      await setDoc(reviewRef, {
        ...reviewData,
        createdAt: now
      });
    }
    
    return {
      id: reviewId,
      ...reviewData,
      createdAt: existingReview?.createdAt || now.toMillis(),
      updatedAt: now.toMillis()
    };
  } catch (error) {
    console.error('Error saving review:', error);
    throw new Error('Ошибка при сохранении отзыва');
  }
};

/**
 * Удаление отзыва пользователя
 */
export const deleteUserReview = async (reviewId: string): Promise<void> => {
  try {
    const reviewRef = doc(db, REVIEWS_COLLECTION, reviewId);
    await deleteDoc(reviewRef);
  } catch (error) {
    console.error('Error deleting review:', error);
    throw new Error('Ошибка при удалении отзыва');
  }
};

/**
 * Получение всех отзывов для фильма
 */
export const getMovieReviews = async (
  movieId: number, 
  limitCount: number = 10
): Promise<Review[]> => {
  try {
    const reviewsRef = collection(db, REVIEWS_COLLECTION);
    const q = query(
      reviewsRef,
      where('movieId', '==', movieId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        movieId: data.movieId,
        userId: data.userId,
        userDisplayName: data.userDisplayName,
        rating: data.rating,
        comment: data.comment,
        createdAt: data.createdAt?.toMillis() || 0,
        updatedAt: data.updatedAt?.toMillis() || 0
      };
    });
  } catch (error) {
    console.error('Error getting movie reviews:', error);
    throw new Error('Ошибка при получении отзывов');
  }
};

/**
 * Получение статистики отзывов для фильма
 */
export const getMovieReviewStats = async (movieId: number): Promise<ReviewStats> => {
  try {
    const reviewsRef = collection(db, REVIEWS_COLLECTION);
    const q = query(reviewsRef, where('movieId', '==', movieId));
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      };
    }
    
    const reviews = querySnapshot.docs.map(doc => doc.data());
    const totalReviews = reviews.length;
    
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalRating = 0;
    
    reviews.forEach(review => {
      const rating = review.rating;
      ratingDistribution[rating as keyof typeof ratingDistribution]++;
      totalRating += rating;
    });
    
    const averageRating = totalRating / totalReviews;
    
    return {
      averageRating: Math.round(averageRating * 10) / 10, // Округляем до 1 знака
      totalReviews,
      ratingDistribution
    };
  } catch (error) {
    console.error('Error getting review stats:', error);
    throw new Error('Ошибка при получении статистики отзывов');
  }
};

/**
 * Получение всех отзывов пользователя
 */
export const getUserReviews = async (
  userId: string,
  limitCount: number = 20
): Promise<Review[]> => {
  try {
    const reviewsRef = collection(db, REVIEWS_COLLECTION);
    const q = query(
      reviewsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        movieId: data.movieId,
        userId: data.userId,
        userDisplayName: data.userDisplayName,
        rating: data.rating,
        comment: data.comment,
        createdAt: data.createdAt?.toMillis() || 0,
        updatedAt: data.updatedAt?.toMillis() || 0
      };
    });
  } catch (error) {
    console.error('Error getting user reviews:', error);
    throw new Error('Ошибка при получении отзывов пользователя');
  }
};