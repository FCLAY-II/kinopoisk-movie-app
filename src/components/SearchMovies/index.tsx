import React, { useState, FormEvent, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearMovies } from "@/redux/features/movies/moviesSlice";
import styles from "./SearchMovies.module.scss";
import { getFilmsByKeyWordsThunk } from "@/redux/features/movies/thunks/getFilmsByKeyWordsThunk";
import { useDebounce } from "@/hooks/useDebounce";

const SearchMovies: React.FC = () => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 1500); // Уменьшил время
  const lastSearchRef = useRef<string>(""); // Отслеживаем последний поиск
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

  // Ручной поиск
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Отменяем дебаунс поиск, если он планировался
    performSearch(query.trim());
  };

  return (
    <div>
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
    </div>
  );
};

export default SearchMovies;
