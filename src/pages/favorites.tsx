import React from 'react';
import Head from 'next/head';
import Favorites from '@/components/Favorites';
import MainLayout from "@/components/Layout/MainLayout";

const FavoritesPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Избранные фильмы - КиноПоиск</title>
        <meta name="description" content="Ваши избранные фильмы" />
      </Head>
      
      <MainLayout>
        <Favorites/>
      </MainLayout>
    </>
  );
};

export default FavoritesPage;