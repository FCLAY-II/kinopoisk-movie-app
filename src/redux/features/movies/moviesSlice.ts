import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {IMovie} from "@/components/MovieCard/types";
import {FetchMoviesResponse, getFilmsByKeyWordsThunk} from "@/redux/features/movies/thunks/getFilmsByKeyWordsThunk";

interface MoviesState {
  moviesList: IMovie[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
}

const initialState: MoviesState = {
  moviesList: [],
  loading: false,
  error: null,
  searchQuery: '',
};

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    clearMovies: (state) => {
      state.moviesList = [];
      state.error = null;
      state.searchQuery = '';
    },
    resetMoviesState: () => initialState,
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFilmsByKeyWordsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFilmsByKeyWordsThunk.fulfilled, (state, action: PayloadAction<FetchMoviesResponse>) => {
        state.loading = false;
        state.moviesList = action.payload.movies;
        state.searchQuery = action.payload.query;
      })
      .addCase(getFilmsByKeyWordsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Произошла ошибка при поиске фильмов';
      });
  },
});

export const { clearMovies, resetMoviesState, setLoading} = moviesSlice.actions;
export default moviesSlice.reducer;