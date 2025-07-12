import React from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import MainLayout from '@/components/Layout/MainLayout';
import MoviePage from '@/components/MoviePage';
import { IMovie } from '@/components/MovieCard/types';
import {filmSearchService} from "@/services/api/kinopoisk";

interface MoviePageProps {
  movie: IMovie | null;
  error?: string;
}

const MoviePageWrapper: React.FC<MoviePageProps> = ({ movie, error }) => {
  const router = useRouter();

  if (error || !movie) {
    return (
      <MainLayout>
        <div style={{ textAlign: 'center', padding: '48px' }}>
          <h1>Фильм не найден</h1>
          <p>{error || 'Не удалось загрузить информацию о фильме'}</p>
          <button onClick={() => router.back()}>
            Вернуться назад
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <MoviePage movie={movie} />
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const { id } = params!;

    try {
        const movie = await filmSearchService.getMovieById(Number(id));

        return {
            props: {
                movie,
            },
        };
    } catch (error) {
        return {
            props: {
                movie: null,
                error: error instanceof Error ? error.message : 'Ошибка загрузки фильма',
            },
        };
    }
};


export default MoviePageWrapper;