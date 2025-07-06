import React, { useState } from 'react';
import { Star, Calendar, Film, Eye, Clock } from 'lucide-react';
import s from './MovieCard.module.scss';
import {MovieCardProps} from "@/componets/MovieCard/types";
import {formatRating, formatYear, cleanDescription} from "@/utils/common";

const MovieCard = ({ movie }: MovieCardProps) => {
    const [imageLoading, setImageLoading] = useState(true);

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

    return (
        <div className={s.card}>
            <div className={s.imageWrapper}>
                {imageLoading && (
                    <div className={s.loader}>
                        <div className={s.loaderSpinner}></div>
                    </div>
                )}
                
                <img
                    className={s.posterImage}
                    src={movie.posterUrl}
                    alt={movie.nameRu}
                    onLoad={handleImageLoad}
                    onError={handleImageLoad}
                    sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
                    srcSet={`${movie.posterUrl} 500w`}
                />

                {/* Оверлей с типом контента */}
                <div className={s.typeOverlay}>
                    {getTypeIcon(movie.type)}
                    <span>{getTypeLabel(movie.type)}</span>
                </div>

                {/* Рейтинг в углу */}
                <div className={`${s.ratingBadge} ${getRatingClass(movie.rating)}`}>
                    <Star size={12} />
                    <span>{formatRating(movie.rating)}</span>
                </div>

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
                    
                    {movie.countries.length > 0 && (
                        <div className={s.country}>
                            <span>{movie.countries[0].country}</span>
                        </div>
                    )}
                </div>

                {movie.genres.length > 0 && (
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
                            {cleanedDescription}
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
};

export default MovieCard;