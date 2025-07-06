import {IMovie} from "@/componets/MovieCard/types";

export interface SearchMoviesParams {
    query: string;
    page?: number;
}
export interface SearchResponse {
    keyword: string;
    pagesCount: number;
    searchFilmsCountResult: number;
    films: IMovie[];
}