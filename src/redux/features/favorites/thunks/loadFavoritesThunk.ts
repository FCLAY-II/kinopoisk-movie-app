import { createAsyncThunk } from "@reduxjs/toolkit";
import { FavoriteMovie } from "@/types/favorites";
import * as favoritesApi from "@/services/api/favorites";

export const loadFavoritesThunk = createAsyncThunk<
  FavoriteMovie[],
  string,
  { rejectValue: string }
>(
  "favorites/thunks/loadFavoritesThunk",
  async (userId, { rejectWithValue }) => {
    const result = await favoritesApi.getFavorites(userId);

    if (!result.success) {
      return rejectWithValue(result.error || "Ошибка загрузки избранного");
    }

    return result.data || [];
  },
);
