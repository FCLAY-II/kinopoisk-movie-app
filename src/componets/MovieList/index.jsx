import React from 'react';
import { useSelector } from 'react-redux';
import MovieCard from '../MovieCard';

const MovieList = () => {
  const movies = useSelector((state) => state.movies.moviesList);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {movies.map((movie) => {
        return (
          <MovieCard
            key={movie.id}
            movie={movie}
          />
        );
      })}
    </div>
  );
};

export default MovieList;
