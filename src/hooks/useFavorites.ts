import { useEffect, useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectUser } from '@/redux/features/user/userSlice';
import {
  selectFavorites,
  selectFavoritesLoading,
  selectFavoritesError,
  selectFavoritesCount
} from '@/redux/features/favorites/favoritesSlice';
import { IMovie } from '@/componets/MovieCard/types';
import {
  addToFavoritesThunk,
  loadFavoritesThunk,
  removeFromFavoritesThunk
} from "@/redux/features/favorites/thunks/favoritesThunks";

export const useFavorites = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const favorites = useAppSelector(selectFavorites);
  const loading = useAppSelector(selectFavoritesLoading);
  const error = useAppSelector(selectFavoritesError);
  const count = useAppSelector(selectFavoritesCount);

  const userId = useMemo(() => user?.uid || null, [user?.uid]);

  // Загружаем избранное при смене пользователя
  useEffect(() => {
    if (userId) {
      dispatch(loadFavoritesThunk(userId));
    }
  }, [dispatch, userId]);

  const addToFavorites = useCallback(async (movie: IMovie): Promise<boolean> => {
    if (!userId) return false;
    
    try {
      await dispatch(addToFavoritesThunk({ userId, movie })).unwrap();
      return true;
    } catch {
      return false;
    }
  }, [dispatch, userId]);

  const removeFromFavorites = useCallback(async (filmId: number): Promise<boolean> => {
    if (!userId) return false;
    
    try {
      await dispatch(removeFromFavoritesThunk({ userId, filmId })).unwrap();
      return true;
    } catch {
      return false;
    }
  }, [dispatch, userId]);

  const isFavorite = useCallback((filmId: number): boolean => {
    return favorites.some(fav => fav.filmId === filmId);
  }, [favorites]);

  const toggleFavorite = useCallback(async (movie: IMovie): Promise<boolean> => {
    if (isFavorite(movie.filmId)) {
      return await removeFromFavorites(movie.filmId);
    } else {
      return await addToFavorites(movie);
    }
  }, [isFavorite, addToFavorites, removeFromFavorites]);

  return {
    favorites,
    loading,
    error,
    count,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite
  };
};