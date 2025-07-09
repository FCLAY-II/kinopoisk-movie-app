import React, { useState, memo } from 'react';
import { Star, Calendar, Film, Eye, Clock, Heart } from 'lucide-react';
import s from './MovieCard.module.scss';
import { MovieCardProps } from "@/componets/MovieCard/types";
import { formatRating, formatYear, cleanDescription, truncateDescription } from "@/utils/common";
import { useFavorites } from "@/hooks/useFavorites";
import {useRouter} from "next/router";
import cn from 'classnames';

const MovieCard = memo(({ movie, className }: MovieCardProps) => {
    const router = useRouter();
    const { isFavorite, toggleFavorite } = useFavorites();
    const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    const handleCardClick = () => {
        router.push(`/movie/${movie.filmId}`);
    };


    const handleFavoriteClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isTogglingFavorite) return;

        setIsTogglingFavorite(true);
        try {
            await toggleFavorite(movie);
        } finally {
            setIsTogglingFavorite(false);
        }
    };

    const handleImageLoad = () => {
        setImageLoading(false);
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'TV_SERIES':
                return <Film size={14} />;
            case 'TV_SHOW':
                return <Eye size={14} />;
            case 'MINI_SERIES':
                return <Film size={14} />;
            default:
                return <Film size={14} />;
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'TV_SERIES':
                return 'Сериал';
            case 'TV_SHOW':
                return 'Шоу';
            case 'MINI_SERIES':
                return 'Мини-сериал';
            default:
                return 'Фильм';
        }
    };

    const getRatingClass = (rating: string) => {
        const numRating = parseFloat(rating);
        if (numRating >= 7) return s.ratingGood;
        if (numRating >= 5) return s.ratingAverage;
        return s.ratingBad;
    };

    // Очищаем описание от лишних пробелов
    const cleanedDescription = cleanDescription(movie.description);
    
    // Проверяем является ли фильм избранным
    const isMovieFavorite = isFavorite(movie.filmId);

    return (
        <div className={cn(s.card, className)} onClick={handleCardClick}>
            <div className={s.imageWrapper}>
                {imageLoading && (
                    <div className={s.loader}>
                        <div className={s.loaderSpinner}></div>
                    </div>
                )}
                
                <img
                    className={s.posterImage}
                    src={movie.posterUrl}
                    alt={movie.nameRu || movie.nameEn}
                    onLoad={handleImageLoad}
                    onError={handleImageLoad}
                    loading="lazy"
                    sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
                />

                {/* Кнопка избранного */}
                <button
                    onClick={handleFavoriteClick}
                    disabled={isTogglingFavorite}
                    className={`${s.favoriteButton} ${isMovieFavorite ? s.active : ''} ${isTogglingFavorite ? s.loading : ''}`}
                    title={isMovieFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
                    aria-label={isMovieFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
                >
                    <Heart
                        size={20}
                        className={s.heartIcon}
                        fill={isMovieFavorite ? 'currentColor' : 'none'}
                    />
                </button>

                {/* Оверлей с типом контента */}
                <div className={s.typeOverlay}>
                    {getTypeIcon(movie.type)}
                    <span>{getTypeLabel(movie.type)}</span>
                </div>

                {/* Рейтинг в углу */}
                {movie.rating && (
                    <div className={`${s.ratingBadge} ${getRatingClass(movie.rating)}`}>
                        <Star size={12} className={s.starIcon} />
                        <span>{formatRating(movie.rating)}</span>
                    </div>
                )}

                {/* Продолжительность */}
                {movie.filmLength && (
                    <div className={s.durationBadge}>
                        <Clock size={12} />
                        <span>{movie.filmLength}</span>
                    </div>
                )}
            </div>

            <div className={s.cardContent}>
                <h3 className={s.title}>{movie.nameRu || movie.nameEn}</h3>
                
                <div className={s.metadata}>
                    <div className={s.year}>
                        <Calendar size={14} />
                        <span>{formatYear(movie.year)}</span>
                    </div>
                    
                    {movie.countries && movie.countries.length > 0 && (
                        <div className={s.country}>
                            <span>{movie.countries[0].country}</span>
                        </div>
                    )}
                </div>

                {movie.genres && movie.genres.length > 0 && (
                    <div className={s.genres}>
                        {movie.genres.slice(0, 3).map((genre, index) => (
                            <span key={index} className={s.genre}>
                                {genre.genre}
                            </span>
                        ))}
                        {movie.genres.length > 3 && (
                            <span className={s.genreMore}>+{movie.genres.length - 3}</span>
                        )}
                    </div>
                )}

                {cleanedDescription && (
                    <div className={s.descriptionWrapper}>
                        <p className={s.description}>
                            {truncateDescription(cleanedDescription, 100)}
                        </p>
                        {/* Десктопный тултип */}
                        <div className={s.descriptionTooltip}>
                            <div className={s.tooltipContent}>
                                <h4 className={s.tooltipTitle}>{movie.nameRu || movie.nameEn}</h4>
                                <p className={s.tooltipDescription}>{cleanedDescription}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});

MovieCard.displayName = 'MovieCard';

export default MovieCard;