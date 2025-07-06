import { kinopoiskApi } from '@/services/api/baseApi';
import { AxiosError } from 'axios';
import { SearchMoviesParams } from '@/services/api/types';
import { IMovie } from '@/componets/MovieCard/types';
import {SearchResponse} from "@/types/movie";



export const filmSearchService = {
    async searchMovies({ query, page = 1 }: SearchMoviesParams): Promise<IMovie[]> {
        try {
            const { data } = await kinopoiskApi.get<SearchResponse>('/search-by-keyword', {
                params: {
                    keyword: query,
                    page,
                },
            });
            return data.films || [];
        } catch (error) {
            if (error instanceof AxiosError) {
                const errorMessage = error.response?.data?.message || 'Произошла ошибка при поиске фильмов';
                const errorStatus = error.response?.status || 500;
                const customError = new Error(errorMessage);
                (customError as any).status = errorStatus;
                
                throw customError;
            }
            throw error;
        }
    },
};