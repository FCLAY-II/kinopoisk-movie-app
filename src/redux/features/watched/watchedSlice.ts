import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WatchedState } from "@/types/watched";
import { loadWatchedThunk } from "./thunks/loadWatchedThunk";
import { addToWatchedThunk } from "./thunks/addToWatchedThunk";
import { removeFromWatchedThunk } from "./thunks/removeFromWatchedThunk";

interface ExtendedWatchedState extends WatchedState {
  isLoaded: boolean;
}

const initialState: ExtendedWatchedState = {
  watched: [],
  loading: false,
  error: null,
  isLoaded: false,
};

const watchedSlice = createSlice({
  name: "watched",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearWatched: (state) => {
      state.watched = [];
      state.loading = false;
      state.error = null;
      state.isLoaded = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadWatchedThunk.pending, (state) => {
        if (!state.isLoaded) {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(loadWatchedThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.watched = action.payload;
        state.error = null;
        state.isLoaded = true;
      })
      .addCase(loadWatchedThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка загрузки просмотренных";
        state.isLoaded = true;
      });

    builder
      .addCase(addToWatchedThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(addToWatchedThunk.fulfilled, (state, action) => {
        const exists = state.watched.some(
          (item) => item.filmId === action.payload.filmId,
        );
        if (!exists) {
          state.watched.unshift(action.payload);
        }
        state.error = null;
      })
      .addCase(addToWatchedThunk.rejected, (state, action) => {
        state.error = action.payload || "Ошибка добавления";
      });

    builder
      .addCase(removeFromWatchedThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(removeFromWatchedThunk.fulfilled, (state, action) => {
        state.watched = state.watched.filter(
          (item) => item.filmId !== action.payload,
        );
        state.error = null;
      })
      .addCase(removeFromWatchedThunk.rejected, (state, action) => {
        state.error = action.payload || "Ошибка удаления";
      });
  },
});

export const { setLoading, setError, clearWatched } = watchedSlice.actions;

export default watchedSlice.reducer;

export const selectWatched = (state: { watched: ExtendedWatchedState }) =>
  state.watched.watched;
export const selectWatchedLoading = (state: {
  watched: ExtendedWatchedState;
}) => state.watched.loading;
export const selectWatchedError = (state: { watched: ExtendedWatchedState }) =>
  state.watched.error;
export const selectWatchedCount = (state: { watched: ExtendedWatchedState }) =>
  state.watched.watched.length;
