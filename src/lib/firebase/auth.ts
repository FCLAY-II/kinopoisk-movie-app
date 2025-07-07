import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    sendEmailVerification,
    sendPasswordResetEmail,
    reauthenticateWithCredential,
    EmailAuthProvider,
    User,
    UserCredential, onAuthStateChanged
} from 'firebase/auth';
import { auth } from './config';

export interface AuthResult {
    success: boolean;
    user?: User;
    error?: any;
}

// Безопасная обертка для Firebase операций
const safeAsyncWrapper = async <T>(
    operation: () => Promise<T>
): Promise<{ success: boolean; data?: T; error?: any }> => {
    try {
        const data = await operation();
        return { success: true, data };
    } catch (error) {
        // Полностью поглощаем ошибку, не даем ей всплыть
        console.error('Firebase operation failed:', error);
        return { success: false, error };
    }
};

/**
 * Безопасная функция для входа пользователя
 */
export const handleSignIn = async (email: string, password: string): Promise<AuthResult> => {
    const result = await safeAsyncWrapper(async () => {
        return await signInWithEmailAndPassword(auth, email, password);
    });

    if (result.success && result.data) {
        return {
            success: true,
            user: result.data.user
        };
    }

    return {
        success: false,
        error: result.error
    };
};

/**
 * Безопасная функция для регистрации пользователя
 */
export const handleSignUp = async (email: string, password: string): Promise<AuthResult> => {
    const result = await safeAsyncWrapper(async () => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Отправляем email для верификации
        await sendEmailVerification(userCredential.user);
        return userCredential;
    });

    if (result.success && result.data) {
        return {
            success: true,
            user: result.data.user
        };
    }

    return {
        success: false,
        error: result.error
    };
};

/**
 * Безопасная функция для выхода пользователя
 */
export const handleSignOut = async (): Promise<AuthResult> => {
    const result = await safeAsyncWrapper(async () => {
        await firebaseSignOut(auth);
        return true;
    });

    if (result.success) {
        return { success: true };
    }

    return {
        success: false,
        error: result.error
    };
};

/**
 * Безопасная отправка email для сброса пароля
 */
export const handlePasswordReset = async (email: string): Promise<AuthResult> => {
    const result = await safeAsyncWrapper(async () => {
        await sendPasswordResetEmail(auth, email);
        return true;
    });

    if (result.success) {
        return { success: true };
    }

    return {
        success: false,
        error: result.error
    };
};

/**
 * Безопасная повторная аутентификация пользователя
 */
export const reauthenticateUser = async (user: User, password: string): Promise<AuthResult> => {
    const result = await safeAsyncWrapper(async () => {
        const credential = EmailAuthProvider.credential(user.email!, password);
        await reauthenticateWithCredential(user, credential);
        return true;
    });

    if (result.success) {
        return { success: true };
    }

    return {
        success: false,
        error: result.error
    };
};

/**
 * Безопасная повторная отправка email верификации
 */
export const resendEmailVerification = async (user: User): Promise<AuthResult> => {
    const result = await safeAsyncWrapper(async () => {
        await sendEmailVerification(user);
        return true;
    });

    if (result.success) {
        return { success: true };
    }

    return {
        success: false,
        error: result.error
    };
};

export const subscribeToAuthState = (callback: (user: User | null) => void): (() => void) => {
    return onAuthStateChanged(auth, callback);
};
