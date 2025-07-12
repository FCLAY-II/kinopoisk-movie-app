export interface AuthFormProps {
    className?: string;
}

export interface AuthFormState {
    email: string;
    password: string;
    isSignUp: boolean;
    error: string | null;
}

export interface AuthFormHandlers {
    // handleAuthResponse: (user: FirebaseUser) => void;
    handleError: (error: unknown, action: string) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}
