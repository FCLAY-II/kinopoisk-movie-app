import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useFavorites';
import MovieCard from '@/components/MovieCard';
import { Loading } from '@/components/Loading';
import { 
  Heart, 
  Search, 
  Filter, 
  Grid,
  List,
  ChevronDown
} from 'lucide-react';
import s from './Favorites.module.scss';

type SortOption = 'addedAt' | 'rating' | 'year' | 'name';
type ViewMode = 'grid' | 'list';

const Favorites: React.FC = () => {
  const { user, authChecked } = useAuth();
  const { favorites, loading, error } = useFavorites();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('addedAt');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Фильтрация и сортировка
  const filteredAndSortedFavorites = React.useMemo(() => {
    // Создаем копию массива для безопасной сортировки
    let filtered = [...favorites];
    
    // Поиск
    if (searchQuery.trim()) {
      filtered = filtered.filter(movie => 
        movie.nameRu?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.nameEn?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Сортировка
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'addedAt': {
          return b.addedAt - a.addedAt;
        }
        case 'rating': {
          const ratingA = parseFloat(a.rating || '0');
          const ratingB = parseFloat(b.rating || '0');
          return ratingB - ratingA;
        }
        case 'year': {
          const yearA = parseInt(a.year || '0');
          const yearB = parseInt(b.year || '0');
          return yearB - yearA;
        }
        case 'name': {
          const nameA = a.nameRu || a.nameEn || '';
          const nameB = b.nameRu || b.nameEn || '';
          return nameA.localeCompare(nameB);
        }
        default: {
          return 0;
        }
      }
    });


    return filtered;
  }, [favorites, searchQuery, sortBy]);

  const getSortLabel = (option: SortOption): string => {
    switch (option) {
      case 'addedAt': return 'Дате добавления';
      case 'rating': return 'Рейтингу';
      case 'year': return 'Году';
      case 'name': return 'Названию';
    }
  };

  if (!user) {
    return (
      <div className={s.errorContainer}>
        <div className={s.errorContent}>
          <Heart size={48} className={s.errorIcon} />
          <h2>Необходима авторизация</h2>
          <p>Для просмотра избранных фильмов нужно войти в аккаунт</p>
        </div>
      </div>
    );
  }

  return (
    <div className={s.favoritesPage}>
      <div className={s.header}>
        <div className={s.titleSection}>
          <h1 className={s.title}>
            <Heart size={28} className={s.heartIcon} />
            Избранные фильмы
          </h1>
          <p className={s.subtitle}>
            {favorites.length > 0 
              ? `У вас ${favorites.length} ${favorites.length === 1 ? 'фильм' : favorites.length < 5 ? 'фильма' : 'фильмов'} в избранном`
              : 'Пока нет избранных фильмов'
            }
          </p>
        </div>
      </div>

      {favorites.length > 0 && (
        <div className={s.controls}>
          <div className={s.searchSection}>
            <div className={s.searchInput}>
              <Search size={20} className={s.searchIcon} />
              <input
                type="text"
                placeholder="Поиск по названию..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className={s.filtersSection}>
            <div className={s.sortDropdown}>
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className={s.sortButton}
              >
                <Filter size={18} />
                По {getSortLabel(sortBy)}
                <ChevronDown size={16} className={showSortMenu ? s.rotated : ''} />
              </button>
              
              {showSortMenu && (
                <div className={s.sortMenu}>
                  {(['addedAt', 'rating', 'year', 'name'] as SortOption[]).map(option => (
                    <button
                      key={option}
                      onClick={() => {
                        setSortBy(option);
                        setShowSortMenu(false);
                      }}
                      className={`${s.sortOption} ${sortBy === option ? s.active : ''}`}
                    >
                      {getSortLabel(option)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className={s.viewToggle}>
              <button
                onClick={() => setViewMode('grid')}
                className={`${s.viewButton} ${viewMode === 'grid' ? s.active : ''}`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`${s.viewButton} ${viewMode === 'list' ? s.active : ''}`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <Loading text="Загрузка избранных фильмов..." />
      )}

      {error && (
        <div className={s.errorContainer}>
          <div className={s.errorContent}>
            <Heart size={48} className={s.errorIcon} />
            <h2>Ошибка загрузки</h2>
            <p>{error}</p>
          </div>
        </div>
      )}

      {!loading && !error && favorites.length === 0 && (
        <div className={s.emptyState}>
          <div className={s.emptyContent}>
            <Heart size={64} className={s.emptyIcon} />
            <h2>Нет избранных фильмов</h2>
            <p>Добавьте фильмы в избранное, чтобы они появились здесь</p>
            <a href="/search-movies" className={s.searchLink}>
              <Search size={20} />
              Найти фильмы
            </a>
          </div>
        </div>
      )}

      {!loading && !error && filteredAndSortedFavorites.length === 0 && searchQuery && (
        <div className={s.emptyState}>
          <div className={s.emptyContent}>
            <Search size={64} className={s.emptyIcon} />
            <h2>Ничего не найдено</h2>
            <p>Попробуйте изменить поисковый запрос</p>
            <button
              onClick={() => setSearchQuery('')}
              className={s.clearButton}
            >
              Очистить поиск
            </button>
          </div>
        </div>
      )}

      {!loading && !error && filteredAndSortedFavorites.length > 0 && (
        <div className={`${s.moviesGrid} ${viewMode === 'list' ? s.listView : ''}`}>
          {filteredAndSortedFavorites.map((movie) => (
            <MovieCard
              key={`favorite-${movie.filmId}-${movie.docId}`}
              movie={movie}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;