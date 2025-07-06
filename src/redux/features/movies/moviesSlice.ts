import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {IMovie} from "@/componets/MovieCard/types";
import {FetchMoviesResponse, getFilmsByKeyWordsThunk} from "@/redux/features/movies/thunks/getFilmsByKeyWordsThunk";

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
      .addCase(getFilmsByKeyWordsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFilmsByKeyWordsThunk.fulfilled, (state, action: PayloadAction<FetchMoviesResponse>) => {
        state.moviesList = action.payload.movies;
        state.loading = false;
      })
      .addCase(getFilmsByKeyWordsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Произошла ошибка при поиске фильмов';
      });
  },
});

export const { clearMovies, resetMoviesState} = moviesSlice.actions;
export default moviesSlice.reducer;