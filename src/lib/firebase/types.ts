import { User as FirebaseUser } from 'firebase/auth';

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

export type { FirebaseUser };
