import { createAsyncThunk } from "@reduxjs/toolkit";
import { WatchedMovie } from "@/types/watched";
import * as watchedApi from "@/services/api/watched";

export const loadWatchedThunk = createAsyncThunk<
  WatchedMovie[],
  string,
  { rejectValue: string }
>("watched/thunks/loadWatchedThunk", async (userId, { rejectWithValue }) => {
  const result = await watchedApi.getWatched(userId);

  if (!result.success) {
    return rejectWithValue(result.error || "Ошибка загрузки просмотренных");
  }

  return result.data || [];
});
