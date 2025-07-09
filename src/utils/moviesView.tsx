import {Eye, Film} from "lucide-react";
import React from "react";

export const getTypeIcon = (type: string) => {
    switch (type) {
        case 'TV_SERIES':
            return <Film size={20} />;
        case 'TV_SHOW':
            return <Eye size={20} />;
        case 'MINI_SERIES':
            return <Film size={20} />;
        default:
            return <Film size={20} />;
    }
};

export const getTypeLabel = (type: string) => {
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

export const getRatingClass = (rating: string) => {
    const numRating = parseFloat(rating);
    if (numRating >= 7) return 'ratingGood';
    if (numRating >= 5) return 'ratingAverage';
    return 'ratingBad';
};