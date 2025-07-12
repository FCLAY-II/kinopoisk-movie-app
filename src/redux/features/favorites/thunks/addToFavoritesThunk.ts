import { createAsyncThunk } from "@reduxjs/toolkit";
import { FavoriteMovie } from "@/types/favorites";
import { IMovie } from "@/components/MovieCard/types";
import * as favoritesApi from "@/services/api/favorites";

export const addToFavoritesThunk = createAsyncThunk<
  FavoriteMovie,
  { userId: string; movie: IMovie },
  { rejectValue: string }
>(
  "favorites/thunks/addToFavoritesThunk",
  async ({ userId, movie }, { rejectWithValue }) => {
    const result = await favoritesApi.addToFavorites(userId, movie);

    if (!result.success) {
      return rejectWithValue(result.error || "Ошибка добавления в избранное");
    }

    return result.data!;
  },
);
