import { 
  collection, 
  addDoc,
  deleteDoc, 
  getDocs, 
  query, 
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { IMovie } from '@/components/MovieCard/types';
import {FavoriteMovie, FavoritesApiResult} from "@/types/favorites";

const COLLECTION_NAME = 'favorites';

export const getFavorites = async (userId: string): Promise<FavoritesApiResult<FavoriteMovie[]>> => {
  try {
    const favoritesRef = collection(db, COLLECTION_NAME);
    const q = query(
      favoritesRef,
      where('userId', '==', userId),
      orderBy('addedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const favorites: FavoriteMovie[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      favorites.push({
        ...data,
        addedAt: data.addedAt?.toMillis() || Date.now(),
        docId: doc.id
      } as FavoriteMovie);
    });

    return {
      success: true,
      data: favorites
    };
  } catch (error) {
    // Детальная обработка ошибок Firestore
    if (error instanceof Error) {
      if (error.message.includes('permission-denied')) {
        return {
          success: false,
          error: 'Нет прав доступа к базе данных'
        };
      }
      if (error.message.includes('not-found')) {
        return {
          success: false,
          error: 'База данных не найдена'
        };
      }
    }
    
    return {
      success: false,
      error: `Ошибка при загрузке избранного: ${error}`
    };
  }
};

export const addToFavorites = async (userId: string, movie: IMovie): Promise<FavoritesApiResult<FavoriteMovie>> => {
  try {
    console.log('➕ Добавляем в избранное:', { 
      userId, 
      movieId: movie.filmId, 
      movieName: movie.nameRu || movie.nameEn 
    });
    
    // Сначала проверим, нет ли уже такого фильма
    const exists = await isFavorite(userId, movie.filmId);
    if (exists) {
      console.log('⚠️ Фильм уже в избранном');
      return {
        success: false,
        error: 'Фильм уже добавлен в избранное'
      };
    }

    const favoritesRef = collection(db, COLLECTION_NAME);
    const favoriteMovie = {
      ...movie,
      userId,
      addedAt: serverTimestamp()
    };
    
    console.log('📝 Данные для добавления:', {
      filmId: favoriteMovie.filmId,
      nameRu: favoriteMovie.nameRu,
      userId: favoriteMovie.userId
    });
    
    const docRef = await addDoc(favoritesRef, favoriteMovie);
    
    return {
      success: true,
      data: {
        ...favoriteMovie,
        addedAt: Date.now(),
        docId: docRef.id
      } as FavoriteMovie
    };
  } catch (error) {
    console.error('❌ Error adding to favorites:', error);
    
    // Детальная обработка ошибок
    if (error instanceof Error) {
      if (error.message.includes('permission-denied')) {
        return {
          success: false,
          error: 'Нет прав для добавления в избранное'
        };
      }
      if (error.message.includes('invalid-argument')) {
        return {
          success: false,
          error: 'Неверные данные фильма'
        };
      }
    }
    
    return {
      success: false,
      error: `Ошибка при добавлении в избранное: ${error}`
    };
  }
};

export const removeFromFavorites = async (userId: string, filmId: number): Promise<FavoritesApiResult> => {
  try {
    console.log('🗑️ Удаляем из избранного:', { userId, filmId });
    
    const favoritesRef = collection(db, COLLECTION_NAME);
    const q = query(
      favoritesRef,
      where('userId', '==', userId),
      where('filmId', '==', filmId)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log('⚠️ Фильм не найден в избранном');
      return {
        success: false,
        error: 'Фильм не найден в избранном'
      };
    }
    
    // Удаляем все найденные документы
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    console.log('✅ Фильм удален из избранного');
    
    return { success: true };
  } catch (error) {
    console.error('❌ Error removing from favorites:', error);
    return {
      success: false,
      error: `Ошибка при удалении из избранного: ${error}`
    };
  }
};

export const isFavorite = async (userId: string, filmId: number): Promise<boolean> => {
  try {
    const favoritesRef = collection(db, COLLECTION_NAME);
    const q = query(
      favoritesRef,
      where('userId', '==', userId),
      where('filmId', '==', filmId)
    );
    
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('❌ Error checking if favorite:', error);
    return false;
  }
};