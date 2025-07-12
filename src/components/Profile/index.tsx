import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
import {
  User,
  Edit2,
  Save,
  X,
  AlertTriangle,
  RefreshCw,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  updateProfile,
  updateEmail,
  updatePassword,
  User as FirebaseUser,
} from "firebase/auth";
import s from "./Profile.module.scss";
import {
  reauthenticateUser,
  resendEmailVerification,
} from "@/lib/firebase/auth";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/features/user/userSlice";

const cloneFirebaseUser = (user: FirebaseUser): FirebaseUser =>
  Object.assign(Object.create(Object.getPrototypeOf(user)), user);

const Profile: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const dispatch = useAppDispatch();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    displayName: user?.displayName || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!user) {
      router.push("/auth");
    } else {
      setFormData((prev) => ({
        ...prev,
        displayName: user.displayName || "",
        email: user.email || "",
      }));
    }
  }, [user, router]);

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleUpdateProfile = async () => {
    if (!user || !formData.displayName.trim()) return;

    setIsLoading(true);
    try {
      await updateProfile(user, { displayName: formData.displayName });
      dispatch(setUser(cloneFirebaseUser(user)));
      setIsEditingProfile(false);
      showMessage("success", "Профиль успешно обновлен!");
    } catch (error) {
      console.error("Profile update error:", error);
      showMessage("error", "Ошибка при обновлении профиля");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateEmail = async () => {
    if (!user || !formData.email.trim() || !formData.currentPassword) return;

    setIsLoading(true);
    try {
      const authResult = await reauthenticateUser(
        user,
        formData.currentPassword,
      );
      if (!authResult.success) {
        if (authResult.error?.code === "auth/wrong-password") {
          showMessage("error", "Неверный текущий пароль");
        } else {
          showMessage("error", "Ошибка при подтверждении пароля");
        }
        return;
      }

      await updateEmail(user, formData.email);
      setIsEditingEmail(false);
      setFormData((prev) => ({ ...prev, currentPassword: "" }));
      showMessage(
        "success",
        "Email успешно обновлен! Проверьте почту для подтверждения.",
      );
    } catch (error: any) {
      console.error("Email update error:", error);
      if (error.code === "auth/email-already-in-use") {
        showMessage("error", "Этот email уже используется");
      } else {
        showMessage("error", "Ошибка при обновлении email");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (
      !user ||
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    )
      return;

    if (formData.newPassword !== formData.confirmPassword) {
      showMessage("error", "Пароли не совпадают");
      return;
    }

    if (formData.newPassword.length < 6) {
      showMessage("error", "Пароль должен содержать минимум 6 символов");
      return;
    }

    setIsLoading(true);
    try {
      const authResult = await reauthenticateUser(
        user,
        formData.currentPassword,
      );
      if (!authResult.success) {
        if (authResult.error?.code === "auth/wrong-password") {
          showMessage("error", "Неверный текущий пароль");
        } else {
          showMessage("error", "Ошибка при подтверждении пароля");
        }
        return;
      }

      await updatePassword(user, formData.newPassword);
      setIsEditingPassword(false);
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      showMessage("success", "Пароль успешно обновлен!");
    } catch (error: any) {
      console.error("Password update error:", error);
      showMessage("error", "Ошибка при обновлении пароля");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const result = await resendEmailVerification(user);
      if (result.success) {
        showMessage("success", "Письмо с подтверждением отправлено!");
      } else {
        showMessage("error", "Ошибка при отправке письма");
      }
    } catch (error) {
      console.error("Resend verification error:", error);
      showMessage("error", "Ошибка при отправке письма");
    } finally {
      setIsLoading(false);
    }
  };

  const cancelEdit = () => {
    setIsEditingProfile(false);
    setIsEditingEmail(false);
    setIsEditingPassword(false);
    setFormData({
      displayName: user?.displayName || "",
      email: user?.email || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className={s.profile}>
      <div className={s.header}>
        <div className={s.avatar}>
          <User size={40} />
        </div>
        <div className={s.userInfo}>
          <h1 className={s.title}>Профиль пользователя</h1>
          <p className={s.subtitle}>Управление настройками аккаунта</p>
        </div>
      </div>

      {message && (
        <div className={`${s.message} ${s[message.type]}`}>{message.text}</div>
      )}

      {!user.emailVerified && (
        <div className={s.verificationWarning}>
          <AlertTriangle size={20} />
          <div className={s.warningContent}>
            <p>Ваш email не подтвержден</p>
            <button
              onClick={handleResendVerification}
              disabled={isLoading}
              className={s.resendButton}
            >
              <RefreshCw size={16} className={isLoading ? s.spinning : ""} />
              Отправить подтверждение
            </button>
          </div>
        </div>
      )}

      <div className={s.sections}>
        {/* Секция профиля */}
        <div className={s.section}>
          <div className={s.sectionHeader}>
            <h2>Информация профиля</h2>
            {!isEditingProfile && (
              <button
                onClick={() => setIsEditingProfile(true)}
                className={s.editButton}
              >
                <Edit2 size={16} />
                Редактировать
              </button>
            )}
          </div>

          <div className={s.field}>
            <label>Имя</label>
            {isEditingProfile ? (
              <div className={s.editField}>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      displayName: e.target.value,
                    }))
                  }
                  className={s.input}
                />
                <div className={s.editActions}>
                  <button
                    onClick={handleUpdateProfile}
                    disabled={isLoading}
                    className={s.saveButton}
                  >
                    <Save size={16} />
                    Сохранить
                  </button>
                  <button onClick={cancelEdit} className={s.cancelButton}>
                    <X size={16} />
                    Отмена
                  </button>
                </div>
              </div>
            ) : (
              <p className={s.fieldValue}>{user.displayName || "Не указано"}</p>
            )}
          </div>
        </div>

        {/* Секция Email */}
        <div className={s.section}>
          <div className={s.sectionHeader}>
            <h2>Email</h2>
            {!isEditingEmail && (
              <button
                onClick={() => setIsEditingEmail(true)}
                className={s.editButton}
              >
                <Edit2 size={16} />
                Изменить
              </button>
            )}
          </div>

          <div className={s.field}>
            <label>Адрес электронной почты</label>
            {isEditingEmail ? (
              <div className={s.editField}>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className={s.input}
                />
                <div className={s.passwordField}>
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Текущий пароль"
                    value={formData.currentPassword}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        currentPassword: e.target.value,
                      }))
                    }
                    className={s.input}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className={s.passwordToggle}
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
                <div className={s.editActions}>
                  <button
                    onClick={handleUpdateEmail}
                    disabled={isLoading}
                    className={s.saveButton}
                  >
                    <Save size={16} />
                    Сохранить
                  </button>
                  <button onClick={cancelEdit} className={s.cancelButton}>
                    <X size={16} />
                    Отмена
                  </button>
                </div>
              </div>
            ) : (
              <div className={s.emailDisplay}>
                <p className={s.fieldValue}>{user.email}</p>
                <div className={s.emailStatus}>
                  {user.emailVerified ? (
                    <span className={s.verified}>✓ Подтвержден</span>
                  ) : (
                    <span className={s.unverified}>⚠ Не подтвержден</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Секция пароля */}
        <div className={s.section}>
          <div className={s.sectionHeader}>
            <h2>Пароль</h2>
            {!isEditingPassword && (
              <button
                onClick={() => setIsEditingPassword(true)}
                className={s.editButton}
              >
                <Edit2 size={16} />
                Изменить
              </button>
            )}
          </div>

          <div className={s.field}>
            <label>Пароль</label>
            {isEditingPassword ? (
              <div className={s.editField}>
                <div className={s.passwordField}>
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Текущий пароль"
                    value={formData.currentPassword}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        currentPassword: e.target.value,
                      }))
                    }
                    className={s.input}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className={s.passwordToggle}
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
                <div className={s.passwordField}>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Новый пароль"
                    value={formData.newPassword}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                    className={s.input}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className={s.passwordToggle}
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div className={s.passwordField}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Подтвердите новый пароль"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    className={s.input}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={s.passwordToggle}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
                <div className={s.editActions}>
                  <button
                    onClick={handleUpdatePassword}
                    disabled={isLoading}
                    className={s.saveButton}
                  >
                    <Save size={16} />
                    Сохранить
                  </button>
                  <button onClick={cancelEdit} className={s.cancelButton}>
                    <X size={16} />
                    Отмена
                  </button>
                </div>
              </div>
            ) : (
              <p className={s.fieldValue}>••••••••</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
