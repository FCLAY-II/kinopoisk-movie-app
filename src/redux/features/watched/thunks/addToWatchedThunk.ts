import { createAsyncThunk } from "@reduxjs/toolkit";
import { WatchedMovie } from "@/types/watched";
import { IMovie } from "@/components/MovieCard/types";
import * as watchedApi from "@/services/api/watched";

export const addToWatchedThunk = createAsyncThunk<
  WatchedMovie,
  { userId: string; movie: IMovie },
  { rejectValue: string }
>(
  "watched/thunks/addToWatchedThunk",
  async ({ userId, movie }, { rejectWithValue }) => {
    const result = await watchedApi.addToWatched(userId, movie);

    if (!result.success) {
      return rejectWithValue(
        result.error || "Ошибка добавления в просмотренные",
      );
    }

    return result.data!;
  },
);
