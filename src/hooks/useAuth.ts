// src/hooks/useAuth.ts
import { useEffect } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { setUser, clearUser } from '@/redux/features/user/userSlice';
import type { User } from '@/types/user';
import {subscribeToAuthState} from "@/lib/firebase/auth";


export const useAuth = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = subscribeToAuthState((firebaseUser) => {
      if (firebaseUser) {
        const userData: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || undefined,
          photoURL: firebaseUser.photoURL || undefined,
        };
        dispatch(setUser(userData));
      } else {
        dispatch(clearUser());
      }
    });

    // Очистка подписки при размонтировании
    return () => unsubscribe();
  }, [dispatch]);
};