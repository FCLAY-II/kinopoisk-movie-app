import React from 'react';
import MovieCard from '../MovieCard';
import { useAppSelector } from '@/redux/hooks';
import {IMovie} from "@/componets/MovieCard/types";

const MovieList = () => {
  const { moviesList, loading, error } = useAppSelector((state) => state.movies);

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
