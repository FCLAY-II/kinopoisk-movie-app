import { IMovie } from "@/components/MovieCard/types";

export interface FavoriteMovie extends IMovie {
  addedAt: number;
  userId: string;
  docId?: string;
}

export interface FavoritesState {
  favorites: FavoriteMovie[];
  loading: boolean;
  error: string | null;
}

export interface FavoritesApiResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
