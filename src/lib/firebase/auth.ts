import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    UserCredential
} from 'firebase/auth';
import { auth } from './config';
import type { AuthError, FirebaseUser } from './types';

/**
 * Функция для регистрации пользователя
 */
export const handleSignUp = async (email: string, password: string): Promise<FirebaseUser> => {
    try {
        const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
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

export const subscribeToAuthState = (callback: (user: FirebaseUser | null) => void): (() => void) => {
    return onAuthStateChanged(auth, callback);
};
