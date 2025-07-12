import { IMovie } from "@/components/MovieCard/types";

export interface SearchResponse {
  films: IMovie[];
  total: number;
}
