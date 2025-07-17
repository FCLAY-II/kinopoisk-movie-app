import { IMovie } from "@/components/MovieCard/types";

export interface WatchedMovie extends IMovie {
  watchedAt: number;
  userId: string;
  docId?: string;
}

export interface WatchedState {
  watched: WatchedMovie[];
  loading: boolean;
  error: string | null;
}

export interface WatchedApiResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
