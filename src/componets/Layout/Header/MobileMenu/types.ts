import {User} from "@/types/user";

export interface MobileMenuProps {
    isOpen: boolean;
    user: User | null;
    onLogout: () => void;
}