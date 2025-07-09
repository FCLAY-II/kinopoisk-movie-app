import React from 'react';
import { Star, Users } from 'lucide-react';
import { useMovieReviews } from '@/hooks/useReviews';
import { Loading } from '@/componets/Loading';
import s from './ReviewStats.module.scss';

interface ReviewStatsProps {
    movieId: number;
}

const ReviewStats: React.FC<ReviewStatsProps> = ({ movieId }) => {
    const { stats, loading, error } = useMovieReviews(movieId);

    if (loading) {
        return <Loading text="Загрузка отзывов..." />;
    }

    if (error || !stats) {
        return null;
    }

    if (stats.totalReviews === 0) {
        return (
            <div className={s.noReviews}>
                <p>Пока нет отзывов от пользователей</p>
            </div>
        );
    }

    const getRatingWidth = (count: number) => {
        return (count / stats.totalReviews) * 100;
    };

    return (
        <div className={s.reviewStats}>
            <div className={s.overallRating}>
                <div className={s.ratingValue}>
                    <Star size={32} fill="#fbbf24" color="#fbbf24" />
                    <span className={s.rating}>{stats.averageRating.toFixed(1)}</span>
                </div>
                <div className={s.ratingInfo}>
                    <p className={s.totalReviews}>
                        <Users size={16} />
                        {stats.totalReviews} {stats.totalReviews === 1 ? 'отзыв' : 'отзывов'}
                    </p>
                </div>
            </div>

            <div className={s.ratingDistribution}>
                {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className={s.ratingRow}>
                        <div className={s.ratingLabel}>
                            <Star size={16} fill="#fbbf24" color="#fbbf24" />
                            <span>{rating}</span>
                        </div>
                        <div className={s.ratingBar}>
                            <div
                                className={s.ratingFill}
                                style={{ width: `${getRatingWidth(stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution])}%` }}
                            />
                        </div>
                        <span className={s.ratingCount}>
              {stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution]}
            </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewStats;