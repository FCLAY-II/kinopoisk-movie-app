import React, { FC, ReactNode } from "react";
import Header from "../Header";
import { Loading } from "@/components/Loading";
import s from "./MainLayout.module.scss";
import { useAppSelector } from "@/redux/hooks";
import type { InitialUser } from "@/lib/auth/ssrAuth";

interface MainLayoutProps {
  children: ReactNode;
  initialUser?: InitialUser | null;
}

const MainLayout: FC<MainLayoutProps> = ({ children, initialUser }) => {
  const isLoading = useAppSelector(
    (state) =>
      state.movies.loading ||
      (state.favorites.loading && !state.favorites.isLoaded) ||
      (state.watched.loading && !state.watched.isLoaded),
  );
  return (
    <div className={s.layout}>
      <Header initialUser={initialUser} />
      <main className={s.main}>
        <div className={s.container}>
          <div className={s.content}>
            {isLoading ? (
              <Loading
                text="Переход на страницу..."
                subtext="Загружаем контент"
              />
            ) : (
              children
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
