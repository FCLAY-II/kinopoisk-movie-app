import React, { FC } from "react";
import Auth from "@/components/Auth";
import { GetServerSideProps } from "next";
import { getInitialUser } from "@/lib/auth/ssrAuth";

const AuthPage: FC = () => {
  return <Auth />;
};

export default AuthPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = await getInitialUser(ctx);
  if (user) {
    return { redirect: { destination: "/search-movies", permanent: false } };
  }

  return { props: {} };
};
