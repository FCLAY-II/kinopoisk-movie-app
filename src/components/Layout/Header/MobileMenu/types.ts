import { User } from "firebase/auth";
import type { InitialUser } from "@/lib/auth/ssrAuth";

export interface MobileMenuProps {
  isOpen: boolean;
  user: User | InitialUser | null;
  onLogout: () => void;
}
