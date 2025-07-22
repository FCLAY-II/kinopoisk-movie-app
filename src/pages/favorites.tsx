import React, { FC } from "react";
import Head from "next/head";
import Favorites from "@/components/Favorites";
import MainLayout from "@/components/Layout/MainLayout";
import { GetServerSideProps } from "next";
import { getInitialUser, type InitialUser } from "@/lib/auth/ssrAuth";

interface PageProps {
  initialUser: InitialUser;
}

const FavoritesPage: FC<PageProps> = ({ initialUser }) => {
  return (
    <>
      <Head>
        <title>Избранные фильмы - КиноПоиск</title>
        <meta name="description" content="Ваши избранные фильмы" />
      </Head>
      <MainLayout initialUser={initialUser}>
        <Favorites />
      </MainLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = await getInitialUser(ctx);
  if (!user) {
    return { redirect: { destination: "/auth", permanent: false } };
  }

  return { props: { initialUser: user } };
};

export default FavoritesPage;
