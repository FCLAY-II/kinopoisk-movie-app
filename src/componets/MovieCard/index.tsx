import React, { useState } from 'react';
import s from './MovieCard.module.scss';
import {MovieCardProps} from "@/componets/MovieCard/types";

const MovieCard = ({ movie }: MovieCardProps) => {
    const [loading, setLoading] = useState(true);

    const handleImageLoad = () => {
        setLoading(false);  // Когда картинка загружена, убираем лоадер
    };

    return (
        <div className={s.card}>
            <div className={s.imageWrapper}>
                {loading && (
                    <div className={s.loader}></div>
                )}
                <img
                    className={s.posterImage}
                    src={movie.posterUrl}
                    alt={movie.nameRu}
                    onLoad={handleImageLoad}
                    sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
                    srcSet={`${movie.posterUrl} 500w`}
                />
            </div>

            <div className={s.cardContent}>
                <h3 className={s.title}>{movie.nameRu || movie.nameEn}</h3>
                <p className={s.releaseDate}>{movie.year}</p>
                <p className={s.description}>{movie.description}</p>
                <div className={s.rating}>
                    <span className={s.voteAverage}>{movie.rating}</span>
                    <span className={s.voteCount}>({movie.ratingVoteCount} голосов)</span>
                </div>
            </div>
        </div>
    );
};

export default MovieCard;
