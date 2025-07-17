import { useEffect, useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectUser } from "@/redux/features/user/userSlice";
import {
  selectWatched,
  selectWatchedLoading,
  selectWatchedError,
  selectWatchedCount,
} from "@/redux/features/watched/watchedSlice";
import { IMovie } from "@/components/MovieCard/types";
import { loadWatchedThunk } from "@/redux/features/watched/thunks/loadWatchedThunk";
import { addToWatchedThunk } from "@/redux/features/watched/thunks/addToWatchedThunk";
import { removeFromWatchedThunk } from "@/redux/features/watched/thunks/removeFromWatchedThunk";

export const useWatched = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const watched = useAppSelector(selectWatched);
  const loading = useAppSelector(selectWatchedLoading);
  const error = useAppSelector(selectWatchedError);
  const count = useAppSelector(selectWatchedCount);

  const userId = useMemo(() => user?.uid || null, [user?.uid]);

  useEffect(() => {
    if (userId) {
      dispatch(loadWatchedThunk(userId));
    }
  }, [dispatch, userId]);

  const addToWatched = useCallback(
    async (movie: IMovie): Promise<boolean> => {
      if (!userId) return false;
      try {
        await dispatch(addToWatchedThunk({ userId, movie })).unwrap();
        return true;
      } catch {
        return false;
      }
    },
    [dispatch, userId],
  );

  const removeFromWatched = useCallback(
    async (filmId: number): Promise<boolean> => {
      if (!userId) return false;
      try {
        await dispatch(removeFromWatchedThunk({ userId, filmId })).unwrap();
        return true;
      } catch {
        return false;
      }
    },
    [dispatch, userId],
  );

  const isWatched = useCallback(
    (filmId: number): boolean => {
      return watched.some((item) => item.filmId === filmId);
    },
    [watched],
  );

  const toggleWatched = useCallback(
    async (movie: IMovie): Promise<boolean> => {
      if (isWatched(movie.filmId)) {
        return await removeFromWatched(movie.filmId);
      } else {
        return await addToWatched(movie);
      }
    },
    [isWatched, addToWatched, removeFromWatched],
  );

  return {
    watched,
    loading,
    error,
    count,
    addToWatched,
    removeFromWatched,
    isWatched,
    toggleWatched,
  };
};
