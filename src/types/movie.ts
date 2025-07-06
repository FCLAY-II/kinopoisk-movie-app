import {IMovie} from "@/componets/MovieCard/types";

export interface SearchResponse {
    films: IMovie[];
    total: number;
}
