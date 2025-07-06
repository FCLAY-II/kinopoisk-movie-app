export interface Movie {
  kinopoiskId: number;
  nameRu: string;
  nameEn?: string;
  year: number;
  posterUrl: string;
  rating?: number;
  description?: string;
}

export interface SearchResponse {
    films: Movie[];
    total: number;
}
