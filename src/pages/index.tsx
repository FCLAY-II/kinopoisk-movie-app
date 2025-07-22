import { GetServerSideProps } from "next";
import { getInitialUser } from "@/lib/auth/ssrAuth";

const HomePage = () => null;
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = await getInitialUser(ctx);
  if (user) {
    return { redirect: { destination: "/search-movies", permanent: false } };
  }
  return { redirect: { destination: "/auth", permanent: false } };
};

export default HomePage;
