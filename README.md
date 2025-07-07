# Кинопоиск Movie App

## О проекте
Веб-приложение для поиска и просмотра информации о фильмах с использованием API Кинопоиска.

## Технологии
- Next.js
- TypeScript
- Redux Toolkit
- Firebase Authentication
- Tailwind CSS
- Kinopoisk API

## Функционал
- Авторизация пользователей
- Поиск фильмов
- Добавление фильмов в избранное
- Профиль пользователя (смена пароля, имени, email и его потверждение)
- Защищенные маршруты

## Установка и запуск

1. Клонировать репозиторий:```bash git clone [URL репозитория]```
2. Установить зависимости:```bash npm install```
3. Создать файл .env.local и добавить необходимые переменные окружения:
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_KINOPOISK_API_KEY=your_kinopoisk_api_key
NEXT_PUBLIC_KINOPOISK_BASE_UR
4. Запустить проект:```bash npm run dev```

## Структура проекта
- `/src/components` - React компоненты
- `/src/pages` - Страницы приложения
- `/src/redux` - Конфигурация Redux и слайсы
- `/src/lib` - Утилиты и конфигурации
- `/src/styles` - Глобальные стили

## Автор
[Kirill]
