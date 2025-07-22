import { GetServerSidePropsContext } from "next";
import nookies from "nookies";
import { adminAuth } from "@/lib/firebase/admin";

export interface InitialUser {
  uid: string;
  email?: string;
  displayName: string;
  emailVerified: boolean;
}

export const getInitialUser = async (
  ctx: GetServerSidePropsContext,
): Promise<InitialUser | null> => {
  try {
    const { token } = nookies.get(ctx);
    if (!token) return null;
    const decoded = await adminAuth.verifyIdToken(token);
    return {
      uid: decoded.uid,
      email: decoded.email ?? undefined,
      displayName: decoded.name || "",
      emailVerified: !!decoded.email_verified,
    };
  } catch {
    return null;
  }
};
