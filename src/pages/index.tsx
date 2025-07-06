import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppSelector } from '@/redux/hooks';
import { selectUser, selectAuthChecked } from '@/redux/features/user/userSlice';
import {Loading} from "@/componets/Loading";
import React from 'react';

const HomePage = () => {
  const router = useRouter();
  const user = useAppSelector(selectUser);
  const authChecked = useAppSelector(selectAuthChecked);

  useEffect(() => {
    if (authChecked) {
      if (user) {
        router.replace('/search-movies');
      } else {
        router.replace('/auth');
      }
    }
  }, [user, authChecked, router]);

  return <Loading />;
};

export default HomePage;