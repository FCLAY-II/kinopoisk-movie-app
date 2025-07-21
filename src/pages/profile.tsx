import React from "react";
import { GetServerSideProps } from "next";
import MainLayout from "@/components/Layout/MainLayout";
import { getInitialUser } from "@/lib/auth/ssrAuth";
import Profile from "@/components/Profile";

const ProfilePage: React.FC = () => {
  return (
    <MainLayout>
      <Profile />
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = await getInitialUser(ctx);
  if (!user) {
    return { redirect: { destination: "/auth", permanent: false } };
  }

  return {
    props: { initialUser: user },
  };
};

export default ProfilePage;
