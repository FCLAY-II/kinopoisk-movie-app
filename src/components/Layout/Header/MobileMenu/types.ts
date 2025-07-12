import { User } from "firebase/auth";

export interface MobileMenuProps {
  isOpen: boolean;
  user: User | null;
  onLogout: () => void;
}
