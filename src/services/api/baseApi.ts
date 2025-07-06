import axios, {AxiosError} from 'axios';
import { API_CONFIG } from '@/config/constants';

export const kinopoiskApi = axios.create({
    baseURL: API_CONFIG.KINOPOISK.BASE_URL,
    headers: {
        'X-API-KEY': API_CONFIG.KINOPOISK.API_KEY,
        'Content-Type': 'application/json',
    },
});

// Функция для обработки ошибок API
export const handleApiError = (error: unknown): string => {
    if (error instanceof AxiosError) {
        // Если это ошибка от сервера
        if (error.response) {
            const status = error.response.status;
            switch (status) {
                case 400:
                    return 'Неверный запрос';
                case 401:
                    return 'Ошибка авторизации API';
                case 403:
                    return 'Доступ запрещен';
                case 404:
                    return 'Данные не найдены';
                case 429:
                    return 'Слишком много запросов. Попробуйте позже';
                case 500:
                    return 'Ошибка сервера';
                default:
                    return `Ошибка сервера: ${status}`;
            }
        }
        // Если это ошибка сети
        if (error.request) {
            return 'Ошибка подключения к серверу';
        }
        // Если это другая ошибка
        return error.message || 'Неизвестная ошибка';
    }
    // Если это не AxiosError
    if (error instanceof Error) {
        return error.message;
    }
    return 'Произошла неизвестная ошибка';
};

// Интерцептор для обработки ошибок
kinopoiskApi.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

