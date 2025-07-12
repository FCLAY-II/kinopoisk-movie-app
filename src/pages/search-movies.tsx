import React, {useEffect} from 'react';
import { useRouter } from 'next/router';
import { useAppSelector } from '@/redux/hooks';
import SearchMovies from '@/components/SearchMovies';
import MovieList from '@/components/MovieList';
import MainLayout from "@/components/Layout/MainLayout";

const SearchMoviesPage: React.FC = () => {
  const router = useRouter();
  const user = useAppSelector((state) => state.user.user);

  useEffect(() => {
    if (!user) {
      router.push('/auth');
    }
  }, [user, router]);

  if (!user) return null;

  return (
      <MainLayout>
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Поиск фильмов
            </h2>
            <p className="text-gray-600">
              Найдите любимые фильмы и сериалы
            </p>
          </div>
          <SearchMovies />
          <MovieList />
        </div>
      </MainLayout>
  );
};

export default SearchMoviesPage;