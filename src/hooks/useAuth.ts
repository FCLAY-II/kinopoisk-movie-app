import { useAppSelector } from "@/redux/hooks";
import { selectUser, selectAuthChecked } from "@/redux/features/user/userSlice";

export const useAuth = () => {
  const user = useAppSelector(selectUser);
  const authChecked = useAppSelector(selectAuthChecked);

  return { user, authChecked };
};
