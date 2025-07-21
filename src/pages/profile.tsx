import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import nookies from "nookies";
import { GetServerSideProps } from "next";
import { adminAuth } from "@/lib/firebase/admin";
import MainLayout from "@/components/Layout/MainLayout";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/features/user/userSlice";

const Profile = dynamic(() => import("@/components/Profile"));

// SSR! Получаем юзера с сервера и кладём в initialUser
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const cookies = nookies.get(ctx);
    const token = cookies.token;

    if (!token) {
      return { redirect: { destination: "/auth", permanent: false } };
    }

    const decodedToken = await adminAuth.verifyIdToken(token);

    return {
      props: {
        initialUser: {
          uid: decodedToken.uid,
          email: decodedToken.email,
          displayName: decodedToken.name || "",
          emailVerified: decodedToken.email_verified,
        },
      },
    };
  } catch {
    return { redirect: { destination: "/auth", permanent: false } };
  }
};

const ProfilePage: React.FC<{ initialUser?: any }> = ({ initialUser }) => {
  const dispatch = useAppDispatch();

  // Если initialUser есть — кладём в стор сразу при монтировании
  useEffect(() => {
    if (initialUser) {
      dispatch(setUser(initialUser));
    }
  }, [initialUser, dispatch]);

  return (
    <MainLayout>
      <Profile />
    </MainLayout>
  );
};

export default ProfilePage;
