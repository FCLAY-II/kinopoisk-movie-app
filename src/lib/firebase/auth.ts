import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    UserCredential,
    sendEmailVerification,
    EmailAuthProvider,
    reauthenticateWithCredential,
    User
} from 'firebase/auth';
import { auth } from './config';
import type { AuthError, FirebaseUser } from './types';

/**
 * Функция для регистрации пользователя
 */
export const handleSignUp = async (email: string, password: string): Promise<FirebaseUser> => {
    try {
        const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Отправляем email для верификации
        await sendEmailVerification(userCredential.user);

        return userCredential.user;
    } catch (error) {
        console.error('Error during sign-up:', error);
        throw error as AuthError;
    }
};


/**
 * Функция для входа пользователя
 */
export const handleSignIn = async (email: string, password: string): Promise<FirebaseUser> => {
    try {
        const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error('Error during sign-in:', error);
        throw error as AuthError;
    }
};

/**
 * Функция для выхода пользователя
 */
export const handleSignOut = async (): Promise<void> => {
    try {
        await firebaseSignOut(auth);
    } catch (error) {
        console.error('Sign-out error:', error);
        throw error as AuthError;
    }
};

/**
 * Повторная аутентификация пользователя
 */
export const reauthenticateUser = async (user: User, password: string): Promise<void> => {
    try {
        const credential = EmailAuthProvider.credential(user.email!, password);
        await reauthenticateWithCredential(user, credential);
    } catch (error) {
        console.error('Error during reauthentication:', error);
        throw error as AuthError;
    }
};

/**
 * Повторная отправка email верификации
 */
export const resendEmailVerification = async (user: User): Promise<void> => {
    try {
        await sendEmailVerification(user);
    } catch (error) {
        console.error('Error resending email verification:', error);
        throw error as AuthError;
    }
};


export const subscribeToAuthState = (callback: (user: FirebaseUser | null) => void): (() => void) => {
    return onAuthStateChanged(auth, callback);
};
