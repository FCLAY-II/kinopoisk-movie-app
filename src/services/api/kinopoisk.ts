import {handleApiError, kinopoiskApi} from '@/services/api/baseApi';
import { AxiosError } from 'axios';
import { SearchMoviesParams } from '@/services/api/types';
import { IMovie } from '@/componets/MovieCard/types';
import {SearchResponse} from "@/types/movie";



export const filmSearchService = {
    async searchMovies({ query, page = 1 }: SearchMoviesParams): Promise<IMovie[]> {
        try {
            const { data } = await kinopoiskApi.get<SearchResponse>('/api/v2.1/films/search-by-keyword', {
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
    async getMovieById(id: number): Promise<IMovie> {
        try {
            const { data } = await kinopoiskApi.get(`/api/v2.2/films/${id}`);
            return {
                filmId: data.kinopoiskId,
                nameRu: data.nameRu,
                nameEn: data.nameEn,
                type: data.type,
                year: data.year?.toString() || '',
                description: data.description,
                filmLength: data.filmLength ? `${data.filmLength} мин` : '',
                countries: data.countries || [],
                genres: data.genres || [],
                rating: data.ratingKinopoisk?.toString() || '',
                ratingVoteCount: data.ratingKinopoiskVoteCount || 0,
                posterUrl: data.posterUrl,
                posterUrlPreview: data.posterUrlPreview,
            };
        } catch (error) {
            throw handleApiError(error); // у тебя уже есть такая функция
        }
    }
};