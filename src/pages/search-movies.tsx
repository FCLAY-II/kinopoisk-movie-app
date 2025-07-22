import React from "react";
import SearchMovies from "@/components/SearchMovies";
import MainLayout from "@/components/Layout/MainLayout";
import { GetServerSideProps } from "next";
import { getInitialUser, type InitialUser } from "@/lib/auth/ssrAuth";

interface PageProps {
  initialUser: InitialUser;
}

const SearchMoviesPage: React.FC<PageProps> = ({ initialUser }) => {
  return (
    <MainLayout initialUser={initialUser}>
      <SearchMovies />
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = await getInitialUser(ctx);
  if (!user) {
    return { redirect: { destination: "/auth", permanent: false } };
  }

  return { props: { initialUser: user } };
};

export default SearchMoviesPage;
