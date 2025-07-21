import React from "react";
import MovieCard from "../MovieCard";
import { useAppSelector } from "@/redux/hooks";
import { IMovie } from "@/components/MovieCard/types";
import s from "./MovieList.module.scss";

const MovieList = () => {
  const { moviesList, searchQuery, loading, error } = useAppSelector(
    (state) => state.movies,
  );

  if (loading) {
    return (
      <div className={s.loading}>
        <div className={s.loaderSpinner}></div>
        <span className={s.loadingText}>Загрузка...</span>
      </div>
    );
  }

  if (error) {
    return <div className={s.error}>{error}</div>;
  }

  if (moviesList.length === 0 && searchQuery) {
    return (
      <div className={s.emptyState}>
        <div className={s.emptyStateIcon}>🎬</div>
        <div className={s.emptyStateTitle}>Фильмы не найдены</div>
        <div className={s.emptyStateDescription}>
          По запросу {searchQuery} ничего не найдено. Попробуйте изменить
          поисковый запрос.
        </div>
      </div>
    );
  }

  return (
    <div className={s.gridContainer}>
      {moviesList.map((movie: IMovie) => {
        return <MovieCard key={movie.filmId} movie={movie} />;
      })}
    </div>
  );
};

export default MovieList;
