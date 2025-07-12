import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FavoritesState } from "@/types/favorites";
import { loadFavoritesThunk } from "@/redux/features/favorites/thunks/loadFavoritesThunk";
import { addToFavoritesThunk } from "@/redux/features/favorites/thunks/addToFavoritesThunk";
import { removeFromFavoritesThunk } from "@/redux/features/favorites/thunks/removeFromFavoritesThunk";

interface ExtendedFavoritesState extends FavoritesState {
  isLoaded: boolean;
}

const initialState: ExtendedFavoritesState = {
  favorites: [],
  loading: false,
  error: null,
  isLoaded: false,
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearFavorites: (state) => {
      state.favorites = [];
      state.loading = false;
      state.error = null;
      state.isLoaded = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFavoritesThunk.pending, (state) => {
        // Показываем лоадер только при первой загрузке
        if (!state.isLoaded) {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(loadFavoritesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites = action.payload;
        state.error = null;
        state.isLoaded = true;
      })
      .addCase(loadFavoritesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка загрузки избранного";
        state.isLoaded = true;
      });

    builder
      .addCase(addToFavoritesThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(addToFavoritesThunk.fulfilled, (state, action) => {
        const exists = state.favorites.some(
          (fav) => fav.filmId === action.payload.filmId,
        );
        if (!exists) {
          state.favorites.unshift(action.payload);
        }
        state.error = null;
      })
      .addCase(addToFavoritesThunk.rejected, (state, action) => {
        state.error = action.payload || "Ошибка добавления в избранное";
      });

    builder
      .addCase(removeFromFavoritesThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(removeFromFavoritesThunk.fulfilled, (state, action) => {
        state.favorites = state.favorites.filter(
          (fav) => fav.filmId !== action.payload,
        );
        state.error = null;
      })
      .addCase(removeFromFavoritesThunk.rejected, (state, action) => {
        state.error = action.payload || "Ошибка удаления из избранного";
      });
  },
});

export const { setLoading, setError, clearFavorites } = favoritesSlice.actions;

export default favoritesSlice.reducer;

// Селекторы
export const selectFavorites = (state: { favorites: ExtendedFavoritesState }) =>
  state.favorites.favorites;
export const selectFavoritesLoading = (state: {
  favorites: ExtendedFavoritesState;
}) => state.favorites.loading;
export const selectFavoritesError = (state: {
  favorites: ExtendedFavoritesState;
}) => state.favorites.error;
export const selectFavoritesCount = (state: {
  favorites: ExtendedFavoritesState;
}) => state.favorites.favorites.length;
