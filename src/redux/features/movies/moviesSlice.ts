// src/redux/features/movies/moviesSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Movie } from '@/types/movie';
import {kinopoiskService} from "@/services/api/kinopoisk";

interface MoviesState {
  moviesList: Movie[];
  loading: boolean;
  error: string | null;
}

const initialState: MoviesState = {
  moviesList: [],
  loading: false,
  error: null,
};

export const fetchMovies = createAsyncThunk(
  'movies/search',
  async (query: string) => {
    return await kinopoiskService.searchMovies({ query });
  }
);

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    clearMovies: (state) => {
      state.moviesList = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action: PayloadAction<Movie[]>) => {
        state.moviesList = action.payload;
        state.loading = false;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Произошла ошибка при поиске фильмов';
      });
  },
});

export const { clearMovies } = moviesSlice.actions;
export default moviesSlice.reducer;