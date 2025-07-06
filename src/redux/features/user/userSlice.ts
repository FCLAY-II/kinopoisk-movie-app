import { createSlice } from '@reduxjs/toolkit';
import {User} from "@/types/user";
import type { RootState } from '@/redux/store';


interface UserState {
    user: User | null;
    authChecked: boolean; // Новый флаг для отслеживания инициализации
}

const initialState: UserState = {
    user: null,  // Здесь будем хранить информацию о текущем пользователе
    authChecked: false, // Новый флаг для отслеживания инициализации
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;  // Устанавливаем данные пользователя
            state.authChecked = true;
        },
        clearUser: (state) => {
            state.user = null;  // Очищаем данные пользователя
            state.authChecked = true;
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;

export const selectUser = (state: RootState) => state.user.user;
export const selectAuthChecked = (state: RootState) => state.user.authChecked;

export default userSlice.reducer;
