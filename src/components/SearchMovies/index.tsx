import React, { useState, FormEvent, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearMovies } from "@/redux/features/movies/moviesSlice";
import styles from "./SearchMovies.module.scss";
import { getFilmsByKeyWordsThunk } from "@/redux/features/movies/thunks/getFilmsByKeyWordsThunk";
import { useDebounce } from "@/hooks/useDebounce";
import MovieList from "@/components/MovieList";

const SearchMovies: React.FC = () => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 1500);
  const lastSearchRef = useRef<string>("");
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.movies);

  // Функция для выполнения поиска
  const performSearch = (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery === lastSearchRef.current) {
      return;
    }
    lastSearchRef.current = searchQuery;
    dispatch(clearMovies());
    dispatch(getFilmsByKeyWordsThunk({ query: searchQuery.trim() }));
  };

  // Дебаунс поиск
  useEffect(() => {
    if (debouncedQuery.trim()) {
      performSearch(debouncedQuery);
    }
  }, [debouncedQuery]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Отменяем дебаунс поиск, если он планировался
    performSearch(query.trim());
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>Поиск фильмов</h2>
        <p className={styles.subtitle}>Найдите любимые фильмы и сериалы</p>
      </div>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск фильмов..."
          className={styles.inputField}
          disabled={loading}
        />
        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading || !query.trim()}
        >
          {loading ? "Поиск..." : "Найти"}
        </button>
      </form>
      <MovieList />
    </div>
  );
};

export default SearchMovies;
