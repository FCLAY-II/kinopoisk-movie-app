// src/components/SearchMovies.tsx
import React, { useState, FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchMovies } from '@/redux/features/movies/moviesSlice';
import styles from './SearchMovies.module.scss';

const SearchMovies: React.FC = () => {
  const [query, setQuery] = useState('');
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.movies);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    dispatch(fetchMovies(query));
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
          disabled={loading}
        >
          {loading ? 'Поиск...' : 'Найти'}
        </button>
      </form>
      
      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}
    </div>
  );
};

export default SearchMovies;