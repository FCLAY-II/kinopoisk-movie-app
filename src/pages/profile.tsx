import React from "react";
import { GetServerSideProps } from "next";
import MainLayout from "@/components/Layout/MainLayout";
import { getInitialUser, type InitialUser } from "@/lib/auth/ssrAuth";
import Profile from "@/components/Profile";

interface PageProps {
  initialUser: InitialUser;
}

const ProfilePage: React.FC<PageProps> = ({ initialUser }) => {
  return (
    <MainLayout initialUser={initialUser}>
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
