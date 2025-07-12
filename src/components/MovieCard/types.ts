export interface MovieCardProps {
  movie: IMovie;
  className?: string;
}

export interface IMovie {
  filmId: number;
  nameRu: string;
  nameEn: string;
  type: 'FILM' | 'TV_SERIES' | 'TV_SHOW' | 'MINI_SERIES';
  year: string;
  description: string;
  filmLength: string;
  countries: {
    country: string;
  }[];
  genres: {
    genre: string;
  }[];
  rating: string;
  ratingVoteCount: number;
  posterUrl: string;
  posterUrlPreview: string;
}