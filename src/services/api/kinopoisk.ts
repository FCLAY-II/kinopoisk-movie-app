import {kinopoiskApi} from '@/services/api/baseApi';
import {Movie, SearchResponse} from '@/types/movie';
import {AxiosError} from 'axios';
import {SearchMoviesParams} from "@/services/api/types";


export const kinopoiskService = {
    async searchMovies({ query, page = 1 }: SearchMoviesParams): Promise<Movie[]> {
        try {
            const { data } = await kinopoiskApi.get<SearchResponse>('/search-by-keyword', {
                params: {
                    keyword: query,
                    page,
                },
            });

            if (!data.films.length) {
                throw new Error('Нет результатов поиска');
            }

            return data.films;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw {
                    message: error.response?.data?.message || 'Произошла ошибка при поиске фильмов',
                    status: error.response?.status || 500,
                };
            }
            throw error;
        }
    },
};