import React from 'react';
import MovieCard from '../MovieCard';
import { useAppSelector } from '@/redux/hooks';
import {IMovie} from "@/components/MovieCard/types";
import s from './MovieList.module.scss';

const MovieList = () => {
  const { moviesList, searchQuery, loading, error } = useAppSelector((state) => state.movies);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Загрузка...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-500">
        {error}
      </div>
    );
  }

  if (moviesList.length === 0 && searchQuery) {
    return (
        <div className={s.emptyState}>
          <div className={s.emptyStateIcon}>🎬</div>
          <div className={s.emptyStateTitle}>
            Фильмы не найдены
          </div>
          <div className={s.emptyStateDescription}>
            По запросу {searchQuery} ничего не найдено. Попробуйте изменить поисковый запрос.
          </div>
        </div>
    );
  }


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {moviesList.map((movie: IMovie) => {
        return (
          <MovieCard
            key={movie.filmId}
            movie={movie}
          />
        );
      })}
    </div>
  );
};

export default MovieList;
