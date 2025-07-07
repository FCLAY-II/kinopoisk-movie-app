export const formatRating = (rating: string | number): string => {
    const numRating = typeof rating === 'string' ? parseFloat(rating) : rating;
    return isNaN(numRating) ? 'Без рейтинга' : numRating.toFixed(1);
};

export const formatYear = (year: string): string => {
    return year ? year.toString() : 'Неизвестно';
};

export const cleanDescription = (description: string): string => {
    if (!description) return '';

    return description
        .replace(/\s+/g, ' ') // Заменяем множественные пробелы на один
        .replace(/\n+/g, ' ') // Заменяем переносы строк на пробелы
        .replace(/\t+/g, ' ') // Заменяем табуляции на пробелы
        .trim();
};

export const truncateDescription = (description: string, maxLength: number = 600): string => {
    if (!description || description.length <= maxLength) return description;

    const truncated = description.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');

    return lastSpace > maxLength * 0.8
        ? truncated.substring(0, lastSpace) + '...'
        : truncated + '...';
};

