import React, { FC } from "react";
import Head from "next/head";
import Favorites from "@/components/Favorites";
import MainLayout from "@/components/Layout/MainLayout";
import { GetServerSideProps } from "next";
import { getInitialUser } from "@/lib/auth/ssrAuth";

const FavoritesPage: FC = () => {
  return (
    <>
      <Head>
        <title>Избранные фильмы - КиноПоиск</title>
        <meta name="description" content="Ваши избранные фильмы" />
      </Head>
      <MainLayout>
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

  return { props: {} };
};

export default FavoritesPage;
