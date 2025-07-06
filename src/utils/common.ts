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
        .replace(/\s+/g, ' ')           // Заменяем множественные пробелы на один
        .replace(/\n+/g, ' ')          // Заменяем переносы строк на пробелы
        .replace(/\t+/g, ' ')          // Заменяем табуляции на пробелы
        .trim();                       // Убираем пробелы в начале и конце
};
