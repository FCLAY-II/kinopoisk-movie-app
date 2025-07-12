import React from "react";
import { useRouter } from "next/router";
import { Heart, LogOut, User as IconUser, Search, User } from "lucide-react";
import s from "./MobileMenu.module.scss";
import { MobileMenuProps } from "@/components/Layout/Header/MobileMenu/types";
import cn from "classnames";

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, user, onLogout }) => {
  const router = useRouter();

  const isActiveRoute = (path: string) => {
    return router.pathname === path;
  };

  return (
    <div className={cn(s.mobileMenu, { [s.open]: isOpen })}>
      <ul className={s.mobileNavLinks}>
        <li>
          <a
            href="/search-movies"
            className={`${s.mobileNavLink} ${isActiveRoute("/search-movies") ? s.active : ""}`}
          >
            <Search size={18} />
            Поиск фильмов
          </a>
        </li>
        <li>
          <a
            href="/favorites"
            className={`${s.mobileNavLink} ${isActiveRoute("/favorites") ? s.active : ""}`}
          >
            <Heart size={18} />
            Избранное
          </a>
        </li>
        <li>
          <a
            href="/profile"
            className={`${s.mobileNavLink} ${isActiveRoute("/profile") ? s.active : ""}`}
          >
            <User size={18} />
            Профиль
          </a>
        </li>
      </ul>

      <div className={s.mobileUserSection}>
        {user && (
          <div className={s.mobileUserInfo}>
            <div className={s.avatar}>
              <IconUser size={20} />
            </div>
            <div className={s.mobileUserText}>
              <span className={s.mobileUserName}>
                {user.displayName || "Пользователь"}
              </span>
              <span className={s.mobileUserEmail}>{user.email}</span>
            </div>
          </div>
        )}
        <button onClick={onLogout} className={s.logoutButton}>
          <LogOut size={16} />
          Выйти
        </button>
      </div>
    </div>
  );
};

export default MobileMenu;
