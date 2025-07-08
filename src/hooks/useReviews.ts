import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { 
  getUserReview, 
  saveUserReview, 
  deleteUserReview, 
  getMovieReviews,
  getMovieReviewStats,
  getUserReviews,
  Review, 
  ReviewInput, 
  ReviewStats 
} from '@/lib/firebase/reviews';

export const useUserReview = (movieId: number) => {
  const { user } = useAuth();
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Загрузка отзыва пользователя
  const loadReview = useCallback(async () => {
    if (!user || !movieId) return;

    setLoading(true);
    setError(null);
    
    try {
      const userReview = await getUserReview(user.uid, movieId);
      setReview(userReview);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке отзыва');
    } finally {
      setLoading(false);
    }
  }, [user, movieId]);

  // Сохранение отзыва
  const saveReview = useCallback(async (reviewInput: ReviewInput) => {
    if (!user) throw new Error('Пользователь не авторизован');

    setLoading(true);
    setError(null);
    
    try {
      const savedReview = await saveUserReview(user, reviewInput);
      setReview(savedReview);
      return savedReview;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка при сохранении отзыва';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Удаление отзыва
  const deleteReview = useCallback(async () => {
    if (!review) return;

    setLoading(true);
    setError(null);
    
    try {
      await deleteUserReview(review.id);
      setReview(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка при удалении отзыва';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [review]);

  useEffect(() => {
    loadReview();
  }, [loadReview]);

  return {
    review,
    loading,
    error,
    saveReview,
    deleteReview,
    reloadReview: loadReview
  };
};

export const useMovieReviews = (movieId: number, limitCount: number = 10) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadReviews = useCallback(async () => {
    if (!movieId) return;

    setLoading(true);
    setError(null);
    
    try {
      const [movieReviews, reviewStats] = await Promise.all([
        getMovieReviews(movieId, limitCount),
        getMovieReviewStats(movieId)
      ]);
      
      setReviews(movieReviews);
      setStats(reviewStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке отзывов');
    } finally {
      setLoading(false);
    }
  }, [movieId, limitCount]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  return {
    reviews,
    stats,
    loading,
    error,
    reloadReviews: loadReviews
  };
};

export const useUserReviews = (userId?: string, limitCount: number = 20) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const targetUserId = userId || user?.uid;

  const loadReviews = useCallback(async () => {
    if (!targetUserId) return;

    setLoading(true);
    setError(null);
    
    try {
      const userReviews = await getUserReviews(targetUserId, limitCount);
      setReviews(userReviews);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке отзывов');
    } finally {
      setLoading(false);
    }
  }, [targetUserId, limitCount]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  return {
    reviews,
    loading,
    error,
    reloadReviews: loadReviews
  };
};