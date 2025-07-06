import React, {ReactElement, useState} from 'react';
import {handleSignIn, handleSignUp} from "@/lib/firebase";
import {AuthFormHandlers, AuthFormProps, AuthFormState} from "@/componets/Auth/types";
import cn from 'classnames';

const AuthForm  = ({className}: AuthFormProps): ReactElement => {
    const [formState, setFormState] = useState<AuthFormState>({
        email: '',
        password: '',
        isSignUp: false,
        error: null,
    });

    const handlers: AuthFormHandlers = {
        handleError: (error, action) => {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Неизвестная ошибка';
            setFormState(prev => ({ ...prev, error: `Ошибка при ${action}. ${errorMessage}` }));
        },

        handleSubmit: async (e) => {
            e.preventDefault();
            const { email, password, isSignUp } = formState;

            try {
                await (isSignUp ? handleSignUp(email, password) : handleSignIn(email, password));
                setFormState({
                    email: '',
                    password: '',
                    isSignUp: false,
                    error: null,
                });
            } catch (error) {
                handlers.handleError(error, isSignUp ? 'регистрации' : 'входе');
            }
        },
    };


    return (
        <div className={cn('flex justify-center items-center p-4', className)}>
            {formState.error && <div className="text-red-500 mb-4">{formState.error}</div>}
            <form onSubmit={handlers.handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-sm font-medium">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        required
                        placeholder="Введите email"
                        value={formState.email}
                        onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))}
                        className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="password" className="text-sm font-medium">
                        Пароль
                    </label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        required
                        placeholder="Введите пароль"
                        value={formState.password}
                        onChange={(e) => setFormState(prev => ({ ...prev, password: e.target.value }))}
                        className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                    {formState.isSignUp ? 'Регистрация' : 'Войти'}
                </button>
                <button
                    type="button"
                    onClick={() => setFormState(prev => ({ ...prev, isSignUp: !prev.isSignUp }))}
                    className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                    {formState.isSignUp ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
                </button>
            </form>
        </div>
    );
};

export default AuthForm;