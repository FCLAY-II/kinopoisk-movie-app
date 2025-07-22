import React, { FC, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAppDispatch } from "@/redux/hooks";
import { useAuth } from "@/hooks/useAuth";
import { Film, Heart, LogOut, Menu, X, User, Search } from "lucide-react";
import MobileMenu from "./MobileMenu";
import s from "./Header.module.scss";
import { handleSignOut } from "@/lib/firebase/auth";
import { useToggle } from "@/hooks/useToggle";
import type { InitialUser } from "@/lib/auth/ssrAuth";

interface HeaderProps {
  initialUser?: InitialUser | null;
}

const Header: FC<HeaderProps> = ({ initialUser }) => {
  const { push, pathname } = useRouter();
  const dispatch = useAppDispatch();
  const { user, authChecked } = useAuth();
  const [isMobileMenuOpen, toggleMobileMenu, setIsMobileMenuOpen] = useToggle();
  const displayUser = user || initialUser || null;

  // Закрываем мобильное меню при изменении маршрута
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Закрываем мобильное меню при клике вне его
  useEffect(() => {
    // Проверяем, что мы в браузере
    if (typeof window === "undefined") return;

    const handleClickOutside = () => {
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMobileMenuOpen]);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    await handleSignOut();
    dispatch({ type: "RESET_STORE" });
    await push("/auth");
  };

  const isActiveRoute = (path: string) => {
    return pathname === path;
  };

  const handleToggleMobileMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleMobileMenu();
  };

  return (
    <>
      <header className={s.header}>
        <div className={s.container}>
          <Link href="/search-movies" className={s.logo}>
            <div className={s.logoIcon}>
              <Film size={20} />
            </div>
            <span className={s.logoText}>КиноПоиск</span>
          </Link>

          <nav className={s.nav}>
            <ul className={s.navLinks}>
              <li>
                <Link
                  href="/search-movies"
                  className={`${s.navLink} ${isActiveRoute("/search-movies") ? s.active : ""}`}
                >
                  <Search size={18} />
                  Поиск фильмов
                </Link>
              </li>
              <li>
                <Link
                  href="/favorites"
                  className={`${s.navLink} ${isActiveRoute("/favorites") ? s.active : ""}`}
                >
                  <Heart size={18} />
                  Избранное
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className={`${s.navLink} ${isActiveRoute("/profile") ? s.active : ""}`}
                >
                  <User size={18} />
                  Профиль
                </Link>
              </li>
            </ul>
          </nav>

          {(authChecked || initialUser) && (
            <div className={s.userSection}>
              {displayUser && (
                <div className={s.userInfo}>
                  <div className={s.avatar}>
                    <User size={20} />
                  </div>
                  <span className={s.userName}>
                    {displayUser.displayName || displayUser.email}
                  </span>
                </div>
              )}
              <button onClick={handleLogout} className={s.logoutButton}>
                <LogOut size={16} />
                Выйти
              </button>
            </div>
          )}

          <button
            className={s.mobileMenuButton}
            onClick={handleToggleMobileMenu}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>
      <MobileMenu
        isOpen={isMobileMenuOpen}
        user={displayUser}
        onLogout={handleLogout}
      />
    </>
  );
};

export default Header;
