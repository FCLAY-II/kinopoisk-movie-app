import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { selectUser, setUser } from "@/redux/features/user/userSlice";
import { Film, Heart, LogOut, Menu, X, User, Search } from "lucide-react";
import MobileMenu from "./MobileMenu";
import s from "./Header.module.scss";
import { handleSignOut } from "@/lib/firebase/auth";
import { useToggle } from "@/hooks/useToggle";

const Header: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [isMobileMenuOpen, toggleMobileMenu, setIsMobileMenuOpen] = useToggle();

  // Закрываем мобильное меню при изменении маршрута
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [router.pathname]);

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
    try {
      await handleSignOut();
      dispatch(setUser(null));
      router.push("/auth");
    } catch (error) {
      console.error("Ошибка при выходе:", error);
    }
  };

  const isActiveRoute = (path: string) => {
    return router.pathname === path;
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

          <div className={s.userSection}>
            {user && (
              <div className={s.userInfo}>
                <div className={s.avatar}>
                  <User size={20} />
                </div>
                <span className={s.userName}>
                  {user.displayName || user.email}
                </span>
              </div>
            )}
            <button onClick={handleLogout} className={s.logoutButton}>
              <LogOut size={16} />
              Выйти
            </button>
          </div>

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
        user={user}
        onLogout={handleLogout}
      />
    </>
  );
};

export default Header;
