import {
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { IMovie } from "@/components/MovieCard/types";
import { WatchedMovie, WatchedApiResult } from "@/types/watched";

const COLLECTION_NAME = "watched";

export const getWatched = async (
  userId: string,
): Promise<WatchedApiResult<WatchedMovie[]>> => {
  try {
    const watchedRef = collection(db, COLLECTION_NAME);
    const q = query(
      watchedRef,
      where("userId", "==", userId),
      orderBy("watchedAt", "desc"),
    );

    const querySnapshot = await getDocs(q);
    const watched: WatchedMovie[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      watched.push({
        ...data,
        watchedAt: data.watchedAt?.toMillis() || Date.now(),
        docId: doc.id,
      } as WatchedMovie);
    });

    return {
      success: true,
      data: watched,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("permission-denied")) {
        return {
          success: false,
          error: "Нет прав доступа к базе данных",
        };
      }
      if (error.message.includes("not-found")) {
        return {
          success: false,
          error: "База данных не найдена",
        };
      }
    }

    return {
      success: false,
      error: `Ошибка при загрузке просмотренных: ${error}`,
    };
  }
};

export const addToWatched = async (
  userId: string,
  movie: IMovie,
): Promise<WatchedApiResult<WatchedMovie>> => {
  try {
    const exists = await isWatched(userId, movie.filmId);
    if (exists) {
      return {
        success: false,
        error: "Фильм уже отмечен как просмотренный",
      };
    }

    const watchedRef = collection(db, COLLECTION_NAME);
    const watchedMovie = {
      ...movie,
      userId,
      watchedAt: serverTimestamp(),
    };

    const docRef = await addDoc(watchedRef, watchedMovie);

    return {
      success: true,
      data: {
        ...watchedMovie,
        watchedAt: Date.now(),
        docId: docRef.id,
      } as WatchedMovie,
    };
  } catch (error) {
    if (error instanceof Error && error.message.includes("permission-denied")) {
      return { success: false, error: "Нет прав для добавления" };
    }

    return {
      success: false,
      error: `Ошибка при добавлении в просмотренные: ${error}`,
    };
  }
};

export const removeFromWatched = async (
  userId: string,
  filmId: number,
): Promise<WatchedApiResult> => {
  try {
    const watchedRef = collection(db, COLLECTION_NAME);
    const q = query(
      watchedRef,
      where("userId", "==", userId),
      where("filmId", "==", filmId),
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return {
        success: false,
        error: "Фильм не найден в просмотренных",
      };
    }

    const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: `Ошибка при удалении из просмотренных: ${error}`,
    };
  }
};

export const isWatched = async (
  userId: string,
  filmId: number,
): Promise<boolean> => {
  try {
    const watchedRef = collection(db, COLLECTION_NAME);
    const q = query(
      watchedRef,
      where("userId", "==", userId),
      where("filmId", "==", filmId),
    );

    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch {
    return false;
  }
};
