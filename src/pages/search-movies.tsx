import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useAppSelector } from "@/redux/hooks";
import SearchMovies from "@/components/SearchMovies";
import MainLayout from "@/components/Layout/MainLayout";

const SearchMoviesPage: React.FC = () => {
  const router = useRouter();
  const user = useAppSelector((state) => state.user.user);

  useEffect(() => {
    if (!user) {
      void router.push("/auth");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <MainLayout>
      <SearchMovies />
    </MainLayout>
  );
};

export default SearchMoviesPage;
