export const formatRating = (rating: string | number): string => {
    const numRating = typeof rating === 'string' ? parseFloat(rating) : rating;
    return isNaN(numRating) ? 'Без рейтинга' : numRating.toFixed(1);
};

export const formatYear = (year: string): string => {
    return year ? year.toString() : 'Неизвестно';
};