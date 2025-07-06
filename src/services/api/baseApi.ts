import axios from 'axios';
import { API_CONFIG } from '@/config/constants';

export const kinopoiskApi = axios.create({
    baseURL: API_CONFIG.KINOPOISK.BASE_URL,
    headers: {
        'X-API-KEY': API_CONFIG.KINOPOISK.API_KEY,
        'Content-Type': 'application/json',
    },
});
