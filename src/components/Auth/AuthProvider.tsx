import React, { FC, ReactNode } from "react";
import { useAuthListener } from "@/hooks/useAuthListener";

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  useAuthListener();
  return <>{children}</>;
};
