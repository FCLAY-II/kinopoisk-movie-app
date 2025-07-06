import React from 'react';
import { useRouter } from 'next/router';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import SearchMovies from '@/componets/SearchMovies';
import MovieList from '@/componets/MovieList';
import { clearUser } from '@/redux/features/user/userSlice';
import { handleSignOut } from '@/lib/firebase';

const SearchMoviesPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);

  React.useEffect(() => {
    if (!user) {
      router.push('/auth');
    }
  }, [user, router]);

  const handleSignOutClick = async () => {
    try {
      await handleSignOut();
      dispatch(clearUser());
      router.push('/auth');
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Поиск фильмов</h1>
        <button
          onClick={handleSignOutClick}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          Выйти
        </button>
      </div>
      <SearchMovies />
      <MovieList />
    </div>
  );
};

export default SearchMoviesPage;