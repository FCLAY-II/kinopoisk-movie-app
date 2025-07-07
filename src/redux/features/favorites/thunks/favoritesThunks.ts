import { createAsyncThunk } from '@reduxjs/toolkit';
import * as favoritesApi from '@/services/api/favorites';
import { IMovie } from '@/componets/MovieCard/types';
import {FavoriteMovie} from "@/types/favorites";

export const loadFavoritesThunk = createAsyncThunk<
  FavoriteMovie[],
  string,
  { rejectValue: string }
>(
  'favorites/thunks/loadFavorites',
  async (userId, { rejectWithValue }) => {
    const result = await favoritesApi.getFavorites(userId);
    
    if (!result.success) {
      return rejectWithValue(result.error || 'Ошибка загрузки избранного');
    }
    
    return result.data || [];
  }
);

export const addToFavoritesThunk = createAsyncThunk<
  FavoriteMovie,
  { userId: string; movie: IMovie },
  { rejectValue: string }
>(
  'favorites/thunks/addToFavorites',
  async ({ userId, movie }, { rejectWithValue }) => {
    const result = await favoritesApi.addToFavorites(userId, movie);
    
    if (!result.success) {
      return rejectWithValue(result.error || 'Ошибка добавления в избранное');
    }
    
    return result.data!;
  }
);

export const removeFromFavoritesThunk = createAsyncThunk<
  number,
  { userId: string; filmId: number },
  { rejectValue: string }
>(
  'favorites/thunks/removeFromFavorites',
  async ({ userId, filmId }, { rejectWithValue }) => {
    const result = await favoritesApi.removeFromFavorites(userId, filmId);
    
    if (!result.success) {
      return rejectWithValue(result.error || 'Ошибка удаления из избранного');
    }
    
    return filmId;
  }
);