import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {filmSearchService} from "@/services/api/kinopoisk";
import {IMovie} from "@/componets/MovieCard/types";

interface MoviesState {
  moviesList: IMovie[];
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
    return await filmSearchService.searchMovies({ query });
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
    resetMoviesState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action: PayloadAction<IMovie[]>) => {
        state.moviesList = action.payload;
        state.loading = false;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Произошла ошибка при поиске фильмов';
      });
  },
});

export const { clearMovies, resetMoviesState} = moviesSlice.actions;
export default moviesSlice.reducer;