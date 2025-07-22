import React, { FC } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import MainLayout from "@/components/Layout/MainLayout";
import dynamic from "next/dynamic";

const MoviePage = dynamic(() => import("@/components/MoviePage"));
import { IMovie } from "@/components/MovieCard/types";
import { filmSearchService } from "@/services/api/kinopoisk";
import { getInitialUser, type InitialUser } from "@/lib/auth/ssrAuth";

interface MoviePageProps {
  movie: IMovie | null;
  error?: string;
  initialUser: InitialUser | null;
}

const MoviePageWrapper: FC<MoviePageProps> = ({ movie, error, initialUser }) => {
  const router = useRouter();

  if (error || !movie) {
    return (
      <MainLayout initialUser={initialUser}>
        <div style={{ textAlign: "center", padding: "48px" }}>
          <h1>Фильм не найден</h1>
          <p>{error || "Не удалось загрузить информацию о фильме"}</p>
          <button onClick={() => router.back()}>Вернуться назад</button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout initialUser={initialUser}>
      <MoviePage movie={movie} />
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { id } = ctx.params!;
  const initialUser = await getInitialUser(ctx);

  try {
    const movie = await filmSearchService.getMovieById(Number(id));

    return {
      props: {
        movie,
        initialUser,
      },
    };
  } catch (error) {
    return {
      props: {
        movie: null,
        error:
          error instanceof Error ? error.message : "Ошибка загрузки фильма",
        initialUser,
      },
    };
  }
};

export default MoviePageWrapper;
