import React, { FC, ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Loading } from "@/components/Loading";
import { useAuthListener } from "@/hooks/useAuthListener";

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
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
