import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Loading } from "@/components/Loading";
import {useAuthListener} from "@/hooks/useAuthListener";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useAuthListener();
  const { authChecked } = useAuth();

  if (!authChecked) {
    return (
      <Loading 
        text="Проверка авторизации..." 
        subtext="Подождите, идет инициализация"
      />
    );
  }

  return <>{children}</>;
};