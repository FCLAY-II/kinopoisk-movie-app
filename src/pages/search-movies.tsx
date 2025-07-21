import React from "react";
import SearchMovies from "@/components/SearchMovies";
import MainLayout from "@/components/Layout/MainLayout";
import { GetServerSideProps } from "next";
import { getInitialUser } from "@/lib/auth/ssrAuth";

const SearchMoviesPage: React.FC = () => {
  return (
    <MainLayout>
      <SearchMovies />
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = await getInitialUser(ctx);
  if (!user) {
    return { redirect: { destination: "/auth", permanent: false } };
  }

  return { props: {} };
};

export default SearchMoviesPage;
