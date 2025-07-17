import { createAsyncThunk } from "@reduxjs/toolkit";
import * as watchedApi from "@/services/api/watched";

export const removeFromWatchedThunk = createAsyncThunk<
  number,
  { userId: string; filmId: number },
  { rejectValue: string }
>(
  "watched/thunks/removeFromWatchedThunk",
  async ({ userId, filmId }, { rejectWithValue }) => {
    const result = await watchedApi.removeFromWatched(userId, filmId);

    if (!result.success) {
      return rejectWithValue(
        result.error || "Ошибка удаления из просмотренных",
      );
    }

    return filmId;
  },
);
