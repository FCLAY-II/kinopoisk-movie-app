import { User } from 'firebase/auth';

export interface FirebaseConfig {
    apiKey: string;
    authDomain?: string;
    projectId?: string;
    storageBucket?: string;
    messagingSenderId?: string;
    appId?: string;
    measurementId?: string;
}

export interface AuthError extends Error {
    code?: string;
    message: string;
}

export interface AuthContextType {
    user: FirebaseUser | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, displayName?: string) => Promise<void>;
    signOut: () => Promise<void>;
    googleSignIn: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    updateProfile: (profile: { displayName?: string; photoURL?: string }) => Promise<void>;
    updatePassword: (newPassword: string) => Promise<void>;
    updateEmail: (newEmail: string) => Promise<void>;
    reauthenticate: (password: string) => Promise<void>;
    deleteAccount: () => Promise<void>;
    resendVerification: () => Promise<void>;
}

export interface AuthFormData {
    email: string;
    password: string;
    confirmPassword?: string;
    displayName?: string;
}

export type FirebaseUser = User;

