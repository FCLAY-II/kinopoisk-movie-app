import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import {
    Mail, 
    Lock, 
    User, 
    Eye, 
    EyeOff, 
    LogIn, 
    UserPlus,
    ArrowLeft,
    AlertCircle,
    CheckCircle
} from 'lucide-react';
import s from './Auth.module.scss';
import {handleSignIn, handleSignUp} from "@/lib/firebase";
import {handlePasswordReset} from "@/lib/firebase/auth";

type AuthMode = 'signin' | 'signup' | 'reset';

const Auth: React.FC = () => {
    const router = useRouter();
    const { user } = useAuth();
    
    const [mode, setMode] = useState<AuthMode>('signin');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        displayName: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        if (user) {
            router.push('/');
        }
    }, [user, router]);

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 8000);
    };

    const validateForm = (): boolean => {
        if (!formData.email.trim()) {
            showMessage('error', 'Введите email');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showMessage('error', 'Введите корректный email');
            return false;
        }

        if (mode !== 'reset' && !formData.password) {
            showMessage('error', 'Введите пароль');
            return false;
        }

        if (mode === 'signup') {
            if (!formData.displayName.trim()) {
                showMessage('error', 'Введите имя');
                return false;
            }
            if (formData.password.length < 6) {
                showMessage('error', 'Пароль должен содержать минимум 6 символов');
                return false;
            }
            if (!formData.confirmPassword) {
                showMessage('error', 'Подтвердите пароль');
                return false;
            }
            if (formData.password !== formData.confirmPassword) {
                showMessage('error', 'Пароли не совпадают');
                return false;
            }
        }

        return true;
    };

    const getFirebaseErrorMessage = (errorCode: string): string => {
        switch (errorCode) {
            case 'auth/user-not-found':
                return 'Пользователь с таким email не найден';
            case 'auth/invalid-login-credentials':
                return 'Неверный пароль. Проверьте правильность ввода';
            case 'auth/invalid-email':
                return 'Некорректный формат email';
            case 'auth/email-already-in-use':
                return 'Пользователь с таким email уже существует';
            case 'auth/weak-password':
                return 'Пароль слишком слабый. Используйте минимум 6 символов';
            case 'auth/too-many-requests':
                return 'Слишком много неудачных попыток. Попробуйте позже или сбросьте пароль';
            case 'auth/network-request-failed':
                return 'Ошибка подключения к интернету. Проверьте соединение';
            case 'auth/invalid-credential':
                return 'Неверные данные для входа. Проверьте email и пароль';
            case 'auth/user-disabled':
                return 'Этот аккаунт был заблокирован';
            case 'auth/operation-not-allowed':
                return 'Данный способ входа отключен';
            case 'auth/requires-recent-login':
                return 'Для выполнения этого действия требуется повторный вход в систему';
            default:
                return 'Произошла ошибка. Проверьте введенные данные и попробуйте еще раз';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setIsLoading(true);
        setMessage(null);

        // Оборачиваем весь процесс в дополнительный try-catch
        try {
            let result;
            
            if (mode === 'signin') {
                result = await handleSignIn(formData.email, formData.password);
                
                if (result.success) {
                    showMessage('success', 'Вход выполнен успешно! Перенаправляем...');
                } else {
                    const errorMessage = result.error?.code ? 
                        getFirebaseErrorMessage(result.error.code) : 
                        'Произошла ошибка при входе';
                    showMessage('error', errorMessage);
                    
                    // Очищаем только пароль при ошибке
                    setFormData(prev => ({ ...prev, password: '' }));
                }
            } else if (mode === 'signup') {
                result = await handleSignUp(formData.email, formData.password);
                
                if (result.success) {
                    showMessage('success', 'Регистрация успешна! Проверьте почту для подтверждения email.');
                    
                    // Очищаем форму после успешной регистрации
                    setFormData({
                        email: '',
                        password: '',
                        confirmPassword: '',
                        displayName: ''
                    });
                    
                    // Автоматически переключаемся на форму входа через 3 секунды
                    setTimeout(() => {
                        setMode('signin');
                    }, 3000);
                } else {
                    const errorMessage = result.error?.code ? 
                        getFirebaseErrorMessage(result.error.code) : 
                        'Произошла ошибка при регистрации';
                    showMessage('error', errorMessage);
                    
                    // Очищаем пароли, но оставляем email и имя
                    setFormData(prev => ({ 
                        ...prev, 
                        password: '',
                        confirmPassword: ''
                    }));
                }
            } else if (mode === 'reset') {
                result = await handlePasswordReset(formData.email);
                
                if (result.success) {
                    showMessage('success', 'Письмо для сброса пароля отправлено на вашу почту!');
                    
                    // Очищаем email и переключаемся на вход через 3 секунды
                    setFormData(prev => ({ ...prev, email: '' }));
                    setTimeout(() => {
                        setMode('signin');
                    }, 3000);
                } else {
                    const errorMessage = result.error?.code ? 
                        getFirebaseErrorMessage(result.error.code) : 
                        'Произошла ошибка при отправке письма';
                    showMessage('error', errorMessage);
                }
            }
        } catch (error) {
            // Последний резерв - если что-то пойдет не так
            console.error('Unexpected error in form submission:', error);
            showMessage('error', 'Произошла неожиданная ошибка. Попробуйте обновить страницу.');
        } finally {
            setIsLoading(false);
        }
    };

    // Остальной код компонента остается тем же...
    const resetForm = () => {
        setFormData({
            email: '',
            password: '',
            confirmPassword: '',
            displayName: ''
        });
        setMessage(null);
    };

    const switchMode = (newMode: AuthMode) => {
        setMode(newMode);
        resetForm();
    };

    const getTitle = () => {
        switch (mode) {
            case 'signin': return 'Вход в аккаунт';
            case 'signup': return 'Создание аккаунта';
            case 'reset': return 'Сброс пароля';
        }
    };

    const getButtonText = () => {
        switch (mode) {
            case 'signin': return 'Войти';
            case 'signup': return 'Создать аккаунт';
            case 'reset': return 'Отправить';
        }
    };

    const getButtonIcon = () => {
        switch (mode) {
            case 'signin': return <LogIn size={18} />;
            case 'signup': return <UserPlus size={18} />;
            case 'reset': return <Mail size={18} />;
        }
    };

    if (user) {
        return null;
    }

    return (
        <div className={s.authContainer}>
            <div className={s.authCard}>
                <div className={s.header}>
                    <div className={s.logo}>
                        <div className={s.logoIcon}>🎬</div>
                        <span>MovieApp</span>
                    </div>
                    <h1 className={s.title}>{getTitle()}</h1>
                    <p className={s.subtitle}>
                        {mode === 'signin' && 'Добро пожаловать! Войдите в свой аккаунт'}
                        {mode === 'signup' && 'Создайте аккаунт для доступа к функциям'}
                        {mode === 'reset' && 'Введите email для восстановления пароля'}
                    </p>
                </div>

                {message && (
                    <div className={`${s.message} ${s[message.type]}`}>
                        {message.type === 'success' ? (
                            <CheckCircle size={18} />
                        ) : (
                            <AlertCircle size={18} />
                        )}
                        <span>{message.text}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className={s.form}>
                    {mode === 'signup' && (
                        <div className={s.field}>
                            <label htmlFor="displayName">Имя</label>
                            <div className={s.inputWrapper}>
                                <User size={18} className={s.inputIcon} />
                                <input
                                    id="displayName"
                                    type="text"
                                    placeholder="Введите ваше имя"
                                    value={formData.displayName}
                                    onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                                    className={s.input}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                    )}

                    <div className={s.field}>
                        <label htmlFor="email">Email</label>
                        <div className={s.inputWrapper}>
                            <Mail size={18} className={s.inputIcon} />
                            <input
                                id="email"
                                type="email"
                                placeholder="Введите ваш email"
                                value={formData.email}
                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                className={s.input}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {mode !== 'reset' && (
                        <div className={s.field}>
                            <label htmlFor="password">
                                Пароль
                                {mode === 'signup' && (
                                    <span className={s.fieldHint}> (минимум 6 символов)</span>
                                )}
                            </label>
                            <div className={s.inputWrapper}>
                                <Lock size={18} className={s.inputIcon} />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder={mode === 'signup' ? 'Создайте надежный пароль' : 'Введите пароль'}
                                    value={formData.password}
                                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                    className={s.input}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className={s.passwordToggle}
                                    disabled={isLoading}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                    )}

                    {mode === 'signup' && (
                        <div className={s.field}>
                            <label htmlFor="confirmPassword">Подтвердите пароль</label>
                            <div className={s.inputWrapper}>
                                <Lock size={18} className={s.inputIcon} />
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Повторите пароль"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    className={s.input}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className={s.passwordToggle}
                                    disabled={isLoading}
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={s.submitButton}
                    >
                        {isLoading ? (
                            <div className={s.spinner} />
                        ) : (
                            <>
                                {getButtonIcon()}
                                {getButtonText()}
                            </>
                        )}
                    </button>
                </form>

                <div className={s.footer}>
                    {mode === 'signin' && (
                        <>
                            <p>
                                Нет аккаунта?{' '}
                                <button 
                                    onClick={() => switchMode('signup')}
                                    className={s.linkButton}
                                    disabled={isLoading}
                                >
                                    Создать аккаунт
                                </button>
                            </p>
                            <button 
                                onClick={() => switchMode('reset')}
                                className={s.linkButton}
                                disabled={isLoading}
                            >
                                Забыли пароль?
                            </button>
                        </>
                    )}

                    {mode === 'signup' && (
                        <p>
                            Уже есть аккаунт?{' '}
                            <button 
                                onClick={() => switchMode('signin')}
                                className={s.linkButton}
                                disabled={isLoading}
                            >
                                Войти
                            </button>
                        </p>
                    )}

                    {mode === 'reset' && (
                        <button 
                            onClick={() => switchMode('signin')}
                            className={s.backButton}
                            disabled={isLoading}
                        >
                            <ArrowLeft size={16} />
                            Назад к входу
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Auth;