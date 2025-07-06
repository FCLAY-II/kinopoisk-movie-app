import React, {useState, FormEvent, useEffect} from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {clearMovies} from '@/redux/features/movies/moviesSlice';
import styles from './SearchMovies.module.scss';
import {getFilmsByKeyWordsThunk} from "@/redux/features/movies/thunks/getFilmsByKeyWordsThunk";
import {useDebounce} from "@/hooks/useDebounce";

const SearchMovies: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isManualSearch, setIsManualSearch] = useState(false);
  const debouncedQuery = useDebounce(query, 3000);
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector(state => state.movies);

  useEffect(() => {
    if (debouncedQuery.trim() && !isManualSearch) {
      dispatch(clearMovies());
      dispatch(getFilmsByKeyWordsThunk({ query: debouncedQuery.trim() }));
    }
    setIsManualSearch(false);
  }, [debouncedQuery, dispatch, isManualSearch]);


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsManualSearch(true);
    dispatch(clearMovies());
    dispatch(getFilmsByKeyWordsThunk({ query: query.trim() }));
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
    </div>
  );
};

export default SearchMovies;