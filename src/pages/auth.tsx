import React from 'react';
import AuthForm from '@/componets/Auth';
import { useRouter } from 'next/router';
import { useAppSelector } from '@/redux/hooks';

const AuthPage: React.FC = () => {
  const router = useRouter();
  const user = useAppSelector((state) => state.user.user);

  React.useEffect(() => {
    if (user) {
      router.push('/search-movies');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          Добро пожаловать
        </h1>
        <AuthForm />
      </div>
    </div>
  );
};

export default AuthPage;