import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/user/userSlice';
import moviesReducer from './features/movies/moviesSlice';

export const store = configureStore({
    reducer: {
        movies: moviesReducer,
        user: userReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;