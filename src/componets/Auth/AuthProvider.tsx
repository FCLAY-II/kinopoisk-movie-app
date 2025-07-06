// src/components/auth/AuthProvider.tsx
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import {useAppSelector} from "@/redux/hooks";
import {selectAuthChecked} from "@/redux/features/user/userSlice";
import {Loading} from "@/componets/Loading";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useAuth(); // Подключаем слушатель авторизации
  const authChecked = useAppSelector(selectAuthChecked);

  if (!authChecked) {
    return <Loading />;
  }


  return <>{children}</>;
};