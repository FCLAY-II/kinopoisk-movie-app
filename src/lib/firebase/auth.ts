import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  User,
  UserCredential,
  onAuthStateChanged,
  updateProfile,
  AuthError,
} from "firebase/auth";
import { auth } from "./config";

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: AuthError;
}

/**
 * Функция для входа пользователя
 */
export const handleSignIn = async (
  email: string,
  password: string,
): Promise<AuthResult> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error as AuthError };
  }
};

/**
 * Функция для регистрации пользователя
 */
export const handleSignUp = async (
  email: string,
  password: string,
  displayName?: string,
): Promise<AuthResult> => {
  try {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
    }

    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error as AuthError };
  }
};

/**
 * Функция для выхода пользователя
 */
export const handleSignOut = async (): Promise<AuthResult> => {
  try {
    await firebaseSignOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error as AuthError };
  }
};

/**
 * Отправка email для сброса пароля
 */
export const handlePasswordReset = async (
  email: string,
): Promise<AuthResult> => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    return { success: false, error: error as AuthError };
  }
};

/**
 * Повторная аутентификация пользователя
 */
export const reauthenticateUser = async (
  user: User,
  password: string,
): Promise<AuthResult> => {
  try {
    const credential = EmailAuthProvider.credential(user.email!, password);
    await reauthenticateWithCredential(user, credential);
    return { success: true };
  } catch (error) {
    return { success: false, error: error as AuthError };
  }
};
/**
 * Повторная отправка email верификации
 */
export const resendEmailVerification = async (
  user: User,
): Promise<AuthResult> => {
  try {
    await sendEmailVerification(user);

    return { success: true };
  } catch (error) {
    return { success: false, error: error as AuthError };
  }
};

export const subscribeToAuthState = (
  callback: (user: User | null) => void,
): (() => void) => {
  return onAuthStateChanged(auth, callback);
};
