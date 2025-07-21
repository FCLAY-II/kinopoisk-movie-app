import React, { FC, FormEvent, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserReview } from "@/hooks/useReviews";
import { Star, MessageCircle, Edit2, Trash2 } from "lucide-react";
import { Loading } from "@/components/Loading";
import s from "./UserReview.module.scss";

interface UserReviewProps {
  movieId: number;
  showForm: boolean;
  onCloseForm: () => void;
  onReviewChange?: () => void;
}

const UserReview: FC<UserReviewProps> = ({
  movieId,
  showForm,
  onCloseForm,
  onReviewChange,
}) => {
  const { user } = useAuth();
  const { review, loading, error, saveReview, deleteReview } =
    useUserReview(movieId);

  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (showForm && !review) {
      setRating(0);
      setComment("");
    }
  }, [showForm, review]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || rating === 0 || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await saveReview({
        movieId,
        rating,
        comment: comment.trim(),
      });

      resetForm();
      onCloseForm();
      onReviewChange?.(); // Обновляем статистику
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = () => {
    if (review) {
      setRating(review.rating);
      setComment(review.comment);
      setIsEditing(true);
    }
  };

  const handleDelete = async () => {
    if (!review || !user) return;

    if (window.confirm("Вы уверены, что хотите удалить отзыв?")) {
      await deleteReview();
      onReviewChange?.(); // Обновляем статистику
    }
  };

  const resetForm = () => {
    setRating(0);
    setComment("");
    setHoverRating(0);
    setIsEditing(false);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return <Loading text="Загрузка отзыва..." />;
  }

  if (error) {
    return (
      <div className={s.error}>
        <p>Ошибка: {error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={s.loginPrompt}>
        <MessageCircle size={48} className={s.promptIcon} />
        <p>Войдите в аккаунт, чтобы оставить отзыв</p>
      </div>
    );
  }

  return (
    <div className={s.userReview}>
      {review && !isEditing && (
        <div className={s.existingReview}>
          <div className={s.reviewHeader}>
            <div className={s.reviewRating}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={20}
                  fill={star <= review.rating ? "#fbbf24" : "none"}
                  color={star <= review.rating ? "#fbbf24" : "#d1d5db"}
                />
              ))}
              <span className={s.ratingText}>{review.rating}/5</span>
            </div>
            <div className={s.reviewActions}>
              <button onClick={handleEdit} className={s.editButton}>
                <Edit2 size={16} />
              </button>
              <button onClick={handleDelete} className={s.deleteButton}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          {review.comment && (
            <p className={s.reviewComment}>{review.comment}</p>
          )}

          <div className={s.reviewDate}>
            Отзыв от {formatDate(review.createdAt)} пользователь{" "}
            {review.userDisplayName}
            {review.updatedAt !== review.createdAt && (
              <span> (изменен {formatDate(review.updatedAt)})</span>
            )}
          </div>
        </div>
      )}

      {(showForm || isEditing) && (
        <form onSubmit={handleSubmit} className={s.reviewForm}>
          <div className={s.formGroup}>
            <label className={s.formLabel}>Ваша оценка</label>
            <div className={s.starRating}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={s.starButton}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    size={32}
                    fill={star <= (hoverRating || rating) ? "#fbbf24" : "none"}
                    color={
                      star <= (hoverRating || rating) ? "#fbbf24" : "#d1d5db"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <div className={s.formGroup}>
            <label className={s.formLabel}>Комментарий (необязательно)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Поделитесь своим мнением о фильме..."
              className={s.commentInput}
              rows={4}
              maxLength={1000}
            />
            <div className={s.charCount}>{comment.length}/1000</div>
          </div>

          <div className={s.formActions}>
            <button
              type="button"
              onClick={() => {
                resetForm();
                onCloseForm();
              }}
              className={s.cancelButton}
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={rating === 0 || isSubmitting}
              className={s.submitButton}
            >
              {isSubmitting
                ? "Сохранение..."
                : isEditing
                  ? "Обновить"
                  : "Опубликовать"}
            </button>
          </div>
        </form>
      )}

      {!review && !showForm && (
        <div className={s.noReview}>
          <MessageCircle size={48} className={s.noReviewIcon} />
          <p>Вы еще не оставили отзыв на этот фильм</p>
        </div>
      )}
    </div>
  );
};

export default UserReview;
