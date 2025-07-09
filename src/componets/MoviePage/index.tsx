import React, {useRef, useState} from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useFavorites';
import {
  Star, 
  Calendar, 
  Clock, 
  Globe, 
  Heart, 
  MessageCircle, 
  Share2,
  ArrowLeft,
  Film,
  Eye,
} from 'lucide-react';
import { IMovie } from '@/componets/MovieCard/types';
import { formatRating, formatYear, cleanDescription } from '@/utils/common';
import s from './MoviePage.module.scss';
import cn from "classnames";
import ReviewStats from "@/componets/MoviePage/components/ReviewStats";
import UserReview from "@/componets/MoviePage/components/UserReview";
import {getRatingClass, getTypeIcon, getTypeLabel} from "@/utils/moviesView";

interface MoviePageProps {
  movie: IMovie;
}

const MoviePage: React.FC<MoviePageProps> = ({ movie }) => {
  const router = useRouter();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const reviewRef = useRef<HTMLDivElement | null>(null);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [statsKey, setStatsKey] = useState(0);

    const handleReviewChange = () => {
        setStatsKey(prev => prev + 1); // Принудительно обновляем статистику
    };

    const scrollToReview = () => {
    setShowReviewForm(true);
    setTimeout(() => {
      reviewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };


    const handleFavoriteToggle = async () => {
    if (isTogglingFavorite || !user) return;

    setIsTogglingFavorite(true);
    try {
      await toggleFavorite(movie);
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: movie.nameRu || movie.nameEn,
          text: `Посмотрите этот фильм: ${movie.nameRu || movie.nameEn}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Sharing failed:', error);
      }
    } else {
      // Fallback - копируем URL в буфер обмена
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  const cleanedDescription = cleanDescription(movie.description);
  const isMovieFavorite = isFavorite(movie.filmId);

  return (
    <div className={s.moviePage}>
      {/* Кнопка "Назад" */}
      <button 
        onClick={() => router.back()}
        className={s.backButton}
      >
        <ArrowLeft size={20} />
        Назад
      </button>

      {/* Основная информация */}
      <div className={s.movieHeader}>
        <div className={s.posterSection}>
          <div className={s.posterWrapper}>
            {!imageLoaded && (
              <div className={s.posterSkeleton}>
                <div className={s.skeletonLoader}></div>
              </div>
            )}
            <img
              src={movie.posterUrl}
              alt={movie.nameRu || movie.nameEn}
              className={s.posterImage}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
            />
            
            {/* Рейтинг на постере */}
            {movie.rating && (
              <div className={`${s.posterRating} ${getRatingClass(movie.rating)}`}>
                <Star size={16} fill="currentColor" />
                <span>{formatRating(movie.rating)}</span>
              </div>
            )}
          </div>
        </div>

        <div className={s.movieInfo}>
          <div className={s.titleSection}>
            <h1 className={s.title}>{movie.nameRu || movie.nameEn}</h1>
            {movie.nameRu && movie.nameEn && (
              <p className={s.originalTitle}>{movie.nameEn}</p>
            )}
            
            <div className={s.typeAndYear}>
              <span className={s.typeLabel}>
                {getTypeIcon(movie.type)}
                {getTypeLabel(movie.type)}
              </span>
              <span className={s.year}>
                <Calendar size={16} />
                {formatYear(movie.year)}
              </span>
            </div>
          </div>

          {/* Метаданные */}
          <div className={s.metadata}>
            {movie.filmLength && (
              <div className={s.metaItem}>
                <Clock size={16} />
                <span>{movie.filmLength}</span>
              </div>
            )}
            
            {movie.countries && movie.countries.length > 0 && (
              <div className={s.metaItem}>
                <Globe size={16} />
                <span>{movie.countries.map(c => c.country).join(', ')}</span>
              </div>
            )}
          </div>

          {/* Жанры */}
          {movie.genres && movie.genres.length > 0 && (
            <div className={s.genres}>
              {movie.genres.map((genre, index) => (
                <span key={index} className={s.genre}>
                  {genre.genre}
                </span>
              ))}
            </div>
          )}

          {/* Действия */}
          <div className={s.actions}>
            <button
              onClick={handleFavoriteToggle}
              disabled={isTogglingFavorite || !user}
              className={`${s.actionButton} ${s.favoriteButton} ${isMovieFavorite ? s.active : ''}`}
            >
              <Heart 
                size={20} 
                fill={isMovieFavorite ? 'currentColor' : 'none'}
              />
              {isMovieFavorite ? 'В избранном' : 'В избранное'}
            </button>

            <button
              onClick={scrollToReview}
              disabled={!user}
              className={cn(s.actionButton, s.reviewButton)}
            >
              <MessageCircle size={20} />
              Оставить отзыв
            </button>

            <button
              onClick={handleShare}
              className={`${s.actionButton} ${s.shareButton}`}
            >
              <Share2 size={20} />
              Поделиться
            </button>
          </div>
        </div>
      </div>

      {/* Описание */}
      {cleanedDescription && (
        <div className={s.descriptionSection}>
          <h2 className={s.sectionTitle}>Описание</h2>
          <p className={s.description}>{cleanedDescription}</p>
        </div>
      )}

      {/* Рейтинг и статистика */}
      <div className={s.ratingSection}>
        <h2 className={s.sectionTitle}>Рейтинг</h2>
        <div className={s.ratingStats}>
          <div className={s.officialRating}>
            <div className={`${s.ratingBadge} ${getRatingClass(movie.rating)}`}>
              <Star size={24} fill="currentColor" />
              <span className={s.ratingValue}>{formatRating(movie.rating)}</span>
            </div>
            <div className={s.ratingInfo}>
              <p className={s.ratingLabel}>Официальный рейтинг</p>
              {movie.ratingVoteCount > 0 && (
                <p className={s.voteCount}>
                  {movie.ratingVoteCount.toLocaleString()} голосов
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
        <ReviewStats key={statsKey} movieId={movie.filmId} />

        {/* Отзывы пользователей */}
      <div className={s.reviewsSection} ref={reviewRef}>
        <h2 className={s.sectionTitle}>Мой отзыв</h2>
        <UserReview 
          movieId={movie.filmId}
          showForm={showReviewForm}
          onCloseForm={() => setShowReviewForm(false)}
          onReviewChange={handleReviewChange}
        />
      </div>
    </div>
  );
};

export default MoviePage;