import { createAsyncThunk } from '@reduxjs/toolkit';
import { filmSearchService } from '@/services/api/kinopoisk';
import { handleApiError } from '@/services/api/baseApi';
import { IMovie } from '@/componets/MovieCard/types';

export interface FetchMoviesParams {
    query: string;
    page?: number;
}

export interface FetchMoviesResponse {
    movies: IMovie[];
    query: string;
    page: number;
}

export const getFilmsByKeyWordsThunk = createAsyncThunk<
    FetchMoviesResponse,
    FetchMoviesParams,
    { rejectValue: string }
>(
    'movies/thunks/getFilmsByKeyWordsThunk',
    async ({ query, page = 1 }, { rejectWithValue }) => {
        try {
            const movies = await filmSearchService.searchMovies({ query, page });
            
            return {
                movies,
                query,
                page,
            };
        } catch (error) {
            return rejectWithValue(handleApiError(error));
        }
    }
);